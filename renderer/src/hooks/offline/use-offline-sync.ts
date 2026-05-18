"use client";
import { useEffect, useCallback } from "react";
import { useNetworkStatus } from "@/hooks/common/use-network-status";
import { useOfflineStore } from "@/stores/offline/offline-store";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { proformaService } from "@/services/proforma-service";
import { SucessMessage, ErrorMessage } from "@/utils/messages";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/auth/use-auth";

export function useOfflineSync() {
  const { isOnline } = useNetworkStatus();
  const { queue, isSyncing, setSyncing, initialize } = useOfflineStore();
  const queryClient = useQueryClient();
  const { user, token } = useAuth();

  const sync = useCallback(async () => {
    if (isSyncing || queue.length === 0 || !isOnline || !token) return;

    setSyncing(true);
    console.log(`🔄 [SyncWorker] Iniciando sincronização em background para ${queue.length} documento(s)...`);

    try {
      if (window.ipc?.sync?.processOutbox) {
        const result = await window.ipc.sync.processOutbox({
          token,
          userId: user?.id || "unknown"
        });

        if (result && result.processed > 0) {
          console.log(`✅ [SyncWorker] ${result.processed} documento(s) sincronizado(s) com sucesso.`);
          
          // Recarregar contagem de outbox na store reativa
          await initialize(user?.id || "unknown");
          
          SucessMessage(`${result.processed} documento(s) sincronizado(s) com sucesso!`);
          queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
          queryClient.invalidateQueries({ queryKey: ["proforma"] });
        }
      }
    } catch (error: any) {
      console.error("❌ [SyncWorker] Erro ao sincronizar outbox em background:", error);
      ErrorMessage("Erro ao sincronizar documentos com o servidor.");
    } finally {
      setSyncing(false);
    }
  }, [isOnline, queue.length, isSyncing, token, user?.id, initialize, queryClient]);

  useEffect(() => {
    if (isOnline && queue.length > 0 && !isSyncing && token) {
      sync();
    }
  }, [isOnline, queue.length, isSyncing, sync, token]);

  return { isSyncing, sync, pendingCount: queue.length };
}
