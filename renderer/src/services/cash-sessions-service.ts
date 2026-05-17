import {
  CashSession,
  CashSessionRequestFilters,
  CashSessionRequest,
} from "@/types";
import { api } from "./api";

export const cashSessionsService = {
  getOpeningRequests: async (filters?: CashSessionRequestFilters) => {
    const params = new URLSearchParams();

    if (filters?.storeId) params.append("storeId", filters.storeId);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.userId) params.append("userId", filters.userId);

    const { data } = await api.get<CashSessionRequest[]>(
      `/cash-sessions/opening-requests?${params.toString()}`,
    );
    return data;
  },

  openSession: async (data: any) => {
    try {
      // Destructure to remove fields the Cloud API doesn't want (they are for our local SQLite)
      const { userId, openingBalance, ...apiData } = data;
      const response = await api.post("/cash-sessions/opening-sessions", apiData);
      
      // Persistir localmente se for sucesso online
      if (response.data && typeof window !== "undefined" && window.ipc?.sync?.persistCashSession) {
        await window.ipc.sync.persistCashSession({ session: response.data });
      }
      
      return response.data;
    } catch (error: any) {
      if (!error.response && typeof window !== "undefined" && window.ipc) {
        console.warn("🌐 [Offline] Tentando abrir sessão localmente...");
        return await window.ipc.sync.openCashSession({
          storeId: data.storeId,
          userId: data.userId,
          openingBalance: data.openingBalance
        });
      }
      throw error;
    }
  },

  getCurrentSession: async (storeId: string | undefined, userId?: string) => {
    try {
      const { data } = await api.get<CashSession>("/cash-sessions/current", {
        params: { storeId }
      });
      console.log("🌐 [Sync] Sessão atual obtida da Cloud com sucesso.");
      
      // Normalizar a resposta da Cloud para garantir que isOpen existe (baseado em status se necessário)
      const normalizedData = data ? {
        ...data,
        isOpen: data.isOpen ?? (data as any).status === "OPEN"
      } : null;

      // Se estamos no desktop e recebemos uma sessão válida, persistimos localmente para uso offline
      if (normalizedData && typeof window !== "undefined" && window.ipc?.sync?.persistCashSession) {
        try {
          console.log("💾 [Sync] Tentando persistir sessão no SQLite...", normalizedData.id);
          await window.ipc.sync.persistCashSession({ session: normalizedData });
          console.log("✅ [Sync] Sessão Cloud persistida localmente para uso offline.");
        } catch (persistError) {
          console.error("❌ [Sync] Erro crítico ao persistir sessão no SQLite:", persistError);
          // Não lançamos o erro aqui para permitir que a app continue com os dados da Cloud
        }
      }
      
      return normalizedData;
    } catch (error: any) {
      // Se for erro de rede e estivermos no Desktop, tenta o SQLite local
      if (!error.response && typeof window !== "undefined" && window.ipc) {
        console.warn("🌐 [Offline] Erro de conexão. Buscando sessão no SQLite local...");
        const localSession = await window.ipc.sync.getCurrentSession({ storeId, userId });
        if (localSession) {
          return {
            ...localSession,
            isOpen: localSession.status === "OPEN"
          } as any;
        }
        return null; // Return null instead of throwing to avoid "Connection Error" modal
      }
      throw error;
    }
  },

  getCashSessions: async (params: any) => {
    const { data } = await api.get("/cash-sessions", { params });
    return data;
  },

  requestOpening: async (data: { storeId?: string; message: string }) => {
    const response = await api.post("/cash-sessions/request-opening", data);
    return response.data;
  },

  registerExpense: async (data: {
    description: string;
    amount: number;
    cashSessionId: string;
  }) => {
    const response = await api.post("/cash-sessions/expenses", data);
    return response.data;
  },

  closeSession: async (
    id: string,
    data: { closingCash: number; totalSales: number; notes: string },
  ) => {
    try {
      const response = await api.patch(`/cash-sessions/${id}/close`, data);
      
      // Atualizar localmente para CLOSED
      if (typeof window !== "undefined" && window.ipc?.sync?.persistCashSession) {
        await window.ipc.sync.persistCashSession({ 
          session: { ...response.data, status: "CLOSED", isOpen: false } 
        });
      }
      
      return response.data;
    } catch (error: any) {
      if (!error.response && typeof window !== "undefined" && window.ipc) {
        return await window.ipc.sync.closeCashSession({
          sessionId: id,
          closingBalance: data.closingCash,
          totalSales: data.totalSales,
          totalExpenses: 0 // TODO: Calcular despesas se necessário
        });
      }
      throw error;
    }
  },

  updateSession: async (id: string, data: any) => {
    const response = await api.put(`/cash-sessions/${id}`, data);
    return response.data;
  },

  deleteSession: async (id: string) => {
    const response = await api.delete(`/cash-sessions/${id}`);
    return response.data;
  },
};
