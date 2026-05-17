"use client";

import { useFetch } from "../common/use-fetch";
import { usePagination } from "../common/use-pagination";
import { ItemResponse } from "@/types/items";
import { useMindPricingConfig } from "../pos";
import { useState, useEffect } from "react";
import { currentStoreStore } from "@/stores";

export function useGetItems(params?: {
  search?: string;
  categoryId?: string;
  type?: string;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.set("search", params.search);
  if (params?.categoryId) queryParams.set("categoryId", params.categoryId);
  if (params?.type) queryParams.set("type", params.type);
  queryParams.set("page", "1");
  queryParams.set("limit", (params?.limit || 100).toString());

  const { data, error, isLoading, refetch } = useFetch<any>(
    `items-for-pos-${params?.search || ""}-${params?.categoryId || ""}-${
      params?.type || ""
    }`,
    `/items?${queryParams.toString()}`,
  );

  const { isMindPricingEnabled, triggerPricingRecalculation } =
    useMindPricingConfig();
  const [items, setItems] = useState<any[]>([]);
  const { currentStore } = currentStoreStore();

  async function loadItems() {
    // 1. Tentar sempre buscar do SQLite Local primeiro (Velocidade e Offline-First)
    if (typeof window !== "undefined" && window.ipc?.sync?.searchItems) {
      try {
        const localItems = await window.ipc.sync.searchItems({
          search: params?.search,
          categoryId: params?.categoryId,
          storeId: currentStore?.id
        });

        if (localItems && localItems.length > 0) {
          setItems(localItems);
        }
      } catch (e) {
        console.error("Erro na busca local:", e);
      }
    }

    // 2. Se a API Cloud devolver dados (online), usamos esses como fonte de verdade mais recente
    if (data?.data || data?.items) {
      const fetchedItems = data?.data || data?.items || [];
      if (fetchedItems.length > 0) {
        setItems(fetchedItems);
      }
    } else if (!isLoading && items.length === 0) {
      setItems([]);
    }
  }

  useEffect(() => {
    loadItems();

    const handleStockUpdate = () => {
      console.log("🔄 [POS] Evento 'local-stock-updated' recebido. Recarregando itens...");
      loadItems();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("local-stock-updated", handleStockUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("local-stock-updated", handleStockUpdate);
      }
    };
  }, [data, isLoading, params?.search, params?.categoryId]);

  return { items, error, isLoading, refetch: loadItems };
}

export function useGetItemsPaginated(
  page: number = 1,
  limit: number = 10,
  params?: {
    search?: string;
    categoryId?: string;
    type?: string;
  },
) {
  return usePagination<ItemResponse>({
    endpoint: "/items",
    queryKey: ["items-paginated"],
    queryParams: {
      page,
      limit,
      ...params,
    },
  });
}
