"use client";

import { useAuth } from "@/hooks/auth";
import { currentStoreStore } from "@/stores";
import { SucessMessage, ErrorMessage } from "@/utils/messages";

export function useItemActions() {
  const { user } = useAuth();
  const { currentStore } = currentStoreStore();

  const upsertItem = async (item: any) => {
    try {
      if (!currentStore?.id) throw new Error("Loja não selecionada.");
      const result = await window.ipc.sync.upsertItem(item, currentStore.id);
      SucessMessage("Produto salvo com sucesso!");
      return result;
    } catch (error: any) {
      ErrorMessage("Erro ao salvar produto: " + error.message);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      if (user?.role !== 'OWNER') {
        throw new Error("Apenas o proprietário (OWNER) pode eliminar produtos.");
      }
      await window.ipc.sync.deleteItem(id, user.role);
      SucessMessage("Produto eliminado com sucesso!");
    } catch (error: any) {
      ErrorMessage("Erro ao eliminar produto: " + error.message);
      throw error;
    }
  };

  return { upsertItem, deleteItem };
}
