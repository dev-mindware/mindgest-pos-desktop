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
  const { queue, isSyncing, setSyncing, removeFromQueue, products } = useOfflineStore();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const sync = useCallback(async () => {
    if (isSyncing || queue.length === 0 || !isOnline) return;

    setSyncing(true);
    console.log(`Starting sync for ${queue.length} documents...`);

    let syncedCount = 0;

    for (const doc of queue) {
      try {
        // Sanitizar payload para resolver documentos pendentes com estrutura antiga
        const payload = { ...doc.payload } as any;
        
        // 1. Resolver conflitos de Cliente (Mapear SQLite UUID/NIF/Email -> Cloud API CUID via IPC)
        if (payload.client) {
          if (typeof window !== "undefined" && window.ipc?.db?.getClientCloudId) {
            try {
              const cloudId = await window.ipc.db.getClientCloudId({
                id: payload.client.id,
                nif: payload.client.taxNumber || (payload.client as any).nif,
                email: payload.client.email
              });
              
              if (cloudId) {
                payload.client.id = cloudId;
              } else {
                // Se ainda for um UUID local sem correspondência na Cloud, ou não tiver ID,
                // removemos o ID para o API criar como novo cliente
                const isLocalUuid = payload.client.id && payload.client.id.includes("-");
                if (isLocalUuid || !payload.client.id) {
                  delete payload.client.id;
                }
              }
            } catch (err) {
              console.error("Erro ao buscar cloudId do cliente via IPC:", err);
              if (payload.client.id && payload.client.id.includes("-")) {
                delete payload.client.id; // Fallback seguro
              }
            }
          } else {
            if (payload.client.id && payload.client.id.includes("-")) {
              delete payload.client.id;
            }
          }

          if (!payload.client.name || payload.client.name.trim() === "") {
            // Se o cliente não tem nome, removemos.
            delete payload.client;
          }
        }

        // 2. Resolver erro de validação @IsPositive do receivedValue
        if (payload.receivedValue === 0) {
          delete payload.receivedValue;
        }

        // 3. Resolver erro de Item não encontrado (Mapear SQLite UUID -> Cloud API CUID via IPC)
        if (payload.items && Array.isArray(payload.items)) {
          payload.items = await Promise.all(
            payload.items.map(async (item: any) => {
              if (typeof window !== "undefined" && window.ipc?.db?.getItemCloudId) {
                try {
                  const cloudId = await window.ipc.db.getItemCloudId(item.id);
                  if (cloudId) {
                    return { ...item, id: cloudId };
                  }
                } catch (err) {
                  console.error("Erro ao buscar cloudId via IPC:", err);
                }
              }
              // Fallback se o IPC falhar (continua com o UUID antigo, o que dará erro mas não quebra a promessa)
              return item;
            })
          );
        }

        if (doc.type === "invoice-receipt") {
          await invoiceReceiptService.createInvoiceReceipt(payload);
        } else if (doc.type === "proforma") {
          await proformaService.createProforma(payload);
        }

        removeFromQueue(doc.internalId, user?.id ?? "unknown");
        syncedCount++;
        console.log(`Synced document ${doc.internalId} successfully.`);
      } catch (error: any) {
        console.error(`Failed to sync document ${doc.internalId}:`, error);
        if (error.response && error.response.data) {
          const errorMsg = JSON.stringify(error.response.data, null, 2);
          console.error("API Validation Details:", errorMsg);
          // Show alert to user to immediately identify the missing/wrong field
          alert(`Erro ao sincronizar documento ${doc.type}:\n\n${errorMsg}`);
        }
      }
    }

    // Only show success message if at least 1 document was actually synced
    if (syncedCount > 0) {
      SucessMessage(`${syncedCount} documento(s) sincronizado(s) com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
      queryClient.invalidateQueries({ queryKey: ["proforma"] });
    }

    setSyncing(false);
    // Use queue.length (primitive) instead of queue (array ref) to avoid infinite re-trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, queue.length, isSyncing]);

  useEffect(() => {
    if (isOnline && queue.length > 0 && !isSyncing) {
      sync();
    }
  }, [isOnline, queue.length, isSyncing, sync]);

  return { isSyncing, sync, pendingCount: queue.length };
}
