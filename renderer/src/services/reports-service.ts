import type { OwnerDashboardData, ManagerDashboardData } from "@/types";
import api from "./api";

export const reportsService = {
  getOwnerDashboard: async () => {
    return api.get<OwnerDashboardData>("/reports/dashboard/global");
  },
  getManagerDashboard: async (storeId: string) => {
    return api.get<ManagerDashboardData>(`/reports/dashboard`, {
      params: { storeId },
    });
  },
};
