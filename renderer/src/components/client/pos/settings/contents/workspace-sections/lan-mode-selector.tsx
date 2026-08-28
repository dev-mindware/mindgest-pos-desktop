"use client";

import { Icon } from "@/components";

interface LanModeSelectorProps {
  terminalMode: "MASTER" | "SLAVE";
  onSelectMode: (mode: "MASTER" | "SLAVE") => void;
}

export function LanModeSelector({ terminalMode, onSelectMode }: LanModeSelectorProps) {
  return (
    <div className="p-4 sm:p-5 bg-muted/10 space-y-3.5">
      <div className="space-y-0.5">
        <label className="text-xs font-medium text-muted-foreground block">
          Papel deste Computador na Loja
        </label>
        <p className="text-xs text-muted-foreground/80 font-normal">
          Selecione se este computador é o <strong>Servidor Central (Master)</strong> com a sequência AGT principal ou um <strong>Terminal de Caixa (Slave)</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Opção: Servidor Master */}
        <div
          onClick={() => onSelectMode("MASTER")}
          className={`p-3.5 sm:p-4 rounded-[4px] border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
            terminalMode === "MASTER"
              ? "border-primary bg-primary/5 shadow-soft-sm"
              : "border-border/60 bg-card hover:bg-muted/30 hover:border-stone-300 dark:hover:border-stone-700"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`p-2 rounded-[3px] shrink-0 transition-colors ${
                  terminalMode === "MASTER" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon name="Server" size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold truncate text-foreground">Servidor Central (Master)</p>
                  <Icon name="ShieldCheck" size={14} className="text-emerald-500 shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 font-normal">
                  Autoridade central de séries AGT, stock JIT e assinatura RSA-SHA1
                </p>
              </div>
            </div>
            {terminalMode === "MASTER" && (
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0 mt-1" />
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground font-normal">
            <span>Porta: 3333</span>
            <span className="text-primary font-medium">Exige Supervisor</span>
          </div>
        </div>

        {/* Opção: Terminal Slave */}
        <div
          onClick={() => onSelectMode("SLAVE")}
          className={`p-3.5 sm:p-4 rounded-[4px] border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
            terminalMode === "SLAVE"
              ? "border-primary bg-primary/5 shadow-soft-sm"
              : "border-border/60 bg-card hover:bg-muted/30 hover:border-stone-300 dark:hover:border-stone-700"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`p-2 rounded-[3px] shrink-0 transition-colors ${
                  terminalMode === "SLAVE" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon name="Laptop" size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-foreground">Terminal de Venda (Caixa)</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 font-normal">
                  Auto-descoberta mDNS/Broadcast e emissão com idempotência
                </p>
              </div>
            </div>
            {terminalMode === "SLAVE" && (
              <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground font-normal">
            <span>Faturação Intercalada</span>
            <span className="text-primary font-medium">Zero-Config</span>
          </div>
        </div>
      </div>
    </div>
  );
}
