import { api } from "./api";
import type { DownloadType, InvoicePayload } from "@/types";
import { CreditNoteFormData } from "@/schemas";
import { ReceiptData } from "@/types/receipt";
import { useAuthStore, currentStoreStore } from "@/stores";

export const invoiceService = {
  createInvoice: async (data: InvoicePayload) => {
    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
    if (!isOffline) {
      try {
        return await api.post("/invoice/normal", data);
      } catch (error: any) {
        const isNetworkError =
          !error.response ||
          error.code === "ERR_NETWORK" ||
          error.code === "ECONNABORTED" ||
          error.message?.includes("Network Error");

        if (!isNetworkError) throw error;
      }
    }

    if (typeof window !== "undefined") {
      const authUser = useAuthStore.getState().user;
      const currentStore = currentStoreStore.getState().currentStore;
      const storeId = data.storeId || currentStore?.id || authUser?.store?.id || "";
      const userId = authUser?.id || "";

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
                invoiceData: { ...data, idempotencyKey, documentType: "FT" },
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
          throw lanErr;
        }
      }

      if (window.ipc?.sync?.createInvoice) {
        const res = await window.ipc.sync.createInvoice({
          invoiceData: { ...data, documentType: "FT" } as any,
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

  downloadInvoice: (id: string, type: DownloadType) => {
    const endpointMap: Record<DownloadType, string> = {
      pdf: `/invoice/normal/${id}/download-pdf`,
      thermal: `/invoice/normal/${id}/download-thermal`,
    };

    return api.get(endpointMap[type], {
      responseType: "blob",
    });
  },

  generateReceipt: (data: ReceiptData) => api.post(`/invoice/receipt`, data),

  cancelInvoice: (id: string) => api.patch(`/invoice/normal/${id}/cancel`),

  createCreditNote: (id: string, data: CreditNoteFormData) =>
    api.post(`/credit-note/${id}/correction`, data),

  annulationNote: (
    id: string,
    reason: string,
    notes?: string,
    managerBarcode?: string,
  ) =>
    api.delete(`/credit-note/${id}/annulment`, {
      data: { reason, notes, managerBarcode },
    }),
};
