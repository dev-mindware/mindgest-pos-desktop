"use client";

import { useState } from "react";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  Icon 
} from "@/components";
import { useAuth } from "@/hooks/auth";
import { currentStoreStore } from "@/stores";
import { SucessMessage } from "@/utils/messages";
import { cn } from "@/lib/utils";

export function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();
  const { currentStore } = currentStoreStore();

  const handleSync = async () => {
    if (isSyncing) return;
    
    // Obter o token do localStorage (conforme api.ts)
    const token = typeof window !== "undefined" ? localStorage.getItem("session-accessToken") : null;
    const storeId = currentStore?.id;

    if (!token || !storeId) {
      console.error("❌ [Sync] Token ou StoreId ausentes.");
      return;
    }

    setIsSyncing(true);
    try {
      // 1. Sincronizar Produtos
      const prodResult = await window.ipc.sync.products(token, storeId);
      
      // 2. Sincronizar Categorias
      const catResult = await window.ipc.sync.categories(token, storeId);

      // 3. Sincronizar Clientes
      const clientResult = await window.ipc.sync.clients(token, storeId);

      SucessMessage(`Sincronização concluída! (${prodResult.count} produtos, ${catResult.count} categorias, ${clientResult.count} clientes)`);
    } catch (error: any) {
      console.error("❌ [Sync] Erro durante a sincronização:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SidebarMenu className="mt-2 mb-2 border-t pt-2 items-center">
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={handleSync}
          disabled={isSyncing}
          tooltip="Sincronizar dados com a Cloud"
          className={cn(
            "hover:bg-sidebar-accent transition-colors cursor-pointer",
            isSyncing && "opacity-50 cursor-not-allowed"
          )}
        >
          <Icon 
            name="RefreshCw" 
            className={cn("w-4 h-4 text-primary", isSyncing && "animate-spin")} 
          />
          <span className="font-medium">
            {isSyncing ? "A Sincronizar..." : "Sincronizar Cloud"}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
