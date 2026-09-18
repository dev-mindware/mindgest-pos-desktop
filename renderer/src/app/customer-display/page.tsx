"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatCurrency } from "@/utils";
import { ShoppingBag, Sparkles, CircleCheck, Clock, Store } from "lucide-react";
import { useTheme } from "next-themes";

interface CustomerDisplayItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  total: number;
  image?: string;
}

interface CustomerDisplayState {
  status: "idle" | "scanning" | "payment" | "completed";
  items: CustomerDisplayItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  receivedValue?: number;
  change?: number;
  paymentMethod?: string;
  storeName?: string;
  clientName?: string;
  customMessage?: string;
}

export default function CustomerDisplayPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [state, setState] = useState<CustomerDisplayState>({
    status: "idle",
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    storeName: "Mindgest POS",
  });

  const [currentTime, setCurrentTime] = useState<string>("");

  // Sincronização de tema entre janelas via storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "mindware-theme" && e.newValue) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setTheme]);

  // Relógio em tempo real
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Ressincronização Ativa ao Montar (Pull State Snapshot)
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        if (typeof window !== "undefined" && window.ipc?.customerDisplay?.requestState) {
          const snapshot = await window.ipc.customerDisplay.requestState();
          if (snapshot) {
            setState(snapshot);
          }
        }
      } catch (err) {
        console.warn("Falha ao obter estado inicial do ecrã de cliente:", err);
      }
    };

    fetchInitialState();

    // 2. Listener Reativo de Atualizações em Tempo Real
    if (typeof window !== "undefined" && window.ipc?.customerDisplay?.onUpdate) {
      const unsubscribe = window.ipc.customerDisplay.onUpdate((newState) => {
        if (newState) {
          setState(newState);
        }
      });
      return () => {
        unsubscribe?.();
      };
    }
  }, []);

  const isIdle = state.status === "idle" || state.items.length === 0;
  const isPayment = state.status === "payment" || state.status === "completed";

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground select-none overflow-hidden font-sans transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-8 py-4 bg-card/90 border-b border-border backdrop-blur-md shrink-0 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-foreground uppercase">
              {state.storeName || "MINDGEST POS"}
            </h1>
            <p className="text-xs text-muted-foreground font-medium">Terminal de Atendimento ao Cliente</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {state.clientName && (
            <div className="px-4 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-foreground shadow-xs">
              Cliente: <span className="text-primary font-bold">{state.clientName}</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-muted/60 border border-border text-sm font-mono text-foreground shadow-inner">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{currentTime}</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      {isIdle ? (
        // Estado Ocioso / Standby
        <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
          <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="max-w-2xl text-center space-y-6 z-10">
            <div className="relative w-28 h-28 mx-auto p-4 rounded-3xl bg-card border border-border shadow-2xl flex items-center justify-center">
              <Image
                src="/mindgest.png"
                alt="Mindgest"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-black text-foreground tracking-tight">
                Seja Bem-vindo!
              </h2>
              <p className="text-lg text-muted-foreground">
                Ponto de venda aberto. Os seus artigos aparecerão aqui no ecrã.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/80 border border-border backdrop-blur-md text-left flex items-center gap-4 shadow-lg">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Experiência Digital & Transparente</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Acompanhe os preços, quantidades e descontos em tempo real durante o atendimento.
                </p>
              </div>
            </div>
          </div>
        </main>
      ) : isPayment ? (
        // Estado de Pagamento e Troco
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl p-8 rounded-3xl bg-card border border-border shadow-2xl space-y-8 backdrop-blur-xl">
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CircleCheck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground">Pagamento da Fatura</h2>
                <p className="text-sm text-muted-foreground">
                  {state.paymentMethod === "CASH" ? "Pagamento em Dinheiro (Numerário)" : "Pagamento Eletrónico (TPA / Multibanco)"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-muted/40 border border-border space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Total a Pagar</span>
                <p className="text-3xl font-black text-foreground font-mono">
                  {formatCurrency(state.total)}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-muted/40 border border-border space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Valor Entregue</span>
                <p className="text-3xl font-black text-foreground font-mono">
                  {formatCurrency(state.receivedValue !== undefined ? state.receivedValue : state.total)}
                </p>
              </div>
            </div>

            {state.receivedValue !== undefined && state.receivedValue < state.total && (
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">Valor em Falta</span>
                  <p className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
                    {formatCurrency(state.total - state.receivedValue)}
                  </p>
                </div>
                <div className="text-right text-xs text-amber-700/80 dark:text-amber-300/80 font-medium">
                  A aguardar conclusão do valor
                </div>
              </div>
            )}

            {state.change !== undefined && state.change > 0 && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">Seu Troco</span>
                  <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                    {formatCurrency(state.change)}
                  </p>
                </div>
                <div className="text-right text-xs text-emerald-700/80 dark:text-emerald-300/80 font-medium">
                  Por favor, confira o seu troco no balcão
                </div>
              </div>
            )}

            {state.change === 0 && state.receivedValue !== undefined && state.receivedValue >= state.total && (
              <div className="p-4 rounded-xl bg-muted/50 border border-border text-center text-sm font-semibold text-muted-foreground">
                Valor exato entregue (Sem troco)
              </div>
            )}

            <p className="text-center text-sm font-semibold text-muted-foreground pt-2">
              Obrigado pela sua preferência! Volte sempre.
            </p>
          </div>
        </main>
      ) : (
        // Estado Ativo de Leitura de Carrinho (Scanning)
        <main className="flex-1 flex overflow-hidden">
          {/* Coluna Esquerda: Lista de Itens */}
          <section className="flex-1 flex flex-col p-6 overflow-hidden border-r border-border">
            <div className="flex items-center justify-between pb-4 mb-2 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Artigo / Produto</span>
              <div className="flex gap-12 pr-4">
                <span>Qtd</span>
                <span>Unitário</span>
                <span>Total</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
              {state.items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border">
                      <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-foreground truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground font-mono">Cód: {item.id?.substring(0, 8)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-12 font-mono shrink-0 pr-4">
                    <span className="text-base font-bold text-foreground w-8 text-center">{item.qty}x</span>
                    <span className="text-sm text-muted-foreground w-24 text-right">{formatCurrency(item.price)}</span>
                    <span className="text-base font-black text-foreground w-28 text-right">{formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Coluna Direita: Resumo Financeiro */}
          <aside className="w-[380px] xl:w-[420px] p-6 bg-muted/25 flex flex-col justify-between shrink-0">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
                Resumo da Compra
              </h3>

              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(state.subtotal || state.total)}</span>
                </div>

                {state.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Desconto:</span>
                    <span className="font-bold">-{formatCurrency(state.discount)}</span>
                  </div>
                )}

                {state.tax > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>IVA (14%):</span>
                    <span className="text-foreground">{formatCurrency(state.tax)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground pt-2 border-t border-border">
                  <span>Itens no Carrinho:</span>
                  <span className="font-bold text-foreground">{state.items.reduce((acc, i) => acc + i.qty, 0)} un.</span>
                </div>
              </div>
            </div>

            {/* Total Highlight Card */}
            <div className="p-6 rounded-3xl bg-primary/10 border-2 border-primary/30 space-y-2 shadow-xl">
              <span className="text-xs font-black uppercase tracking-widest text-primary">Total a Pagar</span>
              <p className="text-4xl font-black text-foreground font-mono tracking-tight leading-none">
                {formatCurrency(state.total)}
              </p>
            </div>
          </aside>
        </main>
      )}
    </div>
  );
}
