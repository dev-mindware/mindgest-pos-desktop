"use client";

import { useEffect, useCallback, useRef } from "react";
import { useLanStore } from "@/stores/pos/lan-store";

export function useLanHeartbeat() {
  const {
    enabled,
    terminalMode,
    masterIp,
    lanSecret,
    isScanningDiscovery,
    setLanState,
  } = useLanStore();

  const isMountedRef = useRef(true);

  const refreshLanStatus = useCallback(async () => {
    if (typeof window === "undefined" || !window.ipc?.lan) return;

    try {
      const config = await window.ipc.lan.getConfig();
      if (!isMountedRef.current) return;

      const activeMode = config?.terminalMode || terminalMode || "MASTER";

      if (config) {
        const locallyDisabled = typeof window !== "undefined" && localStorage.getItem("mindgest_lan_enabled") === "false";
        const isEnabled = !locallyDisabled && config.enabled !== false;

        setLanState({
          enabled: isEnabled,
          terminalMode: activeMode,
          masterIp: config.masterIp || "",
          lanSecret: config.lanSecret || "",
          localIp: config.localIp || "127.0.0.1",
        });

        if (!isEnabled) {
          setLanState({
            isMasterServerRunning: false,
            isSlaveConnected: false,
          });
          return;
        }
      }

      if (activeMode === "MASTER") {
        const [serverStatus, terminals] = await Promise.all([
          window.ipc.lan.getServerStatus(),
          window.ipc.lan.getConnectedTerminals(),
        ]);

        if (isMountedRef.current) {
          setLanState({
            isMasterServerRunning: serverStatus?.isRunning ?? false,
            masterServerError: serverStatus?.error ?? null,
            connectedTerminals: terminals || [],
            isSlaveConnected: false,
          });
        }
      } else if (activeMode === "SLAVE") {
        const targetMasterIp = config?.masterIp || masterIp;
        if (!targetMasterIp) {
          setLanState({
            isSlaveConnected: false,
            slaveError: "Endereço IP do Master não configurado.",
            isMasterServerRunning: false,
          });
          return;
        }

        const startTime = Date.now();
        const heartbeatRes = await window.ipc.lan.sendHeartbeat({
          masterIp: targetMasterIp,
          lanSecret: config?.lanSecret || lanSecret || undefined,
        });
        const latencyMs = Date.now() - startTime;

        if (isMountedRef.current) {
          if (heartbeatRes?.success || heartbeatRes?.status === "OK") {
            setLanState({
              isSlaveConnected: true,
              slaveLatencyMs: latencyMs,
              slaveLastSeen: new Date().toISOString(),
              slaveError: null,
              clockOffsetMs: heartbeatRes?.clockOffsetMs || 0,
              isMasterServerRunning: false,
            });
          } else {
            setLanState({
              isSlaveConnected: false,
              slaveLatencyMs: null,
              slaveError: heartbeatRes?.error || "Falha de comunicação com o Servidor Master.",
              isMasterServerRunning: false,
            });
          }
        }
      }

      // Se a varredura estiver ativa, consultar nós descobertos
      if (isScanningDiscovery) {
        const discovered = await window.ipc.lan.getDiscoveredMasters();
        if (isMountedRef.current) {
          setLanState({ discoveredMasters: discovered || [] });
        }
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.warn("⚠️ [LAN Heartbeat] Erro ao atualizar status:", err?.message || err);
      }
    }
  }, [terminalMode, masterIp, lanSecret, isScanningDiscovery, setLanState]);

  useEffect(() => {
    isMountedRef.current = true;
    refreshLanStatus();

    const interval = setInterval(() => {
      refreshLanStatus();
    }, 2500);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [refreshLanStatus]);

  return { refreshLanStatus };
}
