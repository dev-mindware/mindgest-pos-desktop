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
    let localItems: any[] = [];

    if (typeof window !== "undefined" && window.ipc?.sync?.searchItems) {
      try {
        localItems = await window.ipc.sync.searchItems({
          search: params?.search,
          categoryId: params?.categoryId,
          storeId: currentStore?.id,
        });

        if (localItems && localItems.length > 0) {
          console.log(`🔁 [POS] Carregando itens locais: ${localItems.length} items encontrados`);
          setItems(localItems);
          return;
        }
      } catch (e) {
        console.error("Erro na busca local:", e);
      }
    }

    if (data?.data || data?.items) {
      const fetchedItems = data?.data || data?.items || [];
      if (fetchedItems.length > 0) {
        console.log(`🌐 [POS] Carregando itens da Cloud: ${fetchedItems.length} items encontrados`);
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

    const handleLocalDataUpdated = () => {
      console.log("🔄 [Sync] Evento 'local-data-updated' recebido. Recarregando itens locais...");
      loadItems();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("local-stock-updated", handleStockUpdate);
      window.addEventListener("local-data-updated", handleLocalDataUpdated);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("local-stock-updated", handleStockUpdate);
        window.removeEventListener("local-data-updated", handleLocalDataUpdated);
      }
    };
  }, [data, isLoading, params?.search, params?.categoryId, currentStore?.id]);

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
