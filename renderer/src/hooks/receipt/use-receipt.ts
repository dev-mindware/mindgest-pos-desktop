import { SucessMessage } from "@/utils/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { InvoiceReceiptPayload } from "@/types";
import { useNetworkStatus } from "../common/use-network-status";
import { useOfflineStore } from "@/stores/offline/offline-store";
import { useAuth } from "../auth/use-auth";

export function useCreateInvoiceReceipt() {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();
  const { addDocument } = useOfflineStore();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: InvoiceReceiptPayload) => {
      if (!isOnline) {
        // Document creation is now async due to SQLite IPC bridge
        const internalId = await addDocument(
          {
            type: "invoice-receipt",
            payload: data as any,
          },
          user?.id || "unknown",
        );

        // Return mock response for offline
        return { data: { id: internalId, offline: true } };
      }
      return invoiceReceiptService.createInvoiceReceipt(data);
    },
    onSuccess: (response) => {
      const isOffline = (response as any)?.offline;
      SucessMessage(
        isOffline
          ? "Fatura Recibo salva localmente!"
          : "Fatura Recibo criada com sucesso!",
      );
      queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
      return response.data;
    },
  });
}
