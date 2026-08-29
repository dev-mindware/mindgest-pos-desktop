"use client";

import { useState, useEffect } from "react";
import { useLanStore, DiscoveredMasterNode } from "@/stores/pos/lan-store";
import { useLanHeartbeat } from "@/hooks/pos/use-lan-heartbeat";
import { SucessMessage, ErrorMessage, WarningMessage } from "@/utils/messages";
import { ShortcutsHelpModal } from "../../counter/modals";
import { useAuthStore, useModal } from "@/stores";
import { ManagerAuthModal, MODAL_MANAGER_AUTH_ID } from "../../manager-auth-modal";
import {
  WorkspaceLanHeader,
  LanSystemDiagnostics,
  LanModeSelector,
  LanMasterPanel,
  LanSlavePanel,
  WorkspaceHardwareSection,
  SystemCapability,
} from "./workspace-sections";

export function PosWorkspaceSettings() {
  const { user } = useAuthStore();
  const { openModal } = useModal();
  const [pendingModeChange, setPendingModeChange] = useState<"MASTER" | "SLAVE" | null>(null);

  // Hook de heartbeat em tempo real para sincronização da rede
  const { refreshLanStatus } = useLanHeartbeat();

  // Store global de rede LAN
  const {
    enabled: lanEnabled,
    terminalMode,
    localIp,
    masterIp: storeMasterIp,
    lanSecret: storeLanSecret,
    isMasterServerRunning,
    masterServerError,
    connectedTerminals,
    isSlaveConnected,
    slaveLatencyMs,
    slaveError,
    clockOffsetMs,
    discoveredMasters,
    setLanState,
  } = useLanStore();

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Inputs locais editáveis
  const [localMasterIp, setLocalMasterIp] = useState<string>(storeMasterIp || "");
  const [localLanSecret, setLocalLanSecret] = useState<string>(storeLanSecret || "");
  const [shortPairingCodeInput, setShortPairingCodeInput] = useState<string>("");
  const [isTestingLan, setIsTestingLan] = useState(false);
  const [isConnectingSlave, setIsConnectingSlave] = useState(false);
  const [isPairingByCode, setIsPairingByCode] = useState(false);
  const [connectingIp, setConnectingIp] = useState<string | null>(null);
  const [lanTestResult, setLanTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    message?: string;
  } | null>(null);
  const [switchDiagnosis, setSwitchDiagnosis] = useState<{
    success: boolean;
    isTcpReachable: boolean;
    isMdnsReachable: boolean;
    possibleIgmpSnooping: boolean;
    latencyMs?: number;
    message: string;
    error?: string;
  } | null>(null);
  const [isDiagnosingSwitch, setIsDiagnosingSwitch] = useState(false);
  const [isRotatingSecret, setIsRotatingSecret] = useState(false);
  const [systemCap, setSystemCap] = useState<SystemCapability | null>(null);

  // Master Pairing Code State
  const [masterPairingCode, setMasterPairingCode] = useState<{
    code: string;
    expiresAt: string;
    ttlSeconds: number;
  } | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  // Sincronizar inputs quando o store atualizar
  useEffect(() => {
    if (storeMasterIp && !localMasterIp) setLocalMasterIp(storeMasterIp);
    if (storeLanSecret && !localLanSecret) setLocalLanSecret(storeLanSecret);
  }, [storeMasterIp, storeLanSecret]);

  // Iniciar auto-descoberta LAN ao abrir configurações no modo Slave (com reconexão rápida por IP persistido)
  useEffect(() => {
    if (terminalMode === "SLAVE" && typeof window !== "undefined" && window.ipc?.lan) {
      setLanState({ isScanningDiscovery: true });
      window.ipc.lan.startDiscovery?.({ lastKnownMasterIp: storeMasterIp || localMasterIp || undefined });
      return () => {
        window.ipc.lan.stopDiscovery?.();
        setLanState({ isScanningDiscovery: false });
      };
    }
  }, [terminalMode, storeMasterIp, localMasterIp, setLanState]);

  // Carregar Diagnóstico de Hardware
  useEffect(() => {
    const loadDiagnostics = async () => {
      try {
        if (typeof window !== "undefined" && window.ipc?.lan) {
          const cap = await window.ipc.lan.checkSystemCapability?.();
          if (cap) setSystemCap(cap);
        }
      } catch (err) {
        console.error("Erro ao carregar diagnóstico de hardware:", err);
      }
    };
    loadDiagnostics();
  }, []);

  // Salvar Configuração LAN
  const handleSaveLanConfig = async (
    newMode?: "MASTER" | "SLAVE",
    newMasterIp?: string,
    newSecret?: string,
    newEnabled?: boolean
  ) => {
    const enabledToSave = newEnabled !== undefined ? newEnabled : lanEnabled;
    const modeToSave = newMode || terminalMode;
    const ipToSave = newMasterIp !== undefined ? newMasterIp : localMasterIp;
    const secretToSave = newSecret !== undefined ? newSecret : localLanSecret;

    if (typeof window !== "undefined") {
      localStorage.setItem("mindgest_lan_enabled", enabledToSave ? "true" : "false");
    }

    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        await window.ipc.lan.setConfig({
          terminalMode: modeToSave,
          masterIp: ipToSave || null,
          lanSecret: secretToSave || null,
          enabled: enabledToSave,
        });

        setLanState({
          enabled: enabledToSave,
          terminalMode: modeToSave,
          masterIp: ipToSave || "",
          lanSecret: secretToSave || "",
        });

        SucessMessage(
          enabledToSave
            ? `Rede Local ativada (${modeToSave === "MASTER" ? "Servidor Central Master" : "Terminal de Venda"})!`
            : "Rede Local colocada em pausa!"
        );
        await refreshLanStatus();
      }
    } catch (err: any) {
      console.error("❌ [Workspace Settings] Erro ao guardar configuração LAN:", err);
      ErrorMessage(err?.message || "Erro ao guardar configuração de rede.");
    }
  };

  const handleToggleLan = async (checked: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mindgest_lan_enabled", checked ? "true" : "false");
    }
    setLanState({ enabled: checked });
    await handleSaveLanConfig(terminalMode, undefined, undefined, checked);
  };

  // Salvar e Conectar Terminal Slave com teste em tempo real
  const handleSaveAndConnectSlave = async () => {
    if (!localMasterIp) {
      WarningMessage("Por favor, introduza o endereço IP do Servidor Master.");
      return;
    }

    setIsConnectingSlave(true);
    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        await window.ipc.lan.setConfig({
          terminalMode: "SLAVE",
          masterIp: localMasterIp.trim(),
          lanSecret: localLanSecret.trim() || null,
          enabled: true,
        });

        setLanState({
          enabled: true,
          terminalMode: "SLAVE",
          masterIp: localMasterIp.trim(),
          lanSecret: localLanSecret.trim(),
        });

        const hbResult = await window.ipc.lan.sendHeartbeat({
          masterIp: localMasterIp.trim(),
          lanSecret: localLanSecret.trim() || undefined,
        });

        if (hbResult?.success || hbResult?.status === "OK") {
          SucessMessage("Ligação ao Servidor Master estabelecida com sucesso!");
        } else {
          ErrorMessage(hbResult?.error || "Falha ao conectar com o Servidor Master. Verifique se o Master está ativo na mesma rede.");
        }

        await refreshLanStatus();
      }
    } catch {
      ErrorMessage("Erro ao conectar com o Master.");
    } finally {
      setIsConnectingSlave(false);
    }
  };

  // Conectar a um Master descoberto por 1 clique
  const handleQuickConnectDiscoveredMaster = async (node: DiscoveredMasterNode) => {
    setConnectingIp(node.ip);
    setLocalMasterIp(node.ip);

    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        await window.ipc.lan.setConfig({
          terminalMode: "SLAVE",
          masterIp: node.ip,
          lanSecret: localLanSecret.trim() || null,
          enabled: true,
        });

        setLanState({
          enabled: true,
          terminalMode: "SLAVE",
          masterIp: node.ip,
        });

        const hbResult = await window.ipc.lan.sendHeartbeat({
          masterIp: node.ip,
          lanSecret: localLanSecret.trim() || undefined,
        });

        if (hbResult?.success || hbResult?.status === "OK") {
          SucessMessage(`Conectado ao Master "${node.name}" (${node.ip})!`);
        } else {
          SucessMessage(`Master ${node.ip} selecionado! Introduza o código PIN de 6 dígitos se necessário.`);
        }

        await refreshLanStatus();
      }
    } catch {
      ErrorMessage("Erro ao conectar ao Master selecionado.");
    } finally {
      setConnectingIp(null);
    }
  };

  // Emparelhamento Rápido por Código de 6 Dígitos
  const handlePairByShortCode = async () => {
    if (!localMasterIp || !shortPairingCodeInput) {
      WarningMessage("Introduza o IP do Master e o Código de 6 dígitos.");
      return;
    }

    setIsPairingByCode(true);
    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        const pairRes = await window.ipc.lan.pairTerminal({
          targetIp: localMasterIp.trim(),
          code: shortPairingCodeInput.trim(),
        });

        if (pairRes.success && pairRes.lanSecret) {
          setLocalLanSecret(pairRes.lanSecret);
          setLanState({
            enabled: true,
            lanSecret: pairRes.lanSecret,
            masterIp: localMasterIp.trim(),
            terminalMode: "SLAVE",
          });
          SucessMessage("Terminal emparelhado com sucesso com o Master!");
          setShortPairingCodeInput("");
          await refreshLanStatus();
        } else {
          ErrorMessage(pairRes.error || "Código de emparelhamento inválido ou expirado.");
        }
      }
    } catch {
      ErrorMessage("Falha ao emparelhar com o Master.");
    } finally {
      setIsPairingByCode(false);
    }
  };

  // Gerar Código de Emparelhamento no Master
  const handleGenerateMasterPairingCode = async () => {
    setIsGeneratingCode(true);
    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        const pairing = await window.ipc.lan.getPairingCode();
        if (pairing?.code) {
          setMasterPairingCode(pairing);
          SucessMessage("Código de emparelhamento gerado (Válido por 5 min)!");
        }
      }
    } catch {
      ErrorMessage("Erro ao gerar código de emparelhamento.");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Rotação da Chave LAN
  const handleRotateSecret = async () => {
    setIsRotatingSecret(true);
    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        const newKey = await window.ipc.lan.rotateSecret();
        setLocalLanSecret(newKey);
        setLanState({ lanSecret: newKey });
        SucessMessage("Nova chave de segurança LAN gerada!");
        await refreshLanStatus();
      }
    } catch {
      ErrorMessage("Erro ao rotacionar chave LAN.");
    } finally {
      setIsRotatingSecret(false);
    }
  };

  // Testar Conexão ao Master
  const handleTestConnection = async () => {
    if (!localMasterIp) {
      WarningMessage("Por favor, introduza o endereço IP do Servidor Master.");
      return;
    }

    setIsTestingLan(true);
    setLanTestResult(null);
    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        const res = await window.ipc.lan.testConnection({
          targetIp: localMasterIp.trim(),
          lanSecret: localLanSecret.trim() || undefined,
        });
        setLanTestResult(res);
        if (res.success) {
          SucessMessage(`Conectado ao Master! Latência: ${res.latencyMs}ms`);
        } else {
          ErrorMessage(res.message || "Falha ao conectar com o Servidor Master.");
        }
      }
    } catch {
      ErrorMessage("Erro ao realizar teste de conexão.");
    } finally {
      setIsTestingLan(false);
    }
  };

  // Diagnóstico de Switch Ethernet & IGMP Snooping
  const handleDiagnoseSwitch = async () => {
    if (!localMasterIp) {
      WarningMessage("Introduza o IP do Servidor Master para diagnosticar o switch/cabo.");
      return;
    }

    setIsDiagnosingSwitch(true);
    setSwitchDiagnosis(null);
    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        const res = await window.ipc.lan.diagnoseSwitch({
          targetIp: localMasterIp.trim(),
        });
        setSwitchDiagnosis(res);
        if (res.possibleIgmpSnooping) {
          WarningMessage("Bloqueio Multicast: IGMP Snooping ativo no Switch.");
        } else if (res.success) {
          SucessMessage("Switch e cabo Ethernet 100% operacionais!");
        } else {
          ErrorMessage(res.message || "Falha na comunicação física por cabo.");
        }
      }
    } catch {
      ErrorMessage("Erro ao executar diagnóstico de switch.");
    } finally {
      setIsDiagnosingSwitch(false);
    }
  };

  // Revogar Terminal Conectado
  const handleRevokeTerminal = async (terminalId: string) => {
    try {
      if (typeof window !== "undefined" && window.ipc?.lan) {
        const success = await window.ipc.lan.revokeTerminal({ terminalId });
        if (success) {
          SucessMessage("Terminal desconectado com sucesso!");
          await refreshLanStatus();
        }
      }
    } catch {
      ErrorMessage("Erro ao desconectar terminal.");
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

    handleSaveLanConfig(newMode, undefined, undefined, true);
  };

  const onManagerAuthorized = () => {
    if (pendingModeChange) {
      handleSaveLanConfig(pendingModeChange, undefined, undefined, true);
      setPendingModeChange(null);
      SucessMessage("Autorização de Gerente/Owner confirmada! Servidor Central (Master) ativado neste computador.");
    }
  };

  return (
    <div
      className="space-y-6 sm:space-y-8 pb-16 max-w-full overflow-x-hidden text-stone-800 dark:text-stone-200"
      data-tour="pos-settings-workspace"
    >
      <ShortcutsHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ManagerAuthModal onAuthenticated={onManagerAuthorized} />

      {/* 🌐 SEÇÃO: REDE LOCAL OFFLINE & MULTI-TERMINAL */}
      <div className="space-y-4">
        <WorkspaceLanHeader lanEnabled={lanEnabled} onToggleLan={handleToggleLan} />

        <LanSystemDiagnostics systemCap={systemCap} />

        <div className="bg-card rounded-[6px] border border-stone-200/90 dark:border-stone-800/90 overflow-hidden divide-y divide-border/40 shadow-soft-md">
          <LanModeSelector terminalMode={terminalMode} onSelectMode={handleSelectMode} />

          {terminalMode === "MASTER" && (
            <LanMasterPanel
              isMasterServerRunning={isMasterServerRunning}
              masterServerError={masterServerError}
              localIp={localIp}
              storeLanSecret={storeLanSecret}
              connectedTerminals={connectedTerminals}
              onStartServer={() => handleSaveLanConfig("MASTER", undefined, undefined, true)}
              onRotateSecret={handleRotateSecret}
              isRotatingSecret={isRotatingSecret}
              onGeneratePairingCode={handleGenerateMasterPairingCode}
              isGeneratingCode={isGeneratingCode}
              masterPairingCode={masterPairingCode}
              onRevokeTerminal={handleRevokeTerminal}
            />
          )}

          {terminalMode === "SLAVE" && (
            <LanSlavePanel
              isSlaveConnected={isSlaveConnected}
              storeMasterIp={storeMasterIp}
              localMasterIp={localMasterIp}
              setLocalMasterIp={setLocalMasterIp}
              localLanSecret={localLanSecret}
              setLocalLanSecret={setLocalLanSecret}
              shortPairingCodeInput={shortPairingCodeInput}
              setShortPairingCodeInput={setShortPairingCodeInput}
              slaveLatencyMs={slaveLatencyMs}
              clockOffsetMs={clockOffsetMs}
              slaveError={slaveError}
              discoveredMasters={discoveredMasters}
              connectingIp={connectingIp}
              isPairingByCode={isPairingByCode}
              isTestingLan={isTestingLan}
              isConnectingSlave={isConnectingSlave}
              lanTestResult={lanTestResult}
              switchDiagnosis={switchDiagnosis}
              isDiagnosingSwitch={isDiagnosingSwitch}
              onDiagnoseSwitch={handleDiagnoseSwitch}
              onQuickConnectDiscoveredMaster={handleQuickConnectDiscoveredMaster}
              onPairByShortCode={handlePairByShortCode}
              onTestConnection={handleTestConnection}
              onSaveAndConnectSlave={handleSaveAndConnectSlave}
              onSaveWithoutConnect={() => handleSaveLanConfig("SLAVE", undefined, undefined, true)}
            />
          )}
        </div>
      </div>

      {/* 🖨️ SEÇÃO: HARDWARE DE IMPRESSÃO & GAVETA */}
      <WorkspaceHardwareSection />
    </div>
  );
}
