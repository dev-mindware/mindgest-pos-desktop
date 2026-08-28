"use client";

import { Icon, Switch } from "@/components";
import { useWorkspaceStore } from "@/stores/pos/workspace-store";

export function WorkspaceHardwareSection() {
  const {
    enableVirtualKeyboard,
    setEnableVirtualKeyboard,
    useThermalPrinter,
    autoOpenDrawerOnCash,
    setUseThermalPrinter,
    setAutoOpenDrawerOnCash,
  } = useWorkspaceStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div className="p-2.5 rounded-[4px] bg-primary/10 text-primary shrink-0 shadow-soft-sm">
          <Icon name="Printer" size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Hardware POS, Impressão & Ecrã Tátil
          </h2>
          <p className="text-xs text-muted-foreground font-normal">
            Teclado virtual para ecrãs táteis, comandos ESC/POS via USB, Rede (TCP/IP 9100) e gaveta de dinheiro
          </p>
        </div>
      </div>

      <div className="bg-card rounded-[4px] border border-stone-200/90 dark:border-stone-800/90 overflow-hidden divide-y divide-border/40 shadow-soft-md">
        <div className="p-4 sm:p-5 space-y-4">
          {/* Teclado Virtual no Ecrã */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Teclado Virtual no Ecrã (Touchscreen)</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                Exibe automaticamente o teclado tátil para terminais POS sem teclado físico ao focar campos de texto e valores
              </p>
            </div>
            <Switch
              checked={enableVirtualKeyboard}
              onCheckedChange={setEnableVirtualKeyboard}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Impressora Térmica ESC/POS */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/40">
            <div>
              <p className="text-sm font-medium text-foreground">Impressora Térmica ESC/POS Ativa</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                Habilita a impressão rápida de talões sem abrir o diálogo do sistema operacional
              </p>
            </div>
            <Switch
              checked={useThermalPrinter}
              onCheckedChange={setUseThermalPrinter}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Abertura Automática da Gaveta */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/40">
            <div>
              <p className="text-sm font-medium text-foreground">Abertura Automática da Gaveta em Vendas a Dinheiro</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                Dispara o pulso elétrico (DK) na gaveta ao finalizar recibos com pagamento em numerário
              </p>
            </div>
            <Switch
              checked={autoOpenDrawerOnCash}
              onCheckedChange={setAutoOpenDrawerOnCash}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
