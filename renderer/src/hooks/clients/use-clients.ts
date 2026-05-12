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

  useEffect(() => {
    async function loadClients() {
      setIsLoading(true);
      if (typeof window !== "undefined" && window.ipc?.sync?.searchClients) {
        try {
          const localClients = await window.ipc.sync.searchClients({
            search: params?.search,
            storeId: currentStore?.id
          });

          setClients(localClients || []);
        } catch (e) {
          console.error("❌ [Hook] Erro na busca local de clientes:", e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    loadClients();
  }, [params?.search, currentStore?.id]);

  return { clients, isLoading };
}
