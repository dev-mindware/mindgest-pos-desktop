import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook genérico para buscar dados da api
 * @param key Chave para o cache do React Query
 * @param endpoint URL do endpoint da api
 * @param options Opções adicionais do React Query
 */
export function useFetch<T>(key: string, endpoint: string, options = {}) {
  return useQuery<T>({
    queryKey: [key],
    queryFn: async (): Promise<T> => {
      try {
        const response = await api.get<T>(endpoint);
        return response.data;
      } catch (error: any) {
        // Se for erro de rede e estivermos no Desktop, tenta fallback local
        if (!error.response && typeof window !== "undefined" && window.ipc?.sync) {
          console.warn(`🌐 [Offline] Falha ao carregar ${endpoint}. Tentando SQLite...`);
          
          const url = new URL(endpoint, "http://localhost"); // Auxiliar para parse de params
          const storeId = url.searchParams.get("storeId") || undefined;
          
          if (endpoint.includes("/items")) {
            const categoryId = url.searchParams.get("categoryId") || undefined;
            const data = await window.ipc.sync.searchItems({ storeId, categoryId });
            return { data } as any; // Formato esperado pelo frontend
          }
          
          if (endpoint.includes("/categories")) {
            const data = await window.ipc.sync.getCategories({ storeId });
            return { data } as any;
          }
          
          if (endpoint.includes("/clients")) {
            const data = await window.ipc.sync.searchClients({ storeId });
            return { data } as any;
          }
        }
        throw error;
      }
    },
    ...options,
  });
}
