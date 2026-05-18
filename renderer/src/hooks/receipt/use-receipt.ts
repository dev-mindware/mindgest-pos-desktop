import { SucessMessage } from "@/utils/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { InvoiceReceiptPayload } from "@/types";
import { useNetworkStatus } from "../common/use-network-status";
import { useOfflineStore } from "@/stores/offline/offline-store";
import { useAuth } from "../auth/use-auth";

export function useCreateInvoiceReceipt() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: InvoiceReceiptPayload) => {
      if (typeof window !== "undefined" && window.ipc?.sync?.createInvoice) {
        const storeId = data.storeId || (user as any)?.store?.id || (user as any)?.storeId || "";
        const result = await window.ipc.sync.createInvoice({
          invoiceData: data,
          storeId,
          userId: user?.id || "unknown",
        });
        return result;
      }
      
      // Fallback para ambiente puramente web
      return invoiceReceiptService.createInvoiceReceipt(data);
    },
    onSuccess: (response) => {
      const isOffline = (response as any)?.offline;
      SucessMessage(
        isOffline
          ? "Fatura Recibo salva localmente com sucesso!"
          : "Fatura Recibo criada com sucesso!",
      );
      queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
      return response.data;
    },
  });
}
