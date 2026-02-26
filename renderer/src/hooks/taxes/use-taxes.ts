"use client";
import { useQuery } from "@tanstack/react-query";
import { taxesService } from "@/services";

export function useGetTaxes() {
  const { data, ...rest } = useQuery({
    queryKey: ["taxes"],
    queryFn: () => taxesService.get(),
  });

  const taxOptions =
    data?.map((tax) => ({
      label: `${tax.name} (${tax.rate}%)`,
      value: tax.id,
    })) || [];

  return {
    ...rest,
    taxes: data || [],
    taxOptions: [{ label: "Isento (0%)", value: "" }, ...taxOptions],
  };
}
