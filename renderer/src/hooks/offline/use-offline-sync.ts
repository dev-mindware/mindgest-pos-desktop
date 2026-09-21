"use client";
import { useEffect, useCallback, useRef } from "react";
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
  const { user } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("session-accessToken") : null;
  const lastQueueLengthRef = useRef<number>(0);
  const lastAttemptRef = useRef<number>(0);

  const sync = useCallback(async () => {
    if (isSyncing || queue.length === 0 || !isOnline || !token || !user?.id) return;

    setSyncing(true);
    console.log(`🔄 [SyncWorker] Iniciando sincronização em background para ${queue.length} documento(s)...`);

    try {
      if (window.ipc?.sync?.processOutbox) {
        const result = await window.ipc.sync.processOutbox({
          token,
          userId: user.id
        });

        if (result && result.processed > 0) {
          console.log(`✅ [SyncWorker] ${result.processed} documento(s) sincronizado(s) com sucesso.`);
          await initialize(user.id);
          SucessMessage(`${result.processed} documento(s) sincronizado(s) com sucesso!`);
          queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
          queryClient.invalidateQueries({ queryKey: ["proforma"] });
        } else {
          console.warn(`⚠️ [SyncWorker] Nenhum documento processado. Aguardando nova verificação.`);
          await initialize(user.id);
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
    if (!isOnline || queue.length === 0 || isSyncing || !token) return;

    const now = Date.now();
    const sameQueue = lastQueueLengthRef.current === queue.length;
    const recentAttempt = now - lastAttemptRef.current < 10000;

    if (sameQueue && recentAttempt) {
      return;
    }

    lastQueueLengthRef.current = queue.length;
    lastAttemptRef.current = now;
    sync();
  }, [isOnline, queue.length, isSyncing, sync, token]);

  useEffect(() => {
    if (!user?.id) return;

    // Check immediately and then every 5 seconds so pending counts update promptly
    initialize(user.id);
    const intervalId = window.setInterval(() => {
      initialize(user.id);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [user?.id, initialize]);

  return { isSyncing, sync, pendingCount: queue.length };
}
