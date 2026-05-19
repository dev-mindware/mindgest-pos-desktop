import { api } from "./api";
import type { InvoiceReceiptPayload } from "@/types";

export const invoiceReceiptService = {
  createInvoiceReceipt: async (data: InvoiceReceiptPayload) => {
    try {
      const response = await api.post("/invoice/invoice-receipt", data);
      console.log("Resposta da API ao criar fatura recibo:", response);
      return response;
    } catch (error) {
       throw new Error("Erro ao criar fatura recibo:", error as undefined);
    }
  }
};

