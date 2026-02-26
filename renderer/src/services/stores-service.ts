import type { StoreData, StoreResponse } from "@/types";
import api from "./api";

export const storesService = {
  addStore: async (data: StoreData) => {
    return api.post<StoreResponse>("/stores", data);
  },
  updateStore: async (id: string, data: Partial<StoreData>) => {
    return api.put<StoreResponse>(`/stores/${id}`, data);
  },
  deleteStore: async (id: string) => {
    return api.delete<void>(`/stores/${id}`);
  },
  getStores: async () => {
    return api.get("/stores");
  },
  toggleStatusStore: async (id: string) => {
    return api.patch<StoreResponse>(`/stores/${id}/toggle-status`);
  },
};
