import { api } from "./api";
import type { InvoiceReceiptPayload } from "@/types";
import { useAuthStore, currentStoreStore } from "@/stores";

export const invoiceReceiptService = {
  createInvoiceReceipt: async (data: InvoiceReceiptPayload) => {
    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
    if (!isOffline) {
      try {
        return await api.post("/invoice/invoice-receipt", data);
      } catch (error: any) {
        // Se for erro de rede (offline, servidor inatingível, timeout), faz fallback transparente para local
        const isNetworkError =
          !error.response ||
          error.code === "ERR_NETWORK" ||
          error.code === "ECONNABORTED" ||
          error.message?.includes("Network Error");

        if (!isNetworkError) {
          throw error;
        }
      }
    }

    // Processamento Local Seguro: se for Terminal Slave, submete ao Master LAN; se for Master, emite localmente
    if (typeof window !== "undefined") {
      const authUser = useAuthStore.getState().user;
      const currentStore = currentStoreStore.getState().currentStore;
      const storeId = data.storeId || currentStore?.id || authUser?.store?.id || "";
      const userId = authUser?.id || "";

      // 1. Verificar se é Terminal Slave conectado a um Master na LAN
      if (window.ipc?.lan) {
        try {
          const lanConfig = await window.ipc.lan.getConfig();
          if (lanConfig?.terminalMode === "SLAVE" && lanConfig.masterIp) {
            const cleanIp = lanConfig.masterIp.trim().replace(/^http:\/\//, "").replace(/\/$/, "");
            const idempotencyKey = (data as any).idempotencyKey || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `IDEM-${Date.now()}-${Math.random()}`);

            const res = await fetch(`http://${cleanIp}:3333/api/invoice/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-idempotency-key": idempotencyKey,
                ...(lanConfig.lanSecret ? { "x-lan-secret": lanConfig.lanSecret } : {})
              },
              body: JSON.stringify({
                invoiceData: { ...data, idempotencyKey, documentType: "FR" },
                storeId,
                userId,
                terminalId: await window.ipc.security.getHardwareId()
              })
            });

            if (!res.ok) {
              const errJson = await res.json().catch(() => ({}));
              throw new Error(errJson.error || "Falha ao emitir fatura no Servidor Master LAN.");
            }

            const responseData = await res.json();
            return {
              data: {
                ...responseData.data,
                offline: true,
              }
            };
          }
        } catch (lanErr: any) {
          console.warn("⚠️ [LAN Slave Invoicing] Falha na emissão via Master LAN:", lanErr?.message);
          throw lanErr;
        }
      }

      // 2. Se for Master ou Standalone, emite diretamente no SQLite Local com assinatura oficial AGT
      if (window.ipc?.sync?.createInvoice) {
        const res = await window.ipc.sync.createInvoice({
          invoiceData: data,
          storeId,
          userId,
          user: authUser
            ? {
                id: authUser.id,
                email: authUser.email,
                name: authUser.name,
                role: authUser.role,
                storeId,
              }
            : undefined,
        });

        return {
          data: {
            ...res.data,
            offline: true,
          },
        };
      }
    }

    throw new Error("Não foi possível processar a fatura offline.");
  },
};

