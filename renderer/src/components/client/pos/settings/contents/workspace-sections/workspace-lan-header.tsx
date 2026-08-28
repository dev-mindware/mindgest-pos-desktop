"use client";

import { Icon, Switch } from "@/components";

interface WorkspaceLanHeaderProps {
  lanEnabled: boolean;
  onToggleLan: (checked: boolean) => void;
}

export function WorkspaceLanHeader({ lanEnabled, onToggleLan }: WorkspaceLanHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2.5 rounded-[4px] bg-primary/10 text-primary shrink-0 shadow-soft-sm">
          <Icon name="Network" size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            Rede Local Offline & Multi-Terminal (LAN)
          </h2>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 font-normal">
            Faturação atómica em tempo real, assinatura RSA-SHA1 centralizada e partilha de stock JIT na LAN
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
        <span className="text-xs font-normal text-muted-foreground">
          {lanEnabled ? "Rede Ativa" : "Rede em Pausa"}
        </span>
        <Switch
          checked={lanEnabled}
          onCheckedChange={onToggleLan}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  );
}
