import { SucessMessage } from "@/utils/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { InvoiceReceiptPayload } from "@/types";

export function useCreateInvoiceReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvoiceReceiptPayload) =>
      invoiceReceiptService.createInvoiceReceipt(data),
    onSuccess: (response) => {
      if (response?.data?.offline) {
        SucessMessage("Factura-recibo emitida com sucesso em modo offline.");
      } else {
        SucessMessage("Factura-recibo criada com sucesso.");
      }
      try {
        queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
      } catch (err) {
        console.warn("Aviso ao invalidar queries:", err);
      }
      return response.data;
    },
  });
}
