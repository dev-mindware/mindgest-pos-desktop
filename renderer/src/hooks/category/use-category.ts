"use client";
import { useEffect, useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePagination } from "../common/use-pagination";
import { Category, CategoryData, CategoryResponse } from "@/types/category";
import { currentStoreStore } from "@/stores";
import { categoryService } from "@/services/category-service";
import { SucessMessage } from "@/utils/messages";

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryData) => categoryService.addCategory(data),
    onSuccess: () => {
      SucessMessage("Categoria adicionada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      SucessMessage("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      SucessMessage("Categoria removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useToggleStatusCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.toggleStatusCategory(id),
    onSuccess: () => {
      SucessMessage("Status da categoria alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useGetCategories() {
  const { currentStore } = currentStoreStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const pagination = usePagination<Category>({
    endpoint: "/categories",
    queryKey: "categories",
    queryParams: {
      storeId: currentStore?.id,
    },
    enabled: !!currentStore?.id,
  });

  const loadLocalCategories = async () => {
    if (typeof window === "undefined" || !window.ipc?.sync?.getCategories || !currentStore?.id) {
      setCategories(pagination.data);
      setIsLocalLoading(false);
      return;
    }

    setIsLocalLoading(true);
    try {
      const localCategories = await window.ipc.sync.getCategories({ storeId: currentStore.id });
      if (localCategories && localCategories.length > 0) {
        console.log(`🔁 [POS] Carregando categorias locais: ${localCategories.length}`);
        setCategories(localCategories);
      } else {
        console.log(`🌐 [POS] Sem categorias locais — usando dados da Cloud: ${pagination.data?.length || 0}`);
        setCategories(pagination.data);
      }
    } catch (error) {
      console.error("❌ [Hook] Erro ao carregar categorias locais:", error);
      setCategories(pagination.data);
    } finally {
      setIsLocalLoading(false);
    }
  };

  useEffect(() => {
    loadLocalCategories();
  }, [currentStore?.id, pagination.data]);

  useEffect(() => {
    const handleLocalDataUpdated = () => {
      loadLocalCategories();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("local-data-updated", handleLocalDataUpdated);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("local-data-updated", handleLocalDataUpdated);
      }
    };
  }, [currentStore?.id]);

  const deduplicatedCategories = useMemo(() => {
    const map = new Map<string, Category>();
    for (const cat of categories) {
      const nameKey = cat.name.trim().toLowerCase();
      const existing = map.get(nameKey);
      if (existing) {
        existing.itemsCount = (existing.itemsCount || 0) + (cat.itemsCount || 0);
      } else {
        map.set(nameKey, { ...cat, itemsCount: cat.itemsCount || 0 });
      }
    }
    return Array.from(map.values());
  }, [categories]);

  const categoryOptions = useMemo(() => {
    return deduplicatedCategories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }, [deduplicatedCategories]);

  return {
    ...pagination,
    categoryOptions,
    categories: deduplicatedCategories,
    isLoading: pagination.isLoading || isLocalLoading,
    // Backward compatibility
    error: pagination.isError,
    pagination: {
      page: pagination.page,
      totalPages: pagination.totalPages,
      total: pagination.total,
    },
  };
}
