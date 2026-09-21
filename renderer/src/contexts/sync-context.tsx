"use client";

import React, { createContext, useContext, useEffect, useRef, useCallback } from "react";
import { useNetworkStatus } from "@/hooks/common/use-network-status";
import { useAuth } from "@/hooks/auth";
import { currentStoreStore } from "@/stores";
import { useOfflineStore } from "@/stores/offline/offline-store";

interface SyncContextType {
  isSyncing: boolean;
  pendingCount: number;
  triggerManualSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { isOnline } = useNetworkStatus();
  const { user } = useAuth();
  const { currentStore } = currentStoreStore();
  const token = typeof window !== "undefined" ? localStorage.getItem("session-accessToken") : null;

  // Single Source of Truth from useOfflineStore
  const isSyncing = useOfflineStore((s) => s.isSyncing);
  const pendingCount = useOfflineStore((s) => s.pendingCount);
  const initialize = useOfflineStore((s) => s.initialize);
  const refreshPendingCount = useOfflineStore((s) => s.refreshPendingCount);

  const autoSyncStartedRef = useRef(false);
  const lastAutoSyncStoreIdRef = useRef<string | null>(null);
  const startAutoSyncInProgressRef = useRef(false);

  // Initialize store and IPC subscriptions on mount
  useEffect(() => {
    if (user?.id) {
      initialize(user.id);
    }
  }, [user?.id, initialize]);

  const triggerManualSync = useCallback(async () => {
    const storeId =
      user?.storeId ||
      user?.store?.id ||
      user?.company?.stores?.[0]?.id ||
      currentStore?.id;

    if (!token || !user?.id || !storeId || !isOnline) return;

    if (window.ipc?.sync?.triggerSync) {
      await window.ipc.sync.triggerSync({
        token,
        storeId,
        userId: user.id,
      });
    } else if (window.ipc?.sync?.processOutbox) {
      await window.ipc.sync.processOutbox({
        token,
        userId: user.id,
      });
    }
    await refreshPendingCount();
  }, [user?.id, user?.storeId, user?.store?.id, user?.company?.stores, currentStore?.id, token, isOnline, refreshPendingCount]);

  // Main process Auto-Sync lifecycle
  useEffect(() => {
    const storeId =
      user?.storeId ||
      user?.store?.id ||
      user?.company?.stores?.[0]?.id ||
      currentStore?.id;

    const startAutoSync = async (requestedStoreId: string) => {
      if (!window.ipc?.sync?.startAutoSync) return;
      if (!token || !user?.id || !requestedStoreId) return;

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
          intervalMs: 2 * 60 * 1000,
        });

        if (result?.started) {
          autoSyncStartedRef.current = true;
          lastAutoSyncStoreIdRef.current = requestedStoreId;
          console.log(`✅ [SyncProvider] Auto-sync em execução para storeId=${requestedStoreId}.`);

          const runResult = (result as any).runResult;
          const changed = !!(
            (runResult?.outbox?.processed ?? 0) > 0 ||
            (runResult?.categories?.count ?? 0) > 0 ||
            (runResult?.clients?.count ?? 0) > 0 ||
            (runResult?.products?.count ?? 0) > 0
          );

          if (changed) {
            window.dispatchEvent(new Event("local-data-updated"));
          }
          await refreshPendingCount();
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
  }, [user?.id, user?.storeId, user?.store?.id, user?.company?.stores, currentStore?.id, token, isOnline, refreshPendingCount]);

  // Recovery Polling: 10s conditional fallback check when there are pending items or upon regaining focus/network
  useEffect(() => {
    if (!user?.id) return;

    // Fast check on window focus
    const handleVisibility = () => {
      if (!document.hidden) {
        refreshPendingCount();
      }
    };
    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("online", () => refreshPendingCount());

    // 10s recovery polling only when pendingCount > 0 or during sync
    const interval = setInterval(() => {
      if (pendingCount > 0 || isSyncing) {
        refreshPendingCount();
      }
    }, 10000);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("online", () => refreshPendingCount());
      clearInterval(interval);
    };
  }, [user?.id, pendingCount, isSyncing, refreshPendingCount]);

  return (
    <SyncContext.Provider value={{ isSyncing, pendingCount, triggerManualSync }}>
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

