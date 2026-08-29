"use client";

import { useState } from "react";
import { Icon, Button, Input } from "@/components";
import { DiscoveredMasterNode } from "@/stores/pos/lan-store";
import { SucessMessage } from "@/utils/messages";

export interface SwitchDiagnosisResult {
  success: boolean;
  isTcpReachable: boolean;
  isMdnsReachable: boolean;
  possibleIgmpSnooping: boolean;
  latencyMs?: number;
  message: string;
  error?: string;
}

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
  switchDiagnosis: SwitchDiagnosisResult | null;
  isDiagnosingSwitch: boolean;
  onDiagnoseSwitch: () => void;
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
  switchDiagnosis,
  isDiagnosingSwitch,
  onDiagnoseSwitch,
  onQuickConnectDiscoveredMaster,
  onPairByShortCode,
  onTestConnection,
  onSaveAndConnectSlave,
  onSaveWithoutConnect,
}: LanSlavePanelProps) {
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  const handleCopyIp = (ip: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    SucessMessage("Endereço IP copiado!");
    setTimeout(() => setCopiedIp(null), 2000);
  };

  return (
    <div className="p-4 sm:p-5 space-y-5">
      {/* Banner de Estado da Conexão com o Master */}
      <div
        className={`p-3.5 sm:p-4 rounded-[4px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300 shadow-soft-sm ${
          isSlaveConnected
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
            : slaveError
            ? "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
            : "bg-muted/40 border-border/60 text-foreground"
        }`}
      >
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div
            className={`p-2 rounded-[3px] shrink-0 ${
              isSlaveConnected
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : slaveError
                ? "bg-rose-500/20 text-rose-600"
                : "bg-primary/10 text-primary"
            }`}
          >
            <Icon name="Laptop" size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">
                {isSlaveConnected
                  ? "Conectado ao Servidor Central (Master)"
                  : slaveError
                  ? "Desconectado do Servidor Central"
                  : "Terminal de Caixa Pronto para Conectar"}
              </p>
            </div>
            <p className="text-xs opacity-90 leading-relaxed mt-0.5 font-normal">
              {isSlaveConnected
                ? `Ligado com sucesso ao Master em ${storeMasterIp || localMasterIp}. As faturas deste caixa serão numeradas e assinadas pelo Master em tempo real.`
                : slaveError || "Aguardando emparelhamento ou configuração do endereço IP do Master."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {isSlaveConnected ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium px-2 py-0.5 rounded-[2px] bg-background/90 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-1.5 shadow-soft-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Latência: {slaveLatencyMs ?? 1}ms
              </span>
              {clockOffsetMs !== 0 && (
                <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-[2px] border border-border/40 font-normal">
                  Δt: {clockOffsetMs > 0 ? `+${clockOffsetMs}` : clockOffsetMs}ms
                </span>
              )}
            </div>
          ) : (
            <span className="font-mono text-xs font-medium px-2 py-0.5 rounded-[2px] bg-background/90 border border-border/60 text-muted-foreground shrink-0 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-primary/40 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Standby
            </span>
          )}
        </div>
      </div>

      {/* Auto-Descoberta mDNS / Broadcast / IP Direto */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
              Servidores Master Descobertos na Rede Local ({discoveredMasters.length})
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-normal">
              Descoberta multi-camada (IP Direto persistido por Cabo, mDNS e Broadcast UDP na porta 3334).
            </p>
          </div>
        </div>

        {discoveredMasters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {discoveredMasters.map((node) => (
              <div
                key={node.id}
                className={`p-3.5 rounded-[4px] border transition-all duration-200 flex flex-col justify-between gap-3 shadow-soft-sm ${
                  localMasterIp === node.ip
                    ? "bg-primary/5 border-primary shadow-soft-md ring-1 ring-primary/20"
                    : "bg-card border-border/60 hover:border-primary/40 hover:shadow-soft-md"
                }`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-foreground truncate">{node.name}</p>
                    <span
                      className={`font-mono text-[9px] px-1.5 py-0.5 rounded-[2px] font-semibold uppercase flex items-center gap-1 shrink-0 ${
                        node.discoveryLayer === "DIRECT_IP"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {node.discoveryLayer === "DIRECT_IP" ? (
                        <>
                          <Icon name="Cable" size={10} />
                          IP Direto (Cabo)
                        </>
                      ) : (
                        node.discoveryLayer
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
                    <span className="truncate">http://{node.ip}:{node.port}</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyIp(node.ip, e)}
                      className="hover:text-foreground text-muted-foreground/60 p-0.5"
                      title="Copiar IP"
                    >
                      <Icon
                        name={copiedIp === node.ip ? "Check" : "Copy"}
                        size={12}
                        className={copiedIp === node.ip ? "text-emerald-500" : ""}
                      />
                    </button>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={localMasterIp === node.ip ? "secondary" : "default"}
                  onClick={() => onQuickConnectDiscoveredMaster(node)}
                  disabled={connectingIp === node.ip}
                  className="h-8 text-xs w-full gap-1.5 font-medium cursor-pointer"
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
              Certifique-se de que o computador Master está ligado e conectado ao mesmo switch Ethernet / rede local.
            </p>
          </div>
        )}
      </div>

      {/* Emparelhamento Rápido (PIN de 6 Dígitos) */}
      <div className="p-3.5 sm:p-4 rounded-[4px] bg-card border border-border/60 space-y-3 shadow-soft-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Icon name="ShieldCheck" size={14} className="text-primary" />
            <p className="text-xs font-semibold text-foreground">
              Emparelhamento Rápido por Código PIN de 6 Dígitos
            </p>
          </div>
          <p className="text-xs text-muted-foreground font-normal">
            Introduza o PIN gerado no computador Master para autorizar este terminal na loja com 1 clique.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md">
          <Input
            placeholder="Ex: 849201"
            value={shortPairingCodeInput}
            onChange={(e) => setShortPairingCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="font-mono text-base tracking-widest text-center uppercase font-bold h-10 w-full sm:w-44 bg-muted/20 border-border/70 focus:border-primary"
          />
          <Button
            variant="default"
            onClick={onPairByShortCode}
            disabled={isPairingByCode || shortPairingCodeInput.length < 6 || !localMasterIp}
            className="h-10 text-xs gap-1.5 font-medium w-full sm:w-auto cursor-pointer"
          >
            <Icon name="ShieldCheck" size={14} className={isPairingByCode ? "animate-spin" : ""} />
            {isPairingByCode ? "A Validar PIN..." : "Autorizar Terminal"}
          </Button>
        </div>
      </div>

      {/* Configuração Manual & Diagnóstico de Switch Ethernet */}
      <div className="p-3.5 sm:p-4 rounded-[4px] bg-card border border-border/60 space-y-4 shadow-soft-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Icon name="Settings2" size={14} className="text-primary" />
            <p className="text-xs font-semibold text-foreground">
              Configuração Manual & Diagnóstico de Switch Ethernet
            </p>
          </div>
          <p className="text-xs text-muted-foreground font-normal">
            Endereço IP estático ou reserva DHCP do Master, com teste de integridade física de cabos e portas.
          </p>
        </div>

        {/* IP do Master */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground block">
            Endereço IP do Servidor Master (Porta 3333)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Ex: 192.168.1.100"
              value={localMasterIp}
              onChange={(e) => setLocalMasterIp(e.target.value)}
              className="font-mono text-xs flex-1 h-9 bg-muted/20"
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onTestConnection}
                disabled={isTestingLan || !localMasterIp}
                className="h-9 gap-1.5 text-xs whitespace-nowrap font-normal cursor-pointer"
                title="Testar ping e resposta HTTP com a chave LAN"
              >
                <Icon name="Activity" size={13} className={`text-primary ${isTestingLan ? "animate-spin" : ""}`} />
                {isTestingLan ? "A testar..." : "Testar Conexão"}
              </Button>
              <Button
                variant="outline"
                onClick={onDiagnoseSwitch}
                disabled={isDiagnosingSwitch || !localMasterIp}
                className="h-9 gap-1.5 text-xs whitespace-nowrap font-normal cursor-pointer"
                title="Diagnosticar cabo Ethernet e possível bloqueio de IGMP Snooping no switch"
              >
                <Icon name="Network" size={13} className={`text-emerald-500 ${isDiagnosingSwitch ? "animate-pulse" : ""}`} />
                {isDiagnosingSwitch ? "A analisar..." : "Diagnosticar Switch"}
              </Button>
            </div>
          </div>
        </div>

        {/* Chave Secreta de Segurança LAN */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground block">
            Chave Secreta de Segurança LAN
          </label>
          <Input
            type="password"
            placeholder="Introduza a chave gerada no Master"
            value={localLanSecret}
            onChange={(e) => setLocalLanSecret(e.target.value)}
            className="font-mono text-xs h-9 bg-muted/20"
          />
        </div>

        {/* Painel Animado de Diagnóstico em Execução */}
        {isDiagnosingSwitch && (
          <div className="p-3.5 rounded-[4px] border border-emerald-500/30 bg-emerald-500/5 text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
                <Icon name="Radio" size={15} className="animate-spin" />
                <span>A analisar integridade de cabo Ethernet e tráfego de switch...</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">Porta 3333 TCP</span>
            </div>
            <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {/* Resultado do Teste de Conexão HTTP */}
        {lanTestResult && !isDiagnosingSwitch && (
          <div
            className={`p-3 rounded-[4px] border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
              lanTestResult.success
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name={lanTestResult.success ? "Check" : "TriangleAlert"} size={15} className="shrink-0" />
              <span className="font-medium">{lanTestResult.message}</span>
            </div>
            {lanTestResult.latencyMs !== undefined && (
              <span className="font-mono font-medium self-end sm:self-auto bg-background/80 px-1.5 py-0.5 rounded-[2px] border border-current/20">
                Latência HTTP: {lanTestResult.latencyMs}ms
              </span>
            )}
          </div>
        )}

        {/* Relatório Interativo de Diagnóstico de Switch & Cabo Ethernet */}
        {switchDiagnosis && !isDiagnosingSwitch && (
          <div
            className={`p-3.5 rounded-[4px] border text-xs space-y-2.5 shadow-soft-sm ${
              switchDiagnosis.possibleIgmpSnooping
                ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                : switchDiagnosis.success
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                : "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200"
            }`}
          >
            <div className="flex items-center justify-between gap-2 font-bold text-sm">
              <div className="flex items-center gap-2">
                <Icon
                  name={
                    switchDiagnosis.possibleIgmpSnooping
                      ? "TriangleAlert"
                      : switchDiagnosis.success
                      ? "ShieldCheck"
                      : "CircleX"
                  }
                  size={18}
                  className="shrink-0"
                />
                <span>
                  {switchDiagnosis.possibleIgmpSnooping
                    ? "Aviso de Switch: Bloqueio Multicast por IGMP Snooping"
                    : switchDiagnosis.success
                    ? "Diagnóstico Físico: Cabo Ethernet e Switch em Perfeito Estado"
                    : "Falha de Conectividade Física com o Master"}
                </span>
              </div>
              {switchDiagnosis.latencyMs !== undefined && (
                <span className="font-mono text-xs px-2 py-0.5 rounded-[2px] bg-background/80 border border-current/20 font-semibold">
                  RTT: {switchDiagnosis.latencyMs}ms
                </span>
              )}
            </div>

            {/* Checklist Visual dos Testes Físicos e Lógicos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-[3px] bg-background/60 border border-current/15 flex items-center justify-between">
                <span className="text-foreground font-normal">Link Físico & Porta 3333:</span>
                <span className={`font-semibold font-mono ${switchDiagnosis.isTcpReachable ? "text-emerald-600" : "text-rose-600"}`}>
                  {switchDiagnosis.isTcpReachable ? "CONECTADO" : "FALHA"}
                </span>
              </div>
              <div className="p-2 rounded-[3px] bg-background/60 border border-current/15 flex items-center justify-between">
                <span className="text-foreground font-normal">Descoberta Multicast mDNS:</span>
                <span className={`font-semibold font-mono ${switchDiagnosis.isMdnsReachable ? "text-emerald-600" : "text-amber-600"}`}>
                  {switchDiagnosis.isMdnsReachable ? "PERFEITO" : "BLOQUEADO"}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed font-normal opacity-95 pt-0.5">
              {switchDiagnosis.message}
            </p>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
          <Button
            variant="default"
            onClick={onSaveAndConnectSlave}
            disabled={isConnectingSlave || !localMasterIp}
            className="h-10 gap-1.5 text-xs font-semibold flex-1 cursor-pointer"
          >
            <Icon name="Check" size={14} className={isConnectingSlave ? "animate-spin" : ""} />
            {isConnectingSlave ? "A Conectar..." : "Guardar e Conectar ao Master"}
          </Button>
          <Button
            variant="outline"
            onClick={onSaveWithoutConnect}
            className="h-10 text-xs w-full sm:w-auto font-normal cursor-pointer"
          >
            Guardar Sem Conectar
          </Button>
        </div>
      </div>
    </div>
  );
}
