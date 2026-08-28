"use client";

import { Icon, Button, Input, Badge } from "@/components";
import { DiscoveredMasterNode } from "@/stores/pos/lan-store";

interface LanSlavePanelProps {
  isSlaveConnected: boolean;
  storeMasterIp: string;
  localMasterIp: string;
  setLocalMasterIp: (ip: string) => void;
  localLanSecret: string;
  setLocalLanSecret: (secret: string) => void;
  shortPairingCodeInput: string;
  setShortPairingCodeInput: (code: string) => void;
  slaveLatencyMs: number | null;
  clockOffsetMs: number;
  slaveError: string | null;
  discoveredMasters: DiscoveredMasterNode[];
  connectingIp: string | null;
  isPairingByCode: boolean;
  isTestingLan: boolean;
  isConnectingSlave: boolean;
  lanTestResult: {
    success: boolean;
    latencyMs?: number;
    message?: string;
  } | null;
  onQuickConnectDiscoveredMaster: (node: DiscoveredMasterNode) => void;
  onPairByShortCode: () => void;
  onTestConnection: () => void;
  onSaveAndConnectSlave: () => void;
  onSaveWithoutConnect: () => void;
}

export function LanSlavePanel({
  isSlaveConnected,
  storeMasterIp,
  localMasterIp,
  setLocalMasterIp,
  localLanSecret,
  setLocalLanSecret,
  shortPairingCodeInput,
  setShortPairingCodeInput,
  slaveLatencyMs,
  clockOffsetMs,
  slaveError,
  discoveredMasters,
  connectingIp,
  isPairingByCode,
  isTestingLan,
  isConnectingSlave,
  lanTestResult,
  onQuickConnectDiscoveredMaster,
  onPairByShortCode,
  onTestConnection,
  onSaveAndConnectSlave,
  onSaveWithoutConnect,
}: LanSlavePanelProps) {
  return (
    <div className="p-4 sm:p-5 space-y-5">
      {/* Banner de Estado de Conexão com o Master */}
      <div
        className={`p-3.5 sm:p-4 rounded-[4px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300 shadow-soft-sm ${
          isSlaveConnected
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
            : "bg-muted/40 border-border/60 text-foreground"
        }`}
      >
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div
            className={`p-2 rounded-[3px] shrink-0 ${
              isSlaveConnected
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon name={isSlaveConnected ? "Wifi" : "WifiOff"} size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">
              {isSlaveConnected
                ? `Conectado ao Servidor Master (${storeMasterIp || localMasterIp})`
                : "Terminal Pronto para Conexão"}
            </p>
            <p className="text-xs opacity-90 leading-relaxed mt-0.5 font-normal text-muted-foreground">
              {isSlaveConnected
                ? `Latência: ${slaveLatencyMs ?? 2}ms • Offset de Relógio: ${clockOffsetMs}ms • Idempotência ativa.`
                : slaveError || "Selecione um Master descoberto na lista abaixo ou introduza o código PIN de emparelhamento."}
            </p>
          </div>
        </div>

        {isSlaveConnected && (
          <span className="font-mono text-xs font-medium px-2.5 py-1 rounded-[3px] bg-background/90 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shrink-0 self-start sm:self-auto flex items-center gap-1.5 shadow-soft-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Online ({slaveLatencyMs ?? 2}ms)
          </span>
        )}
      </div>

      {/* Servidores Master Descobertos na Rede Local */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-primary/40 animate-ping" />
              <Icon name="Radio" size={16} className="text-primary relative" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              Servidores Master Encontrados na Loja ({discoveredMasters.length})
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30 font-normal">
            mDNS + UDP Broadcast
          </Badge>
        </div>

        {discoveredMasters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {discoveredMasters.map((node) => (
              <div
                key={node.id}
                className={`p-3.5 rounded-[4px] border transition-all duration-200 flex flex-col justify-between gap-3 shadow-soft-sm ${
                  localMasterIp === node.ip
                    ? "bg-primary/5 border-primary shadow-soft-md"
                    : "bg-card border-border/60 hover:border-primary/40"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{node.name}</p>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium uppercase">
                      {node.discoveryLayer}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground font-normal">http://{node.ip}:{node.port}</p>
                </div>
                <Button
                  size="sm"
                  variant={localMasterIp === node.ip ? "secondary" : "default"}
                  onClick={() => onQuickConnectDiscoveredMaster(node)}
                  disabled={connectingIp === node.ip}
                  className="h-8 text-xs w-full gap-1.5 font-medium"
                >
                  <Icon name={localMasterIp === node.ip ? "Check" : "PlugZap"} size={13} />
                  {connectingIp === node.ip
                    ? "A Conectar..."
                    : localMasterIp === node.ip
                    ? "Selecionado (Ativo)"
                    : "Ligar a Este Master"}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-[4px] border border-dashed border-border/60 bg-muted/5 text-center space-y-1.5">
            <div className="p-2 rounded-[4px] bg-muted w-fit mx-auto text-muted-foreground">
              <Icon name="Radio" size={18} className="animate-pulse" />
            </div>
            <p className="text-xs font-medium text-foreground">
              A procurar servidores Master na rede local automaticamente...
            </p>
            <p className="text-[11px] text-muted-foreground font-normal">
              Certifique-se de que o computador Master está ligado e conectado à mesma rede Wi-Fi/Ethernet.
            </p>
          </div>
        )}
      </div>

      {/* Emparelhamento Rápido (PIN de 6 Dígitos) */}
      <div className="p-3.5 sm:p-4 rounded-[4px] bg-card border border-border/60 space-y-3 shadow-soft-sm">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-foreground">
            Emparelhamento Rápido por Código PIN de 6 Dígitos
          </p>
          <p className="text-xs text-muted-foreground font-normal">
            Introduza o PIN gerado no computador Master para autorizar este terminal na loja com 1 clique.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md">
          <Input
            placeholder="Ex: 482910"
            value={shortPairingCodeInput}
            onChange={(e) => setShortPairingCodeInput(e.target.value)}
            maxLength={6}
            className="font-mono text-center text-lg tracking-widest uppercase font-semibold h-10"
          />
          <Button
            variant="default"
            onClick={onPairByShortCode}
            disabled={isPairingByCode || !shortPairingCodeInput || !localMasterIp}
            className="h-10 text-xs font-medium whitespace-nowrap gap-1.5"
          >
            <Icon name="Key" size={14} />
            {isPairingByCode ? "A Emparelhar..." : "Emparelhar Terminal"}
          </Button>
        </div>
      </div>

      {/* Configuração Manual de IP & Chave */}
      <div className="space-y-3.5 max-w-xl">
        {/* IP do Master */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground block">
            Endereço IP do Servidor Master (Manual)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Ex: 192.168.1.50"
              value={localMasterIp}
              onChange={(e) => setLocalMasterIp(e.target.value)}
              className="font-mono text-xs flex-1 h-9"
            />
            <Button
              variant="outline"
              onClick={onTestConnection}
              disabled={isTestingLan || !localMasterIp}
              className="h-9 gap-1.5 text-xs whitespace-nowrap w-full sm:w-auto font-normal"
            >
              <Icon name="Activity" size={13} className="text-primary" />
              {isTestingLan ? "A testar..." : "Testar Conexão"}
            </Button>
          </div>
        </div>

        {/* Código de Segurança LAN */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground block">
            Chave Secreta de Segurança LAN
          </label>
          <Input
            type="password"
            placeholder="Introduza a chave gerada no Master"
            value={localLanSecret}
            onChange={(e) => setLocalLanSecret(e.target.value)}
            className="font-mono text-xs h-9"
          />
        </div>

        {/* Resultado do Teste de Conexão */}
        {lanTestResult && (
          <div
            className={`p-3 rounded-[4px] border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
              lanTestResult.success
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name={lanTestResult.success ? "Check" : "TriangleAlert"} size={15} className="shrink-0" />
              <span className="font-normal">{lanTestResult.message}</span>
            </div>
            {lanTestResult.latencyMs !== undefined && (
              <span className="font-mono font-medium self-end sm:self-auto">
                Latência: {lanTestResult.latencyMs}ms
              </span>
            )}
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
          <Button
            variant="default"
            onClick={onSaveAndConnectSlave}
            disabled={isConnectingSlave || !localMasterIp}
            className="h-10 gap-1.5 text-xs font-medium flex-1"
          >
            <Icon name="Check" size={14} />
            {isConnectingSlave ? "A Conectar..." : "Guardar e Conectar ao Master"}
          </Button>
          <Button
            variant="outline"
            onClick={onSaveWithoutConnect}
            className="h-10 text-xs w-full sm:w-auto font-normal"
          >
            Guardar Sem Conectar
          </Button>
        </div>
      </div>
    </div>
  );
}
