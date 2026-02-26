import type { SupplierData, SupplierResponse } from "@/types";
import api from "./api";

export const suppliersService = {
  addSupplier: async (data: SupplierData) => {
    return api.post<SupplierResponse>("/suppliers", data);
  },
  updateSupplier: async (id: string, data: Partial<SupplierData>) => {
    return api.put<SupplierResponse>(`/suppliers/${id}`, data);
  },
  deleteSupplier: async (id: string) => {
    return api.delete<void>(`/suppliers/${id}`);
  },
  getSuppliers: async () => {
    return api.get("/suppliers");
  },
};
