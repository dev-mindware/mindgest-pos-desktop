"use client";

import { useAuth } from "@/hooks/auth";
import { currentStoreStore } from "@/stores";
import { SucessMessage, ErrorMessage } from "@/utils/messages";

export function useClientActions() {
  const { user } = useAuth();
  const { currentStore } = currentStoreStore();

  const upsertClient = async (client: any) => {
    try {
      if (!currentStore?.id) throw new Error("Loja não selecionada.");
      const result = await window.ipc.sync.upsertClient(client, currentStore.id);
      SucessMessage("Cliente salvo com sucesso!");
      return result;
    } catch (error: any) {
      ErrorMessage("Erro ao salvar cliente: " + error.message);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      if (user?.role !== 'OWNER') {
        throw new Error("Apenas o proprietário (OWNER) pode eliminar clientes.");
      }
      await window.ipc.sync.deleteClient(id, user.role);
      SucessMessage("Cliente eliminado com sucesso!");
    } catch (error: any) {
      ErrorMessage("Erro ao eliminar cliente: " + error.message);
      throw error;
    }
  };

  return { upsertClient, deleteClient };
}
