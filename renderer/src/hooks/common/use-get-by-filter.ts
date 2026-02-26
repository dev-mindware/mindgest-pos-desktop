// src/hooks/useFetchWithFilter.ts
import { api } from "@/services/api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface UseFetchWithFilterOptions<T> {
  queryKey: string[];
  endpoint: string;
  filterName: string;
  filterValue: string;
}

export function useFetchWithFilter<T>(
  options: UseFetchWithFilterOptions<T>
): UseQueryResult<T[], Error> {
  const { queryKey, endpoint, filterName, filterValue } = options;

  return useQuery<T[], Error>({
    queryKey: [...queryKey, filterValue],
    queryFn: async (): Promise<T[]> => {
      const url = `${endpoint}?${filterName}=${filterValue}`;
      const response: AxiosResponse<T[]> = await api.get<T[]>(url);
      return response.data; // retorna apenas os dados
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!filterValue,
  });
}
