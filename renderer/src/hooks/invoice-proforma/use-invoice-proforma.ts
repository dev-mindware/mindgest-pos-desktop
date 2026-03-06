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
  const { isOnline } = useNetworkStatus();
  const { addDocument } = useOfflineStore();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: ProformData) => {
      if (!isOnline) {
        // Document creation is now async due to SQLite IPC bridge
        const internalId = await addDocument(
          {
            type: "proforma",
            payload: data as any,
          },
          user?.id || "unknown",
        );

        // Return mock response for offline
        return { data: { id: internalId, offline: true } };
      }
      return proformaService.createProforma(data);
    },
    onSuccess: (response) => {
      const isOffline = (response as any)?.offline;
      SucessMessage(
        isOffline
          ? "Proforma salva localmente!"
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
