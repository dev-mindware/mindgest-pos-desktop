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
        <label className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono block">
          Papel deste Terminal na Loja
        </label>
        <p className="text-xs text-muted-foreground font-normal">
          Defina se este computador é o <strong>Servidor Central (Master)</strong> com a sequência AGT principal ou um <strong>Terminal de Caixa (Slave)</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Opção: Servidor Master */}
        <div
          onClick={() => onSelectMode("MASTER")}
          className={`p-4 rounded-[4px] border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
            terminalMode === "MASTER"
              ? "border-primary bg-primary/5 shadow-soft-md ring-1 ring-primary/20"
              : "border-border/60 bg-card hover:bg-muted/30 hover:border-primary/40 shadow-soft-sm"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`p-2 rounded-[3px] shrink-0 transition-colors ${
                  terminalMode === "MASTER" ? "bg-primary text-white shadow-soft-sm" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon name="Server" size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold truncate text-foreground">Servidor Central (Master)</p>
                  <Icon name="ShieldCheck" size={14} className="text-emerald-500 shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed font-normal">
                  Autoridade central de séries AGT, controlo de stock JIT e assinatura RSA-SHA1 em tempo real.
                </p>
              </div>
            </div>
            {terminalMode === "MASTER" ? (
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <Icon name="CheckCircle2" size={16} className="text-primary" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-border/80 shrink-0 mt-0.5" />
            )}
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] font-mono font-normal">
            <span className="text-muted-foreground">Porta TCP: <span className="text-foreground font-semibold">3333</span></span>
            <span className="text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded-[2px]">Exige Supervisor</span>
          </div>
        </div>

        {/* Opção: Terminal Slave */}
        <div
          onClick={() => onSelectMode("SLAVE")}
          className={`p-4 rounded-[4px] border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
            terminalMode === "SLAVE"
              ? "border-primary bg-primary/5 shadow-soft-md ring-1 ring-primary/20"
              : "border-border/60 bg-card hover:bg-muted/30 hover:border-primary/40 shadow-soft-sm"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`p-2 rounded-[3px] shrink-0 transition-colors ${
                  terminalMode === "SLAVE" ? "bg-primary text-white shadow-soft-sm" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon name="Laptop" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-foreground">Terminal de Caixa (Slave)</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed font-normal">
                  Auto-descoberta na rede local por cabo ou mDNS, emissão contínua e tolerância a cortes.
                </p>
              </div>
            </div>
            {terminalMode === "SLAVE" ? (
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <Icon name="CheckCircle2" size={16} className="text-primary" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-border/80 shrink-0 mt-0.5" />
            )}
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] font-mono font-normal">
            <span className="text-muted-foreground">Faturação Intercalada</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded-[2px]">Zero-Config</span>
          </div>
        </div>
      </div>
    </div>
  );
}
