"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon, Switch, Button, Input, Badge } from "@/components";
import { useWorkspaceStore } from "@/stores/pos/workspace-store";
import { SucessMessage, ErrorMessage, WarningMessage } from "@/utils/messages";
import { ShortcutsHelpModal } from "../../counter/modals/shortcuts-help-modal";

import { useAuthStore, useModal } from "@/stores";
import { ManagerAuthModal, MODAL_MANAGER_AUTH_ID } from "../../manager-auth-modal";

interface ConnectedTerminal {
  id: string;
  name: string;
  ip: string;
  lastSeen: string;
  status: "ACTIVE" | "IDLE" | "DISCONNECTED";
  latencyMs?: number;
  totalSales?: number;
  appVersion?: string;
}

interface SystemCapability {
  totalMemoryGB: number;
  freeMemoryGB: number;
  cpuCores: number;
  arch: string;
  platform: string;
  isMasterEligible: boolean;
  isOptimalMaster: boolean;
  recommendation: string;
}

export function PosWorkspaceSettings() {
  const { user } = useAuthStore();
  const { openModal } = useModal();
  const [pendingModeChange, setPendingModeChange] = useState<"MASTER" | "SLAVE" | null>(null);

  const {
    disableVirtualKeyboard,
    useThermalPrinter,
    autoOpenDrawerOnCash,
    printerTransport,
    printerHost,
    printerPort,
    drawerPin,
    setDisableVirtualKeyboard,
    setUseThermalPrinter,
    setAutoOpenDrawerOnCash,
    setPrinterTransport,
    setPrinterHost,
    setPrinterPort,
    setDrawerPin,
  } = useWorkspaceStore();

  const [isTestingDrawer, setIsTestingDrawer] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // ==========================================
  // LAN & Multi-Terminal State
  // ==========================================
  const [lanEnabled, setLanEnabled] = useState(true);
  const [terminalMode, setTerminalMode] = useState<"MASTER" | "SLAVE">("MASTER");
  const [localIp, setLocalIp] = useState<string>("127.0.0.1");
  const [masterIp, setMasterIp] = useState<string>("");
  const [lanSecret, setLanSecret] = useState<string>("");
  const [showSecret, setShowSecret] = useState(false);
  const [connectedTerminals, setConnectedTerminals] = useState<ConnectedTerminal[]>([]);
  const [isTestingLan, setIsTestingLan] = useState(false);
  const [lanTestResult, setLanTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    message?: string;
  } | null>(null);
  const [isRotatingSecret, setIsRotatingSecret] = useState(false);
  const [systemCap, setSystemCap] = useState<SystemCapability | null>(null);

  // Carregar Configurações LAN e Diagnóstico de Hardware
  const loadLanConfig = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        const config = await window.ipc.lan.getConfig();
        if (config) {
          setLanEnabled(config.enabled !== false);
          setTerminalMode(config.terminalMode || "MASTER");
          setMasterIp(config.masterIp || "");
          setLanSecret(config.lanSecret || "");
          setLocalIp(config.localIp || "127.0.0.1");
        }

        if (config?.terminalMode === "MASTER" || !config?.terminalMode) {
          const terminals = await window.ipc.lan.getConnectedTerminals();
          setConnectedTerminals(terminals || []);
        }

        const cap = await window.ipc.lan.checkSystemCapability?.();
        if (cap) {
          setSystemCap(cap);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar configurações LAN:", err);
    }
  }, []);

  useEffect(() => {
    loadLanConfig();
  }, [loadLanConfig]);

  // Polling de telemetria em tempo real para o Master
  useEffect(() => {
    if (!lanEnabled || terminalMode !== "MASTER") return;

    const interval = setInterval(async () => {
      try {
        if (typeof window !== "undefined" && window.ipc?.lan) {
          const terminals = await window.ipc.lan.getConnectedTerminals();
          setConnectedTerminals(terminals || []);
        }
      } catch (err) {
        // silencioso
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [lanEnabled, terminalMode]);

  // Salvar Configuração LAN
  const handleSaveLanConfig = async (newMode?: "MASTER" | "SLAVE", newMasterIp?: string, newSecret?: string) => {
    const modeToSave = newMode || terminalMode;
    const ipToSave = newMasterIp !== undefined ? newMasterIp : masterIp;
    const secretToSave = newSecret !== undefined ? newSecret : lanSecret;

    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        await window.ipc.lan.setConfig({
          terminalMode: modeToSave,
          masterIp: ipToSave || null,
          lanSecret: secretToSave || null,
        });
        SucessMessage(`Configurações de Rede Local guardadas (${modeToSave === "MASTER" ? "Servidor Main" : "Terminal de Venda"})!`);
        loadLanConfig();
      }
    } catch (err: any) {
      ErrorMessage("Erro ao guardar configuração LAN.");
    }
  };

  // Rotação da Chave LAN
  const handleRotateSecret = async () => {
    setIsRotatingSecret(true);
    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        const newKey = await window.ipc.lan.rotateSecret();
        setLanSecret(newKey);
        SucessMessage("Nova chave de emparelhamento LAN gerada com sucesso!");
        loadLanConfig();
      }
    } catch (err) {
      ErrorMessage("Erro ao rotacionar chave LAN.");
    } finally {
      setIsRotatingSecret(false);
    }
  };

  // Testar Conexão ao Master
  const handleTestConnection = async () => {
    if (!masterIp) {
      WarningMessage("Por favor, introduza o endereço IP do Servidor Master.");
      return;
    }

    setIsTestingLan(true);
    setLanTestResult(null);
    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        const res = await window.ipc.lan.testConnection({
          targetIp: masterIp,
          lanSecret,
        });
        setLanTestResult(res);
        if (res.success) {
          SucessMessage(`Conectado ao Master! Latência: ${res.latencyMs}ms`);
        } else {
          ErrorMessage(res.message || "Falha ao conectar com o Servidor Master.");
        }
      }
    } catch (err: any) {
      ErrorMessage("Erro ao realizar teste de conexão.");
    } finally {
      setIsTestingLan(false);
    }
  };

  // Revogar Terminal Conectado
  const handleRevokeTerminal = async (terminalId: string) => {
    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        const success = await window.ipc.lan.revokeTerminal({ terminalId });
        if (success) {
          SucessMessage("Terminal revogado com sucesso!");
          const updated = await window.ipc.lan.getConnectedTerminals();
          setConnectedTerminals(updated || []);
        }
      }
    } catch (err) {
      ErrorMessage("Erro ao revogar terminal.");
    }
  };

  const handleTestDrawer = async () => {
    setIsTestingDrawer(true);
    try {
      if (typeof window !== "undefined" && window.ipc?.printer?.openCashDrawer) {
        const res = await window.ipc.printer.openCashDrawer({
          options: {
            transport: printerTransport,
            host: printerHost || undefined,
            port: printerPort || 9100,
            pin: drawerPin,
          },
          auditEntry: {
            type: "MANUAL",
            reason: "Teste de hardware nas definições",
          },
        });
        if (res?.success) {
          SucessMessage("Comando de abertura enviado à gaveta!");
        } else {
          ErrorMessage(res?.message || "Não foi possível acionar a gaveta.");
        }
      } else {
        SucessMessage("Ambiente web: comando simulado com sucesso.");
      }
    } catch (e: any) {
      ErrorMessage("Erro ao comunicar com o serviço de impressão/gaveta.");
    } finally {
      setIsTestingDrawer(false);
    }
  };

  const handleSelectMode = (newMode: "MASTER" | "SLAVE") => {
    if (newMode === "MASTER" && terminalMode !== "MASTER") {
      const isManagerOrOwner =
        user?.role === "OWNER" ||
        user?.role === "MANAGER" ||
        user?.role === "ADMIN";

      if (!isManagerOrOwner) {
        setPendingModeChange("MASTER");
        openModal(MODAL_MANAGER_AUTH_ID);
        return;
      }
    }

    setTerminalMode(newMode);
    handleSaveLanConfig(newMode);
  };

  const onManagerAuthorized = () => {
    if (pendingModeChange) {
      setTerminalMode(pendingModeChange);
      handleSaveLanConfig(pendingModeChange);
      setPendingModeChange(null);
      SucessMessage("Autorização de Gerente/Owner confirmada! Servidor Central (Master) ativado neste computador.");
    }
  };

  return (
    <div className="space-y-8 pb-16" data-tour="pos-settings-workspace">
      <ShortcutsHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ManagerAuthModal onAuthenticated={onManagerAuthorized} />

      {/* ========================================================================= */}
      {/* 🌐 SEÇÃO: REDE LOCAL OFFLINE & MULTI-TERMINAL (LAN ARCHITECTURE)           */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Icon name="Network" size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                Rede Local Offline & Topologia Multi-Terminal (LAN)
              </p>
              <p className="text-[11px] text-muted-foreground">
                Partilha atómica de séries fiscais AGT, stock JIT, sessões de caixa e clientes entre terminais
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">
              {lanEnabled ? "Rede Local Ativa" : "Rede Local Inativa"}
            </span>
            <Switch
              checked={lanEnabled}
              onCheckedChange={(val) => {
                setLanEnabled(val);
                handleSaveLanConfig(terminalMode);
              }}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>
        </div>

        {/* 💻 Diagnóstico de Hardware e Requisitos do Sistema */}
        {systemCap && (
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
              systemCap.isOptimalMaster
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : systemCap.isMasterEligible
                ? "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon name="Cpu" size={16} />
              <span>
                <strong>Hardware:</strong> {systemCap.cpuCores} Cores CPU, {systemCap.totalMemoryGB} GB RAM ({systemCap.arch}). {systemCap.recommendation}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-background/60 border border-border/40">
              {systemCap.isOptimalMaster ? "Master Ideal" : systemCap.isMasterEligible ? "Master Apto" : "Terminal Slave"}
            </span>
          </div>
        )}

        {lanEnabled && (
          <div className="bg-card rounded-2xl border border-border/60 overflow-hidden divide-y divide-border/30 shadow-sm">
            {/* Seletor de Modo de Operação */}
            <div className="p-5 bg-muted/5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Papel deste Computador na Loja (Requer Autorização de Gerente/Owner para Master)
                </label>
                <p className="text-xs text-muted-foreground">
                  Apenas o computador autorizado como Master pode hospedar as séries fiscais e a base central de stock.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Opção: Servidor Main */}
                <div
                  onClick={() => handleSelectMode("MASTER")}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    terminalMode === "MASTER"
                      ? "border-emerald-500 bg-emerald-500/5 shadow-sm"
                      : "border-border/60 bg-card hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Icon name="Server" size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold">Servidor Central (Main / Master)</p>
                          <Icon name="ShieldCheck" size={14} className="text-emerald-500" />
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Autoridade central de séries AGT, stock e sincronização
                        </p>
                      </div>
                    </div>
                    {terminalMode === "MASTER" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Porta Local: 3333</span>
                    <span className="text-emerald-500 font-medium">Requer Supervisor</span>
                  </div>
                </div>

                {/* Opção: Terminal Slave */}
                <div
                  onClick={() => handleSelectMode("SLAVE")}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    terminalMode === "SLAVE"
                      ? "border-primary-500 bg-primary-500/5 shadow-sm"
                      : "border-border/60 bg-card hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500">
                        <Icon name="Laptop" size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Terminal de Venda (Slave / Caixa)</p>
                        <p className="text-[11px] text-muted-foreground">
                          Conecta-se ao Servidor Main na rede local para faturar
                        </p>
                      </div>
                    </div>
                    {terminalMode === "SLAVE" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                    )}
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Faturação Intercalada</span>
                    <span className="text-primary-500 font-medium">Stock Central</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PAINEL DO SERVIDOR CENTRAL (MAIN / MASTER)                                */}
            {/* ========================================================================= */}
            {terminalMode === "MASTER" && (
              <div className="p-5 space-y-6">
                {/* Informações de Conexão e Chave de Segurança */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* IP e Endpoint */}
                  <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-2">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Endereço do Servidor Local
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-sm font-semibold text-emerald-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        http://{localIp}:3333
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`http://${localIp}:3333`);
                          SucessMessage("Endereço copiado para a área de transferência!");
                        }}
                        className="h-7 text-xs gap-1"
                      >
                        <Icon name="Copy" size={12} />
                        Copiar
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Forneça este IP nos outros computadores de caixa para que se conectem a este Main.
                    </p>
                  </div>

                  {/* Código de Segurança LAN (lanSecret) */}
                  <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Código de Emparelhamento LAN
                      </p>
                      <button
                        type="button"
                        onClick={handleRotateSecret}
                        disabled={isRotatingSecret}
                        className="text-[10px] text-primary-500 hover:underline flex items-center gap-1"
                      >
                        <Icon name="RotateCcw" size={10} />
                        Gerar Nova Chave
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 font-mono text-xs bg-background px-3 py-1.5 rounded-lg border border-border/60 flex items-center justify-between">
                        <span>{showSecret ? lanSecret || "PADRÃO-SEM-CHAVE" : "••••••••••••••••••••"}</span>
                        <button
                          type="button"
                          onClick={() => setShowSecret(!showSecret)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Icon name={showSecret ? "EyeOff" : "Eye"} size={14} />
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(lanSecret);
                          SucessMessage("Código de segurança copiado!");
                        }}
                        className="h-8 text-xs gap-1"
                      >
                        <Icon name="Copy" size={12} />
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Autenticação HMAC-SHA256 para impedir acesso não autorizado na rede.
                    </p>
                  </div>
                </div>

                {/* 📊 TABELA DE TELEMETRIA: TERMINAIS CONECTADOS EM TEMPO REAL */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Terminais Conectados em Tempo Real ({connectedTerminals.length})
                      </p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Atualização automática a cada 4s
                    </span>
                  </div>

                  {connectedTerminals.length === 0 ? (
                    <div className="p-8 text-center rounded-xl border border-dashed border-border/60 bg-muted/5 space-y-2">
                      <div className="p-2.5 rounded-full bg-muted w-fit mx-auto text-muted-foreground">
                        <Icon name="Laptop" size={20} />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Nenhum terminal conectado neste momento
                      </p>
                      <p className="text-xs text-muted-foreground/80 max-w-md mx-auto">
                        Nos outros computadores da loja, abra as Definições do POS, selecione o modo &quot;Terminal de Venda&quot; e introduza o IP <code className="text-emerald-500 font-mono font-bold">{localIp}</code>.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border/60 overflow-hidden bg-background">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-muted/40 text-muted-foreground font-mono uppercase text-[10px] border-b border-border/40">
                          <tr>
                            <th className="p-3">Terminal / Caixa</th>
                            <th className="p-3">Endereço IP</th>
                            <th className="p-3">Estado & Latência</th>
                            <th className="p-3">Vendas Emitidas</th>
                            <th className="p-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {connectedTerminals.map((t) => (
                            <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                              <td className="p-3 font-medium flex items-center gap-2">
                                <Icon name="Laptop" size={14} className="text-primary-500" />
                                <span>{t.name}</span>
                              </td>
                              <td className="p-3 font-mono text-muted-foreground">{t.ip}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      t.status === "ACTIVE"
                                        ? "bg-emerald-500"
                                        : t.status === "IDLE"
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                    }`}
                                  />
                                  <span className="font-medium">
                                    {t.status === "ACTIVE"
                                      ? "Ativo"
                                      : t.status === "IDLE"
                                      ? "Em Espera"
                                      : "Desconectado"}
                                  </span>
                                  {t.latencyMs !== undefined && (
                                    <span className="font-mono text-[10px] text-muted-foreground">
                                      ({t.latencyMs}ms)
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 font-mono font-semibold text-emerald-500">
                                {t.totalSales} faturas
                              </td>
                              <td className="p-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRevokeTerminal(t.id)}
                                  className="h-7 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1"
                                >
                                  <Icon name="Trash2" size={12} />
                                  Desconectar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 🛡️ RECURSOS COMPARTILHADOS NA REDE */}
                <div className="p-4 rounded-xl bg-muted/10 border border-border/40 space-y-2.5">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Recursos Partilhados e Sincronizados na LAN
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-card border border-border/40 flex items-center gap-2">
                      <Icon name="FileCheck" size={14} className="text-emerald-500" />
                      <span>Séries Fiscais AGT</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-card border border-border/40 flex items-center gap-2">
                      <Icon name="Boxes" size={14} className="text-primary-500" />
                      <span>Stock JIT Atómico</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-card border border-border/40 flex items-center gap-2">
                      <Icon name="Users" size={14} className="text-amber-500" />
                      <span>Base de Clientes</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-card border border-border/40 flex items-center gap-2">
                      <Icon name="Coins" size={14} className="text-purple-500" />
                      <span>Sessões de Caixa</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PAINEL DO TERMINAL DE VENDA (SLAVE)                                       */}
            {/* ========================================================================= */}
            {terminalMode === "SLAVE" && (
              <div className="p-5 space-y-6">
                <div className="space-y-4 max-w-xl">
                  {/* IP do Master */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Endereço IP do Servidor Master
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ex: 192.168.1.50"
                        value={masterIp}
                        onChange={(e) => setMasterIp(e.target.value)}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        onClick={handleTestConnection}
                        disabled={isTestingLan}
                        className="h-10 gap-1.5 text-xs whitespace-nowrap"
                      >
                        <Icon name="Activity" size={14} className="text-primary-500" />
                        {isTestingLan ? "A testar..." : "Testar Conexão"}
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Introduza o IP exibido nas configurações do computador Main.
                    </p>
                  </div>

                  {/* Código de Segurança LAN */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Código de Emparelhamento LAN
                    </label>
                    <Input
                      type="password"
                      placeholder="Introduza o código gerado no Master"
                      value={lanSecret}
                      onChange={(e) => setLanSecret(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>

                  {/* Resultado do Teste de Conexão */}
                  {lanTestResult && (
                    <div
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        lanTestResult.success
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon name={lanTestResult.success ? "Check" : "AlertTriangle"} size={16} />
                        <span>{lanTestResult.message}</span>
                      </div>
                      {lanTestResult.latencyMs !== undefined && (
                        <span className="font-mono font-bold">Latência: {lanTestResult.latencyMs}ms</span>
                      )}
                    </div>
                  )}

                  {/* Botão Salvar Conexão */}
                  <Button
                    onClick={() => handleSaveLanConfig("SLAVE", masterIp, lanSecret)}
                    className="w-full h-10 gap-2 font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    <Icon name="Save" size={16} />
                    Guardar e Conectar ao Master
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🖨️ SEÇÃO: HARDWARE & DISPOSITIVOS (IMPRESSORA, GAVETA, TECLADO)            */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em] px-1">
          Hardware & Dispositivos do Terminal
        </p>
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/30 shadow-sm">
          <div className="flex items-center justify-between p-4 hover:bg-muted/20 transition-all" data-tour="pos-settings-virtual-keyboard">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Icon name="Keyboard" size={16} className="text-primary-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Teclado Virtual</p>
                <p className="text-[11px] text-muted-foreground">Ocultar quando usar teclado físico</p>
              </div>
            </div>
            <Switch
              checked={disableVirtualKeyboard}
              onCheckedChange={setDisableVirtualKeyboard}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-muted/20 transition-all" data-tour="pos-settings-printer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Icon name="Printer" size={16} className="text-primary-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Impressora térmica</p>
                <p className="text-[11px] text-muted-foreground">
                  Imprimir vendas no formato de talão (80mm/58mm)
                </p>
              </div>
            </div>
            <Switch
              checked={useThermalPrinter}
              onCheckedChange={setUseThermalPrinter}
              aria-label="Usar impressora térmica"
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-muted/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Icon name="Coins" size={16} className="text-amber-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Abertura Automática da Gaveta</p>
                <p className="text-[11px] text-muted-foreground">
                  Acionar pulso elétrico ao finalizar vendas em dinheiro
                </p>
              </div>
            </div>
            <Switch
              checked={autoOpenDrawerOnCash}
              onCheckedChange={setAutoOpenDrawerOnCash}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="p-4 bg-muted/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Diagnóstico de Hardware</p>
                <p className="text-[11px] text-muted-foreground">Testar pulso elétrico RJ11 na impressora conectada</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsHelpOpen(true)}
                  className="h-8 gap-1.5 text-xs"
                >
                  <Icon name="Keyboard" size={14} className="text-primary" />
                  Ver Atalhos (F1)
                </Button>
                <Button
                  size="sm"
                  onClick={handleTestDrawer}
                  disabled={isTestingDrawer}
                  className="h-8 gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Icon name="Coins" size={14} />
                  {isTestingDrawer ? "A testar..." : "Testar Gaveta"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <p className="px-1 text-[11px] text-muted-foreground leading-relaxed mt-2 italic">
          As configurações de hardware e rede aplicam-se a este computador e ficam persistidas localmente.
        </p>
      </div>
    </div>
  );
}
