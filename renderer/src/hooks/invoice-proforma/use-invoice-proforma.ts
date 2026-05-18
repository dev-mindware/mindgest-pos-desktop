import { SucessMessage } from "@/utils/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proformaService } from "@/services";
import { EditProformaFormData, ProformaFormData } from "@/schemas";
import { ProformData } from "@/types";
import { useNetworkStatus } from "../common/use-network-status";
import { useOfflineStore } from "@/stores/offline/offline-store";
import { useAuth } from "../auth/use-auth";

export function useDeleteProforma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proformaService.deleteProforma(id),
    onSuccess: () => {
      SucessMessage("Proforma deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-proforma"] });
    },
  });
}

export function useCreateProforma() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: ProformData) => {
      if (typeof window !== "undefined" && window.ipc?.sync?.createProforma) {
        const storeId = data.storeId || (user as any)?.store?.id || (user as any)?.storeId || "";
        const result = await window.ipc.sync.createProforma({
          proformaData: data,
          storeId,
          userId: user?.id || "unknown",
        });
        return result;
      }
      
      // Fallback para ambiente puramente web
      return proformaService.createProforma(data);
    },
    onSuccess: (response) => {
      const isOffline = (response as any)?.offline;
      SucessMessage(
        isOffline
          ? "Proforma salva localmente com sucesso!"
          : "Proforma criada com sucesso!",
      );
      queryClient.invalidateQueries({ queryKey: ["invoice-proforma"] });
      return response.data;
    },
  });
}

export function useEditProforma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditProformaFormData }) =>
      proformaService.updateProforma(id, data),
    onSuccess: () => {
      SucessMessage("Proforma editada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-proforma"] });
    },
  });
}
