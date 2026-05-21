import { SucessMessage } from "@/utils/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { InvoiceReceiptPayload } from "@/types";
import { useNetworkStatus } from "../common/use-network-status";
import { useAuth } from "../auth/use-auth";
import { useOfflineStore } from "@/stores/offline/offline-store";

export function useCreateInvoiceReceipt() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { initialize } = useOfflineStore();

  return useMutation({
    mutationFn: async (data: InvoiceReceiptPayload) => {
      if (!user?.id) throw new Error("Usuário não autenticado para criar a fatura.");

      let localResult;

      if (typeof window !== "undefined" && window.ipc?.sync?.createInvoice) {
        localResult = await window.ipc.sync.createInvoice({
          invoiceData: data,
          storeId: data.storeId || user.store?.id || "",
          userId: user.id,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            storeId: user.storeId || user.store?.id,
          },
        });
      }

      if (!isOnline || localResult?.data?.offline) {
        return localResult;
      }

      return invoiceReceiptService.createInvoiceReceipt(data);
    },
    onSuccess: async (response) => {
      const isOffline = (response as any)?.offline;
      SucessMessage(
        isOffline
          ? "Fatura Recibo salva localmente com sucesso!"
          : "Fatura Recibo criada com sucesso!",
      );
      queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });

      if (isOffline && user?.id) {
        await initialize(user.id);
      }

      return response.data;
    },
  });
}