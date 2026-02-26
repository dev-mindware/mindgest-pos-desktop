/**
 * Baixa documento térmico de Fatura-Recibo e retorna URL do blob
 * @param invoiceReceiptId - ID da fatura-recibo
 * @returns URL do blob para exibir no modal
 */
export async function getThermalInvoiceUrl(
  invoiceReceiptId: string,
): Promise<string> {
  try {
    // Importar serviço de download
    const { downloadDocument } =
      await import("@/services/download-invoice-service");

    const response = await downloadDocument(
      invoiceReceiptId,
      "invoice-receipt",
      "thermal",
    );
    const blob = response.data;

    // Criar e retornar URL do blob
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error("Erro ao baixar fatura-recibo térmica:", error);
    throw error;
  }
}
