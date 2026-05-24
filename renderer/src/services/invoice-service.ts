import { api } from "./api";
import type { DownloadType, InvoicePayload } from "@/types";
import { CreditNoteFormData } from "@/schemas";
import { ReceiptData } from "@/types/receipt";

export const invoiceService = {
  createInvoice: (data: InvoicePayload) => api.post("/invoice/invoice-receipt", data),

  downloadInvoice: (id: string, type: DownloadType) => {
    const endpointMap: Record<DownloadType, string> = {
      pdf: `/invoice/invoice-receipt/${id}/download-pdf`,
      thermal: `/invoice/invoice-receipt/${id}/download-thermal`,
    };

    return api.get(endpointMap[type], {
      responseType: "blob",
    });
  },

  generateReceipt: (data: ReceiptData) => api.post(`/invoice/receipt`, data),

  cancelInvoice: (id: string) => api.patch(`/invoice/invoice-receipt/${id}/cancel`),

  createCreditNote: (id: string, data: CreditNoteFormData) =>
    api.post(`/credit-note/${id}/correction`, data),

  annulationNote: (id: string, reason: string, notes: string) =>
    api.delete(`/credit-note/${id}/annulment`, {
      data: { reason, notes },
    }),
};
