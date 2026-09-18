"use client";

import { Icon } from "@/components";

export interface SystemCapability {
  hostname?: string;
  totalMemoryGB: number;
  freeMemoryGB: number;
  cpuCores: number;
  arch: string;
  platform: string;
  isMasterEligible: boolean;
}

interface LanSystemDiagnosticsProps {
  systemCap: SystemCapability | null;
}

export function LanSystemDiagnostics({ systemCap }: LanSystemDiagnosticsProps) {
  if (!systemCap) return null;

  return (
    <div className="p-3.5 rounded-[4px] border border-stone-200/90 dark:border-stone-800/90 bg-card text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-soft-sm">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div className="p-2 rounded-[3px] bg-primary/10 text-primary shrink-0">
          <Icon name="Laptop" size={16} />
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">
              {systemCap.hostname ? `Este PC (${systemCap.hostname}):` : "Diagnóstico de Capacidade:"}
            </span>
            <span className="font-mono text-[11px] bg-muted/60 px-1.5 py-0.5 rounded-[2px] border border-border/50 text-foreground">
              {systemCap.cpuCores} Cores CPU
            </span>
            <span className="font-mono text-[11px] bg-muted/60 px-1.5 py-0.5 rounded-[2px] border border-border/50 text-foreground">
              {systemCap.totalMemoryGB} GB RAM ({systemCap.freeMemoryGB} GB livres)
            </span>
            <span className="font-mono text-[11px] bg-muted/60 px-1.5 py-0.5 rounded-[2px] border border-border/50 text-muted-foreground uppercase">
              {systemCap.arch}
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed font-normal text-[11px]">
            {systemCap.isMasterEligible
              ? "Este equipamento tem capacidade para processar mais de 50 faturas simultâneas como Servidor Master."
              : "Recomendado para operar como Terminal de Caixa (Slave) com auto-descoberta na rede local."}
          </p>
        </div>
      </div>

      <div className="shrink-0 self-end md:self-auto flex items-center gap-2">
        {systemCap.isMasterEligible ? (
          <span className="font-mono text-[10px] uppercase font-semibold px-2.5 py-1 rounded-[2px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <Icon name="ShieldCheck" size={12} className="text-emerald-500" />
            Master Elegível
          </span>
        ) : (
          <span className="font-mono text-[10px] uppercase font-semibold px-2.5 py-1 rounded-[2px] bg-muted border border-border/60 text-muted-foreground flex items-center gap-1.5">
            <Icon name="Laptop" size={12} />
            Terminal Caixa
          </span>
        )}
      </div>
    </div>
  );
}
