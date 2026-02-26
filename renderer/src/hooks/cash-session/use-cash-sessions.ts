import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { cashSessionsService } from "@/services/cash-sessions-service";
import { SucessMessage, ErrorMessage } from "@/utils/messages";
import { CashSession, CashSessionRequestFilters } from "@/types/cash-session";
import { usePagination } from "@/hooks/common";

export function useGetCashSessions(params: any) {
  return usePagination<CashSession>({
    endpoint: "/cash-sessions",
    queryKey: ["cash-sessions"],
    queryParams: params,
  });
}

export function useGetOpeningRequests(filters?: CashSessionRequestFilters) {
  return useQuery({
    queryKey: ["opening-requests", filters],
    queryFn: () => cashSessionsService.getOpeningRequests(filters as any),
  });
}

export function useGetCurrentSession(storeId?: string) {
  return useQuery({
    queryKey: ["current-cash-session", storeId],
    queryFn: () => cashSessionsService.getCurrentSession(storeId),
    retry: false,
  });
}

export function useOpenCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => cashSessionsService.openSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-sessions"] });
      SucessMessage("Caixa aberto com sucesso!");
    },
    onError: (error: any) => {
      ErrorMessage(
        error?.response?.data?.message || "Ocorreu um erro ao abrir o caixa",
      );
    },
  });
}

export function useUpdateCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      cashSessionsService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-sessions"] });
      SucessMessage("Sessão atualizada com sucesso");
    },
    onError: (error: any) => {
      ErrorMessage(
        error?.response?.data?.message || "Erro ao atualizar sessão",
      );
    },
  });
}

export function useDeleteCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cashSessionsService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-sessions"] });
      SucessMessage("Sessão excluída com sucesso");
    },
    onError: (error: any) => {
      ErrorMessage(error?.response?.data?.message || "Erro ao excluir sessão");
    },
  });
}
