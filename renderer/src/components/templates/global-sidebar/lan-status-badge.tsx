"use client";

import { useLanStore } from "@/stores/pos/lan-store";
import { useLanHeartbeat } from "@/hooks/pos/use-lan-heartbeat";
import { Icon } from "@/components";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

export function LanStatusBadge() {
  // Mantém o ciclo de monitorização e heartbeat da LAN
  useLanHeartbeat();
  const { state } = useSidebar();
  const router = useRouter();

  const {
    enabled,
    terminalMode,
    isMasterServerRunning,
    connectedTerminals,
    isSlaveConnected,
    slaveLatencyMs,
    masterIp,
    localIp,
  } = useLanStore();

  if (!enabled) return null;

  const isMaster = terminalMode === "MASTER";
  const isOnline = isMaster ? isMasterServerRunning : isSlaveConnected;
  const isCollapsed = state === "collapsed";

  const handleNavigate = () => {
    router.push("/pos/settings?tab=workspace");
  };

  // Versão Recolhida (Icon-only para Sidebar colapsada)
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleNavigate}
            aria-label={isMaster ? "Estado Master LAN" : "Estado Terminal Slave"}
            className={cn(
              "relative flex items-center justify-center w-8 h-8 mx-auto my-1 rounded-[4px] transition-all duration-200",
              "border bg-card/80 hover:bg-card shadow-soft-sm cursor-pointer",
              isOnline
                ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500/60"
                : "border-amber-500/30 text-amber-600 dark:text-amber-400 hover:border-amber-500/60"
            )}
          >
            <Icon name="Network" size={15} />

            {/* Ponto Pulsante de Status no Canto */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              {isOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-background",
                  isOnline
                    ? "bg-emerald-500"
                    : isMaster
                    ? "bg-amber-500"
                    : "bg-rose-500"
                )}
              />
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center" className="space-y-1 p-2.5 text-xs max-w-xs shadow-soft-md">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isOnline ? "bg-emerald-500" : isMaster ? "bg-amber-500" : "bg-rose-500"
              )}
            />
            <span>{isMaster ? "Servidor Master LAN" : "Terminal Slave"}</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {isMaster
              ? isMasterServerRunning
                ? `Ativo na porta 3333 (${connectedTerminals.length} terminais)`
                : "Servidor em standby"
              : isSlaveConnected
              ? `Ligado ao Master (${slaveLatencyMs ?? 0}ms)`
              : "A tentar ligar ao Master..."}
          </p>
          <p className="text-[10px] text-muted-foreground/80 pt-0.5 border-t border-border/50">
            Clique para configurar o Workspace
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Versão Expandida (Card Completo e Elegante)
  return (
    <div
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleNavigate();
      }}
      className={cn(
        "group relative mx-1 my-1 px-2.5 py-2 rounded-[4px] border transition-all duration-200 cursor-pointer select-none",
        "bg-card/70 hover:bg-card border-border/50 hover:border-border shadow-soft-sm",
        isOnline
          ? "border-emerald-500/20 hover:border-emerald-500/40"
          : "border-amber-500/20 hover:border-amber-500/40"
      )}
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Status Indicator com Anel Suave */}
          <div className="relative flex items-center justify-center shrink-0">
            {isOnline && (
              <span className="absolute inline-flex h-3 w-3 rounded-full opacity-60 animate-ping bg-emerald-400" />
            )}
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full ring-2 ring-background transition-colors",
                isOnline
                  ? "bg-emerald-500"
                  : isMaster
                  ? "bg-amber-500"
                  : "bg-rose-500"
              )}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="font-semibold text-[11px] text-foreground tracking-tight truncate leading-tight">
                {isMaster ? "Master LAN" : "Caixa Slave"}
              </p>
              {isMaster && (
                <span className="text-[9px] px-1 py-0.2 rounded-[2px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium shrink-0">
                  3333
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground truncate leading-tight font-medium mt-0.5">
              {isMaster
                ? isMasterServerRunning
                  ? `${connectedTerminals.length} terminal(is)`
                  : "A inicializar..."
                : isSlaveConnected
                ? `Master: ${slaveLatencyMs ?? 0}ms`
                : "A procurar Master..."}
            </p>
          </div>
        </div>

        {/* Badge Lateral Monospace */}
        <div className="shrink-0 text-right font-mono text-[9px]">
          {isMaster ? (
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-[2px] font-semibold uppercase tracking-wider",
                isMasterServerRunning
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              )}
            >
              {isMasterServerRunning ? "Ativo" : "Standby"}
            </span>
          ) : (
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-[2px] font-semibold",
                isSlaveConnected
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}
            >
              {isSlaveConnected ? `${slaveLatencyMs ?? 1}ms` : "Offline"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
