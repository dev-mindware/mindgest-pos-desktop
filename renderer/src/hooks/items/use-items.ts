import { CreateItemData } from "@/types";
import { itemsService } from "@/services/items-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage, ErrorMessage } from "@/utils/messages";

export function useAddItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemData) => itemsService.addItem(data),
    onSuccess: () => {
      SucessMessage("Item adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateItemData> }) =>
      itemsService.updateItem(id, data),
    onSuccess: () => {
      SucessMessage("Item actualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemsService.deleteItem(id),
    onSuccess: () => {
      SucessMessage("Item removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error: any) => {
      ErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao remover o item."
      );
    },
  });
}

export function useToggleStatusItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemsService.toggleStatusItem(id),
    onSuccess: () => {
      SucessMessage("Status do item alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error: any) => {
      ErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao alterar o status do item."
      );
    },
  });
}
