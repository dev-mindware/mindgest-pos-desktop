"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useNetworkStatus } from "@/hooks/common/use-network-status";
import { useAuth } from "@/hooks/auth";
import { currentStoreStore } from "@/stores";
import { useOfflineStore } from "@/stores/offline/offline-store";

interface SyncContextType {
  isSyncing: boolean;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { isOnline } = useNetworkStatus();
  const { user } = useAuth();
  const { currentStore } = currentStoreStore();
  const token = typeof window !== "undefined" ? localStorage.getItem("session-accessToken") : null;
  const { queue, setSyncing, isSyncing } = useOfflineStore();
  const lastSyncRef = useRef<number>(0);
  const autoSyncStartedRef = useRef(false);
  const lastAutoSyncStoreIdRef = useRef<string | null>(null);
  const startAutoSyncInProgressRef = useRef(false);

  const processSync = async () => {
    if (autoSyncStartedRef.current || !isOnline || !token || !user?.id || queue.length === 0 || isSyncing) {
      return;
    }

    // Debounce: Only try to sync every 30 seconds if queue is not empty
    const now = Date.now();
    if (now - lastSyncRef.current < 30000) return;
    lastSyncRef.current = now;

    console.log("🔄 [SyncWorker] Invocando processamento de outbox...");
    setSyncing(true);
    
    try {
      if (window.ipc?.sync?.processOutbox) {
        const result = await window.ipc.sync.processOutbox({
          token,
          userId: user.id
        });
        
        if (result && result.processed > 0) {
          console.log(`✅ [SyncWorker] ${result.processed} documentos sincronizados com sucesso.`);
          // Refresh queue in store
          const { initialize } = useOfflineStore.getState();
          await initialize(user.id);
        }
      }
    } catch (error) {
      console.error("❌ [SyncWorker] Erro ao processar outbox:", error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    const storeId =
      user?.storeId ||
      user?.store?.id ||
      user?.company?.stores?.[0]?.id ||
      currentStore?.id;

    const startAutoSync = async (requestedStoreId: string) => {
      if (!window.ipc?.sync?.startAutoSync) return;
      if (!token || !user?.id || !requestedStoreId) {
        if (!requestedStoreId) {
          console.warn("[SyncProvider] storeId não disponível para iniciar auto-sync. user company stores:", user?.company?.stores);
        }
        return;
      }

      if (startAutoSyncInProgressRef.current) return;
      startAutoSyncInProgressRef.current = true;

      if (autoSyncStartedRef.current && lastAutoSyncStoreIdRef.current === requestedStoreId) {
        startAutoSyncInProgressRef.current = false;
        return;
      }

      if (autoSyncStartedRef.current) {
        await stopAutoSync();
      }

      try {
        const result = await window.ipc.sync.startAutoSync({
          token,
          userId: user.id,
          storeId: requestedStoreId,
          intervalMs: 5 * 60 * 1000,
        });

        if (result?.started) {
          autoSyncStartedRef.current = true;
          lastAutoSyncStoreIdRef.current = requestedStoreId;
          console.log(`✅ [SyncProvider] Auto-sync iniciado com intervalo de ${result.intervalMs}ms para storeId=${requestedStoreId}.`);

          // The start call now returns the first run result as `runResult` (when available).
          const runResult = (result as any).runResult;
          const changed = !!(
            (runResult?.outbox?.processed ?? 0) > 0 ||
            (runResult?.categories?.count ?? 0) > 0 ||
            (runResult?.clients?.count ?? 0) > 0 ||
            (runResult?.products?.count ?? 0) > 0
          );

          if (changed) {
            window.dispatchEvent(new Event("local-data-updated"));
          } else {
            console.log("[SyncProvider] Auto-sync inicial não trouxe alterações locais (runResult):", runResult);
          }
        }
      } catch (error) {
        console.error("❌ [SyncProvider] Falha ao iniciar auto-sync:", error);
      } finally {
        startAutoSyncInProgressRef.current = false;
      }
    };

    const stopAutoSync = async () => {
      if (!autoSyncStartedRef.current || !window.ipc?.sync?.stopAutoSync) return;
      try {
        await window.ipc.sync.stopAutoSync();
      } catch (error) {
        console.error("❌ [SyncProvider] Falha ao parar auto-sync:", error);
      } finally {
        autoSyncStartedRef.current = false;
        lastAutoSyncStoreIdRef.current = null;
      }
    };

    if (user?.id && token && isOnline && storeId) {
      startAutoSync(storeId);
    } else {
      stopAutoSync();
    }

    return () => {
      stopAutoSync();
    };
  }, [user?.id, user?.storeId, user?.store?.id, user?.company?.stores?.[0]?.id, currentStore?.id, token, isOnline]);

  useEffect(() => {
    // Attempt sync when coming back online
    if (isOnline) {
      processSync();
    }
  }, [isOnline]);

  useEffect(() => {
    // Check queue periodically if online
    const interval = setInterval(() => {
      if (isOnline) processSync();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [isOnline, token, user?.id, queue.length]);

  return (
    <SyncContext.Provider value={{ isSyncing }}>
      {children}
    </SyncContext.Provider>
  );
}

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return context;
};
