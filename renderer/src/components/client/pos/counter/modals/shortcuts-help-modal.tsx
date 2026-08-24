"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { POS_HOTKEYS } from "@/types/hotkeys";
import { Keyboard, Sparkles } from "lucide-react";

interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsHelpModal({ isOpen, onClose }: ShortcutsHelpModalProps) {
  const categories = ["Geral", "Vendas", "Itens", "Caixa"] as const;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-1 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Atalhos de Teclado do Ponto de Venda
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Operações rápidas para agilizar o atendimento no balcão
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {categories.map((cat) => {
            const items = POS_HOTKEYS.filter((h) => h.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {cat}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {items.map((hotkey) => (
                    <div
                      key={hotkey.key}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex flex-col pr-2">
                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          {hotkey.label}
                        </span>
                        <span className="text-[11px] text-zinc-500 line-clamp-1">
                          {hotkey.description}
                        </span>
                      </div>
                      <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm whitespace-nowrap">
                        {hotkey.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>Dica de Produtividade:</strong> Use as teclas de função <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-zinc-800 border rounded">F2</kbd> e <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-zinc-800 border rounded">F4</kbd> para vender e cobrar sem precisar tocar no rato.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
