"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useNetworkStatus } from "@/hooks/common/use-network-status";
import { useAuth } from "@/hooks/auth";
import { useOfflineStore } from "@/stores/offline/offline-store";

interface SyncContextType {
  isSyncing: boolean;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { isOnline } = useNetworkStatus();
  const { user, token } = useAuth();
  const { queue, setSyncing, isSyncing } = useOfflineStore();
  const lastSyncRef = useRef<number>(0);

  const processSync = async () => {
    if (!isOnline || !token || !user?.id || queue.length === 0 || isSyncing) {
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
