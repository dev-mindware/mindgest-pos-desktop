import { useMutation, useQueryClient } from "@tanstack/react-query";
import { suppliersService } from "@/services/suppliers-service";
import { SucessMessage } from "@/utils/messages";
import { SupplierData } from "@/types";
import { useFetch } from "../common/use-fetch";

export function useGetSuppliers() {
  const { data, error, isLoading, refetch } = useFetch<any>(
    "suppliers",
    "/suppliers?page=1&limit=100"
  );

  const suppliers =
    data?.data.map((supplier: any) => ({
      label: `${supplier.name}`,
      value: supplier.id,
    })) || [];

  return {
    suppliers,
    suppliersData: data?.data || [],
    error,
    isLoading,
    refetch,
  };
}

export function useAddSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplierData) => suppliersService.addSupplier(data),
    onSuccess: () => {
      SucessMessage("Fornecedor adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierData> }) =>
      suppliersService.updateSupplier(id, data),
    onSuccess: () => {
      SucessMessage("Fornecedor atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suppliersService.deleteSupplier(id),
    onSuccess: () => {
      SucessMessage("Fornecedor removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
