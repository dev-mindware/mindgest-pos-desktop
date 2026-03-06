"use client";

import { useFetch } from "../common/use-fetch";
import { usePagination } from "../common/use-pagination";
import { ItemResponse } from "@/types/items";
import { useMindPricingConfig } from "../pos";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    async function loadItems() {
      // If MIND features are Disabled, skip SQLite completely
      if (!isMindPricingEnabled) {
        setItems(data?.data || []);
        return;
      }

      // If MIND features are Enabled, intercept data and use DB as source of truth for dynamic prices
      if (typeof window !== "undefined" && window.ipc?.db?.getCachedProducts) {
        try {
          const fetchedItems = Array.isArray(data)
            ? data
            : data?.data || data?.items;

          if (
            fetchedItems &&
            Array.isArray(fetchedItems) &&
            fetchedItems.length > 0
          ) {
            await window.ipc.db.updateProductsCache(fetchedItems);
            await triggerPricingRecalculation(); // Tell Python microservice to crunch new prices
          }

          // Delay slightly to let the background job finish replacing prices
          setTimeout(async () => {
            let cached = await window.ipc.db.getCachedProducts();
            if (cached && cached.length > 0) {
              // Apply search filters
              if (params?.search) {
                const searchLower = params.search.toLowerCase();
                cached = cached.filter(
                  (c: any) =>
                    c.name?.toLowerCase().includes(searchLower) ||
                    c.reference?.toLowerCase().includes(searchLower) ||
                    c.barcode?.toLowerCase().includes(searchLower),
                );
              }
              if (params?.categoryId) {
                cached = cached.filter(
                  (c: any) => c.categoryId === params.categoryId,
                );
              }
              setItems(cached);
              return;
            }
          }, 300); // 300ms breather
          return;
        } catch (e) {
          console.error("Error loading cached MIND priced products", e);
        }
      }

      // Final fallback
      setItems(data?.data || []);
    }

    loadItems();
  }, [data, params?.search, params?.categoryId, isMindPricingEnabled]);

  return { items, error, isLoading, refetch };
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
