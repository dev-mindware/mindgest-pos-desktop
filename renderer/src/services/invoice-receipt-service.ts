import { api } from "./api";
import type { InvoiceReceiptPayload } from "@/types";

export const invoiceReceiptService = {
  createInvoiceReceipt: async (data: InvoiceReceiptPayload) => {
    try {
      console.log("📡 [InvoiceReceiptService] POST /invoice/invoice-receipt");
      console.log("📡 [InvoiceReceiptService] Payload:", JSON.stringify(data, null, 2));
      
      const response = await api.post("/invoice/invoice-receipt", data);
      
      console.log("✅ [InvoiceReceiptService] Resposta da API:", response);
      return response;
    } catch (error: any) {
      console.error("❌ [InvoiceReceiptService] Erro ao criar factura recibo:");
      console.error("  Status:", error?.response?.status);
      console.error("  Message:", error?.message);
      console.error("  Data:", error?.response?.data);
      throw error;
    }
  }
};

