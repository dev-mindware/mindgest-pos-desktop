"use client";
import { useEffect, useCallback } from "react";
import { useNetworkStatus } from "@/hooks/common/use-network-status";
import { useOfflineStore } from "@/stores/offline/offline-store";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { proformaService } from "@/services/proforma-service";
import { SucessMessage, ErrorMessage } from "@/utils/messages";
import { useQueryClient } from "@tanstack/react-query";

export function useOfflineSync() {
  const { isOnline } = useNetworkStatus();
  const { queue, isSyncing, setSyncing, removeFromQueue } = useOfflineStore();
  const queryClient = useQueryClient();

  const sync = useCallback(async () => {
    if (isSyncing || queue.length === 0 || !isOnline) return;

    setSyncing(true);
    console.log(`Starting sync for ${queue.length} documents...`);

    for (const doc of queue) {
      try {
        if (doc.type === "invoice-receipt") {
          await invoiceReceiptService.createInvoiceReceipt(doc.payload as any);
        } else if (doc.type === "proforma") {
          await proformaService.createProforma(doc.payload as any);
        }

        removeFromQueue(doc.internalId);
        console.log(`Synced document ${doc.internalId} successfully.`);
      } catch (error) {
        console.error(`Failed to sync document ${doc.internalId}:`, error);
        // We stop sync for other documents if one fails to maintain order/consistency?
        // Or should we continue? Given it's automatic, let's continue with others if they are independent.
        // For now, let's continue to attempt syncing the rest.
      }
    }

    SucessMessage("Sincronização concluída!");
    queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
    queryClient.invalidateQueries({ queryKey: ["proforma"] });
    setSyncing(false);
  }, [isOnline, queue, isSyncing, removeFromQueue, setSyncing, queryClient]);

  useEffect(() => {
    if (isOnline && queue.length > 0 && !isSyncing) {
      sync();
    }
  }, [isOnline, queue.length, isSyncing, sync]);

  return { isSyncing, sync, pendingCount: queue.length };
}
