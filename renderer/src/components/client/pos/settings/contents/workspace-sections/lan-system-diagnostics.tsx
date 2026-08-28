"use client";

import { Icon } from "@/components";

export interface SystemCapability {
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
    <div className="p-3 rounded-[4px] border border-stone-200/90 dark:border-stone-800/90 bg-card text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft-sm">
      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
        <div className="p-1 rounded-[3px] bg-muted text-muted-foreground shrink-0">
          <Icon name="Cpu" size={15} />
        </div>
        <span className="leading-relaxed font-normal text-stone-600 dark:text-stone-300">
          <span className="font-medium text-foreground">Hardware:</span> {systemCap.cpuCores} Cores CPU, {systemCap.totalMemoryGB} GB RAM ({systemCap.arch}).
          {systemCap.isMasterEligible
            ? " Desempenho excelente para atuar como Servidor Master de alta concorrência."
            : " Recomendado para Terminal de Venda (Slave / Caixa)."}
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase font-medium px-2 py-0.5 rounded-[2px] bg-muted border border-border/60 shrink-0 self-start sm:self-auto text-muted-foreground">
        {systemCap.isMasterEligible ? "Master Elegível" : "Terminal Slave"}
      </span>
    </div>
  );
}
