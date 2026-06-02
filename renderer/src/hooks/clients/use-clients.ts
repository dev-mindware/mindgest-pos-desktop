"use client";

import { useState, useEffect } from "react";
import { currentStoreStore } from "@/stores";

export function useGetClients(params?: {
  search?: string;
  limit?: number;
}) {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentStore } = currentStoreStore();

  async function loadClients() {
    setIsLoading(true);
    if (typeof window !== "undefined" && window.ipc?.sync?.searchClients) {
      try {
        const localClients = await window.ipc.sync.searchClients({
          search: params?.search,
          storeId: currentStore?.id
        });

        if (localClients && localClients.length > 0) {
          console.log(`🔁 [POS] Carregando clientes locais: ${localClients.length}`);
          setClients(localClients || []);
        } else {
          console.log("🌐 [POS] Sem clientes locais — mantendo lista vazia (cloud fallback não acionado aqui)");
          setClients(localClients || []);
        }
      } catch (e) {
        console.error("❌ [Hook] Erro na busca local de clientes:", e);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, [params?.search, currentStore?.id]);

  useEffect(() => {
    const handleLocalDataUpdated = () => {
      console.log("🔄 [Sync] Evento 'local-data-updated' recebido. Recarregando clientes locais...");
      loadClients();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("local-data-updated", handleLocalDataUpdated);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("local-data-updated", handleLocalDataUpdated);
      }
    };
  }, []);

  return { clients, isLoading, refetch: loadClients };
}
