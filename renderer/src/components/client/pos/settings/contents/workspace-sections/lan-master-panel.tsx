"use client";

import { useState, useEffect } from "react";
import { Icon, Button } from "@/components";
import { ConnectedTerminal } from "@/stores/pos/lan-store";
import { SucessMessage } from "@/utils/messages";

interface LanMasterPanelProps {
  isMasterServerRunning: boolean;
  masterServerError: string | null;
  localIp: string;
  storeLanSecret: string;
  connectedTerminals: ConnectedTerminal[];
  onStartServer: () => void;
  onRotateSecret: () => void;
  isRotatingSecret: boolean;
  onGeneratePairingCode: () => void;
  isGeneratingCode: boolean;
  masterPairingCode: {
    code: string;
    expiresAt: string;
    ttlSeconds: number;
  } | null;
  onRevokeTerminal: (terminalId: string) => void;
}

export function LanMasterPanel({
  isMasterServerRunning,
  masterServerError,
  localIp,
  storeLanSecret,
  connectedTerminals,
  onStartServer,
  onRotateSecret,
  isRotatingSecret,
  onGeneratePairingCode,
  isGeneratingCode,
  masterPairingCode,
  onRevokeTerminal,
}: LanMasterPanelProps) {
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [remainingPinSeconds, setRemainingPinSeconds] = useState<number>(0);

  // Contador regressivo do PIN de 6 dígitos
  useEffect(() => {
    if (!masterPairingCode?.expiresAt) {
      setRemainingPinSeconds(0);
      return;
    }

    const updateRemaining = () => {
      const diff = Math.max(
        0,
        Math.round((new Date(masterPairingCode.expiresAt).getTime() - Date.now()) / 1000)
      );
      setRemainingPinSeconds(diff);
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [masterPairingCode]);

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    SucessMessage(`${label} copiado para a área de transferência!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-4 sm:p-5 space-y-5">
      {/* Banner de Estado do Servidor Local com Efeito Beacon */}
      <div
        className={`p-3.5 sm:p-4 rounded-[4px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300 shadow-soft-sm ${
          isMasterServerRunning
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
            : masterServerError
            ? "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
            : "bg-muted/40 border-border/60 text-foreground"
        }`}
      >
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div
            className={`p-2 rounded-[3px] shrink-0 ${
              isMasterServerRunning
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : masterServerError
                ? "bg-rose-500/20 text-rose-600"
                : "bg-primary/10 text-primary"
            }`}
          >
            <Icon name="Radio" size={18} className={isMasterServerRunning ? "animate-pulse" : ""} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">
                {isMasterServerRunning
                  ? "Servidor Central Master Ativo e em Escuta"
                  : masterServerError
                  ? "Erro no Servidor Central Local"
                  : "Servidor Central Local em Standby"}
              </p>
            </div>
            <p className="text-xs opacity-90 leading-relaxed mt-0.5 font-normal">
              {isMasterServerRunning
                ? `Anúncios mDNS (_mindgest-pos._tcp), Broadcast UDP e escuta direta TCP na porta 3333. SQLite WAL e PRAGMA synchronous=FULL.`
                : masterServerError || "Clique no botão ao lado para iniciar o serviço HTTP e as regras de escuta local."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {isMasterServerRunning ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium px-2.5 py-1 rounded-[2px] bg-background/90 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shadow-soft-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                0.0.0.0:3333
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`http://${localIp}:3333`, "master-url", "Endereço do Master")}
                className="h-7 px-2 text-xs gap-1 font-normal"
                title="Copiar URL completa"
              >
                <Icon name={copiedKey === "master-url" ? "Check" : "Copy"} size={12} className={copiedKey === "master-url" ? "text-emerald-500" : ""} />
                <span className="hidden sm:inline">{copiedKey === "master-url" ? "Copiado!" : "Copiar IP"}</span>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="default"
              onClick={onStartServer}
              className="h-8 text-xs gap-1.5 font-medium cursor-pointer"
            >
              <Icon name="Play" size={13} />
              Iniciar Servidor Master
            </Button>
          )}
        </div>
      </div>

      {/* Emparelhamento Rápido por Código PIN & Chave LAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Cartão de Código Curto Temporário (PIN) */}
        <div className="p-3.5 sm:p-4 rounded-[4px] bg-card border border-border/60 space-y-3 flex flex-col justify-between shadow-soft-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Icon name="KeyRound" size={14} className="text-primary" />
                <p className="text-xs font-semibold text-foreground">
                  Código de Emparelhamento Rápido (PIN)
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onGeneratePairingCode}
                disabled={isGeneratingCode}
                className="h-6 text-xs text-primary hover:bg-primary/10 gap-1 px-2 font-medium"
              >
                <Icon name="Sparkles" size={12} className={isGeneratingCode ? "animate-spin" : ""} />
                {masterPairingCode ? "Gerar Novo PIN" : "Gerar PIN"}
              </Button>
            </div>

            {masterPairingCode && remainingPinSeconds > 0 ? (
              <div className="space-y-2">
                <div className="p-3 rounded-[3px] bg-primary/5 border border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold text-primary tracking-widest">
                      {masterPairingCode.code.slice(0, 3)}
                    </span>
                    <span className="text-muted-foreground font-light text-xl">-</span>
                    <span className="font-mono text-2xl font-bold text-primary tracking-widest">
                      {masterPairingCode.code.slice(3)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-mono bg-background px-2 py-0.5 rounded-[2px] border border-border/40 font-medium flex items-center gap-1">
                      <Icon name="Clock" size={11} />
                      {Math.floor(remainingPinSeconds / 60)}:{(remainingPinSeconds % 60).toString().padStart(2, "0")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(masterPairingCode.code, "pin", "Código PIN")}
                      className="h-7 w-7 p-0"
                      title="Copiar PIN"
                    >
                      <Icon name={copiedKey === "pin" ? "Check" : "Copy"} size={13} className={copiedKey === "pin" ? "text-emerald-500" : ""} />
                    </Button>
                  </div>
                </div>
                {/* Barra de Progresso do Tempo Restante */}
                <div className="w-full bg-muted/60 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${Math.min(100, (remainingPinSeconds / 300) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-[3px] bg-muted/10 border border-dashed border-border/60 text-center space-y-1">
                <p className="text-xs text-muted-foreground font-normal">
                  Nenhum código ativo no momento. Clique em <span className="font-medium text-foreground">"Gerar PIN"</span> para autorizar novos caixas com facilidade.
                </p>
              </div>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-normal font-normal">
            Os novos caixas podem emparelhar digitando este PIN numérico sem necessidade de chave complexa.
          </p>
        </div>

        {/* Endereço IP & Chave LAN Direta */}
        <div className="p-3.5 sm:p-4 rounded-[4px] bg-card border border-border/60 space-y-3 flex flex-col justify-between shadow-soft-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Icon name="Shield" size={14} className="text-primary" />
                <p className="text-xs font-semibold text-foreground">
                  Endereço IP & Chave Criptográfica LAN
                </p>
              </div>
              <button
                type="button"
                onClick={onRotateSecret}
                disabled={isRotatingSecret}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                title="Gera uma nova chave com 15 min de tolerância para caixas ativos"
              >
                <Icon name="RotateCcw" size={11} className={isRotatingSecret ? "animate-spin" : ""} />
                Rotacionar Chave
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 font-mono text-xs bg-muted/20 px-2.5 py-1.5 rounded-[3px] border border-border/60 flex items-center justify-between gap-2">
                <span className="truncate">{showSecret ? storeLanSecret || "PADRÃO" : "••••••••••••••••••••"}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="text-muted-foreground hover:text-foreground p-1"
                    title={showSecret ? "Ocultar Chave" : "Mostrar Chave"}
                  >
                    <Icon name={showSecret ? "EyeOff" : "Eye"} size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(storeLanSecret || "", "secret", "Chave Secreta")}
                    className="text-muted-foreground hover:text-foreground p-1"
                    title="Copiar Chave Secreta"
                  >
                    <Icon name={copiedKey === "secret" ? "Check" : "Copy"} size={13} className={copiedKey === "secret" ? "text-emerald-500" : ""} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
            <span>Porta da API Fiscal: <span className="font-mono text-foreground font-medium">3333</span></span>
            <span>IP Local: <span className="font-mono text-foreground font-medium">{localIp}</span></span>
          </div>
        </div>
      </div>

      {/* Tabela de Telemetria de Terminais Conectados */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
              Terminais de Caixa Conectados ({connectedTerminals.length})
            </p>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono font-normal">
            Telemetria em RAM • Atualização a cada 2s
          </span>
        </div>

        {connectedTerminals.length === 0 ? (
          <div className="p-6 sm:p-8 text-center rounded-[4px] border border-dashed border-border/60 bg-muted/5 space-y-2">
            <div className="p-2.5 rounded-[4px] bg-muted w-fit mx-auto text-muted-foreground">
              <Icon name="Laptop" size={20} />
            </div>
            <p className="text-sm font-medium text-foreground">
              Nenhum terminal de caixa conectado no momento
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed font-normal">
              Nos outros computadores da loja, abra as Definições do POS e selecione o Master descoberto automaticamente ou introduza o código de 6 dígitos.
            </p>
          </div>
        ) : (
          <div className="rounded-[4px] border border-border/60 overflow-hidden bg-card shadow-soft-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[560px]">
                <thead className="bg-muted/40 text-muted-foreground font-mono uppercase text-[10px] border-b border-border/40">
                  <tr>
                    <th className="p-3 font-medium">Terminal / Caixa</th>
                    <th className="p-3 font-medium">Endereço IP</th>
                    <th className="p-3 font-medium">Estado & Latência</th>
                    <th className="p-3 font-medium">Vendas Emitidas</th>
                    <th className="p-3 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {connectedTerminals.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-normal flex items-center gap-2">
                        <div className="p-1 rounded-[3px] bg-primary/10 text-primary shrink-0">
                          <Icon name="Laptop" size={13} />
                        </div>
                        <span className="truncate max-w-[140px] sm:max-w-[200px] font-semibold text-foreground">
                          {t.name}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-muted-foreground font-normal">
                        <div className="flex items-center gap-1.5">
                          <span>{t.ip}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(t.ip, `ip-${t.id}`, "IP do terminal")}
                            className="text-muted-foreground/60 hover:text-foreground"
                            title="Copiar IP"
                          >
                            <Icon name={copiedKey === `ip-${t.id}` ? "Check" : "Copy"} size={11} className={copiedKey === `ip-${t.id}` ? "text-emerald-500" : ""} />
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 font-normal">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              t.status === "ACTIVE"
                                ? "bg-emerald-500 animate-pulse"
                                : t.status === "IDLE"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          <span className="font-medium text-foreground">
                            {t.status === "ACTIVE"
                              ? "Ativo"
                              : t.status === "IDLE"
                              ? "Em Espera"
                              : "Desconectado"}
                          </span>
                          {t.latencyMs !== undefined && (
                            <span
                              className={`font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] font-medium ${
                                t.latencyMs < 5
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : t.latencyMs < 50
                                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                              }`}
                            >
                              {t.latencyMs}ms
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-mono font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {t.totalSales ?? 0} faturas
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRevokeTerminal(t.id)}
                          className="h-7 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1 font-normal cursor-pointer"
                          title="Desconectar este caixa da rede local"
                        >
                          <Icon name="Trash2" size={13} />
                          <span className="hidden sm:inline">Desconectar</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recursos e Garantias Fiscais Compartilhados */}
      <div className="p-3.5 sm:p-4 rounded-[4px] bg-card border border-border/60 space-y-2.5 shadow-soft-sm">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
          Garantias de Engenharia da Rede Offline (AGT Fiscal Safe)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-[3px] bg-muted/20 border border-border/40 flex items-center gap-2">
            <Icon name="FileCheck" size={15} className="text-emerald-500 shrink-0" />
            <span className="font-normal text-foreground">Séries Fiscais RSA-SHA1</span>
          </div>
          <div className="p-2.5 rounded-[3px] bg-muted/20 border border-border/40 flex items-center gap-2">
            <Icon name="Boxes" size={15} className="text-primary shrink-0" />
            <span className="font-normal text-foreground">Stock JIT Atómico</span>
          </div>
          <div className="p-2.5 rounded-[3px] bg-muted/20 border border-border/40 flex items-center gap-2">
            <Icon name="ShieldAlert" size={15} className="text-primary shrink-0" />
            <span className="font-normal text-foreground">Fila FIFO + Mutex SQLite</span>
          </div>
          <div className="p-2.5 rounded-[3px] bg-muted/20 border border-border/40 flex items-center gap-2">
            <Icon name="HardDrive" size={15} className="text-purple-500 shrink-0" />
            <span className="font-normal text-foreground">synchronous=FULL (Cortes)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
