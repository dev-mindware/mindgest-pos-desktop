import { api } from "./api";
import type { InvoiceReceiptPayload } from "@/types";
import { useAuthStore, currentStoreStore } from "@/stores";

export const invoiceReceiptService = {
  createInvoiceReceipt: async (data: InvoiceReceiptPayload) => {
    // 1. Se for Terminal Slave na rede LAN, submete SEMPRE ao Servidor Master LAN
    // Garante numeração fiscal atómica (AGT) e funcionamento resiliente sem internet
    if (typeof window !== "undefined" && window.ipc?.lan) {
      try {
        const lanConfig = await window.ipc.lan.getConfig();
        if (lanConfig?.terminalMode === "SLAVE" && lanConfig.masterIp) {
          const rawIp = lanConfig.masterIp.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
          const cleanIp = rawIp.includes(":") ? rawIp.split(":")[0] : rawIp;
          const idempotencyKey = (data as any).idempotencyKey || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `IDEM-${Date.now()}-${Math.random()}`);
          const authUser = useAuthStore.getState().user;
          const currentStore = currentStoreStore.getState().currentStore;
          const storeId = data.storeId || currentStore?.id || authUser?.store?.id || "";
          const userId = authUser?.id || "";

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

    // 2. Se for Master ou Standalone com ligação, tenta a Cloud
    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
    if (!isOffline) {
      try {
        return await api.post("/invoice/invoice-receipt", data);
      } catch (error: any) {
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

    // 3. Emissão Local Direta no Master/Standalone via SQLite e assinatura oficial AGT
    if (typeof window !== "undefined" && window.ipc?.sync?.createInvoice) {
      const authUser = useAuthStore.getState().user;
      const currentStore = currentStoreStore.getState().currentStore;
      const storeId = data.storeId || currentStore?.id || authUser?.store?.id || "";
      const userId = authUser?.id || "";

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

      // Update offline outbox count immediately
      if (userId) {
        import("@/stores/offline").then(({ useOfflineStore }) => {
          useOfflineStore.getState().initialize(userId);
        }).catch(() => {});
      }

      return {
        data: {
          ...res.data,
          offline: true,
        },
      };
    }

    throw new Error("Não foi possível processar a fatura offline.");
  },
};

