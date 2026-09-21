"use client";

import { useOfflineStore } from "@/stores/offline";
import { cn } from "@/lib/utils";

export function OfflineSyncBadge() {
  const networkStatus = useOfflineStore((s) => s.networkStatus);
  const isOnline = networkStatus !== "offline";

  return (
    <div
      title={isOnline ? "Ligação ativa à internet" : "Sem ligação à internet (Modo Offline)"}
      className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-border/60 bg-muted/40 text-muted-foreground shadow-sm shrink-0 select-none transition-colors"
    >
      <div
        className={cn(
          "h-2.5 w-2.5 rounded-full",
          isOnline
            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
            : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]",
        )}
      />
      <span className="text-[10px] font-bold uppercase tracking-wider">
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}



