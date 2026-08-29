import { ipcMain, app } from "electron";
import os from "os";
import crypto from "crypto";
import { prisma } from "../prisma";
import { getHardwareFingerprint } from "../security";

export function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

let clientClockOffsetMs = 0;

export function getClientClockOffsetMs(): number {
  return clientClockOffsetMs;
}

export function registerLanIpcHandlers(): void {
  ipcMain.handle("lan:get-local-ip", () => {
    return getLocalIpAddress();
  });

  ipcMain.handle("lan:get-config", async () => {
    try {
      const { ensureSettingsSchema } = await import("../prisma");
      await ensureSettingsSchema();

      const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
      const { getLocalServerStatus } = await import("../server");
      const serverStatus = getLocalServerStatus();
      const terminalMode = settings?.terminalMode || 'MASTER';
      const isEnabled = (settings as any)?.lanEnabled !== false;

      return {
        enabled: isEnabled,
        terminalMode,
        masterIp: settings?.masterIp || null,
        lanSecret: settings?.lanSecret || null,
        port: 3333,
        localIp: getLocalIpAddress(),
        isServerRunning: serverStatus.isRunning,
        serverError: serverStatus.error,
        connectedCount: serverStatus.connectedCount,
      };
    } catch (error) {
      console.error("❌ [LAN] Erro ao buscar config LAN:", error);
      return {
        enabled: false,
        terminalMode: 'MASTER',
        masterIp: null,
        lanSecret: null,
        port: 3333,
        localIp: getLocalIpAddress(),
        isServerRunning: false,
        serverError: null,
        connectedCount: 0,
      };
    }
  });

  ipcMain.handle("lan:get-server-status", async () => {
    try {
      const { getLocalServerStatus } = await import("../server");
      const status = getLocalServerStatus();
      return {
        ...status,
        localIp: getLocalIpAddress(),
      };
    } catch (error: any) {
      return {
        isRunning: false,
        port: 3333,
        connectedCount: 0,
        error: error?.message || "Erro ao consultar status do servidor.",
        localIp: getLocalIpAddress(),
      };
    }
  });

  ipcMain.handle("lan:set-config", async (_, config) => {
    try {
      const { ensureSettingsSchema } = await import("../prisma");
      await ensureSettingsSchema();

      const terminalMode = config?.terminalMode || 'MASTER';
      const masterIp = config?.masterIp || null;
      const lanSecret = config?.lanSecret || null;
      const lanEnabled = config?.enabled !== false;

      await (prisma.settings as any).upsert({
        where: { id: 'singleton' },
        update: { 
          terminalMode,
          masterIp,
          lanSecret,
          lanEnabled
        },
        create: { 
          id: 'singleton',
          terminalMode,
          masterIp,
          lanSecret,
          lanEnabled
        }
      });

      const { startLocalServer, stopLocalServer } = await import("../server");
      if (terminalMode === 'MASTER' && lanEnabled) {
        try {
          await startLocalServer();
          console.log("✅ [LAN] Servidor Master iniciado dinamicamente!");
        } catch (srvErr) {
          console.error("⚠️ [LAN] Falha ao iniciar Servidor Master:", srvErr);
        }
      } else {
        await stopLocalServer();
        console.log("🛑 [LAN] Servidor Master desativado dinamicamente.");
      }

      return true;
    } catch (error) {
      console.error("❌ [LAN] Erro ao guardar config LAN:", error);
      throw error;
    }
  });

  ipcMain.handle("lan:rotate-secret", async () => {
    try {
      const newSecret = crypto.randomBytes(16).toString('hex').toUpperCase();
      await (prisma.settings as any).upsert({
        where: { id: 'singleton' },
        update: { lanSecret: newSecret },
        create: { id: 'singleton', lanSecret: newSecret, terminalMode: 'MASTER' }
      });
      const { setRotatedSecret } = await import("../server");
      setRotatedSecret(newSecret);
      return newSecret;
    } catch (error) {
      console.error("❌ [LAN] Erro ao gerar novo segredo LAN:", error);
      throw error;
    }
  });

  ipcMain.handle("lan:get-connected-terminals", async () => {
    try {
      const { getConnectedTerminalsList } = await import("../server");
      return getConnectedTerminalsList();
    } catch (error) {
      return [];
    }
  });

  ipcMain.handle("lan:revoke-terminal", async (_, { terminalId }) => {
    try {
      const { revokeConnectedTerminal } = await import("../server");
      return revokeConnectedTerminal(terminalId);
    } catch (error) {
      return false;
    }
  });

  ipcMain.handle("lan:test-connection", async (_, { targetIp, lanSecret }) => {
    const startTime = Date.now();
    try {
      const cleanIp = targetIp.trim().replace(/^http:\/\//, '').replace(/\/$/, '');
      const url = `http://${cleanIp}:3333/api/health`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, {
        method: "GET",
        headers: lanSecret ? { "x-lan-secret": lanSecret } : {},
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          latencyMs,
          serverTime: data.timestamp,
          connectedCount: data.connectedCount,
          message: "Conexão bem sucedida com o Master LAN!"
        };
      } else {
        return {
          success: false,
          latencyMs,
          message: `Servidor respondeu com status ${res.status}: ${res.statusText}`
        };
      }
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - startTime,
        message: err.name === "AbortError" ? "Tempo limite excedido (4s). Verifique o IP ou Firewall." : (err.message || "Não foi possível conectar ao Master.")
      };
    }
  });

  ipcMain.handle("lan:send-heartbeat", async (_, { masterIp, lanSecret, terminalName }) => {
    try {
      if (!masterIp) {
        return { success: false, error: "IP do Master não configurado." };
      }
      const cleanIp = masterIp.trim().replace(/^http:\/\//, '').replace(/\/$/, '');
      const url = `http://${cleanIp}:3333/api/lan/heartbeat`;
      const hwid = getHardwareFingerprint();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const clientSendTime = Date.now();
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(lanSecret ? { "x-lan-secret": lanSecret } : {})
        },
        body: JSON.stringify({
          terminalId: hwid,
          terminalName: terminalName || os.hostname(),
          appVersion: app.getVersion(),
          clientTime: new Date(clientSendTime).toISOString()
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.serverTime) {
          const serverTimestamp = new Date(data.serverTime).getTime();
          clientClockOffsetMs = serverTimestamp - Date.now();
        }
        return { success: true, ...data, clockOffsetMs: clientClockOffsetMs };
      } else {
        const errData = await res.json().catch(() => null);
        return {
          success: false,
          status: res.status,
          error: errData?.error || `Servidor Master recusou com status ${res.status}: ${res.statusText}`,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.name === "AbortError"
          ? "Tempo limite excedido ao contactar Master (4s)."
          : (err?.message || "Não foi possível conectar ao Master."),
      };
    }
  });

  ipcMain.handle("lan:get-pairing-code", async () => {
    try {
      const { generatePairingCode, getCurrentPairingCode } = await import("../server");
      const current = getCurrentPairingCode() || generatePairingCode();
      return {
        code: current.code,
        expiresAt: new Date(current.expiresAt).toISOString(),
        ttlSeconds: Math.max(0, Math.round((current.expiresAt - Date.now()) / 1000)),
      };
    } catch (err: any) {
      return { error: err?.message || "Erro ao obter código de emparelhamento." };
    }
  });

  ipcMain.handle("lan:pair-terminal", async (_, { targetIp, code, terminalName }) => {
    try {
      if (!targetIp || !code) {
        return { success: false, error: "IP de destino e Código são obrigatórios." };
      }
      const cleanIp = targetIp.trim().replace(/^http:\/\//, '').replace(/\/$/, '');
      const url = `http://${cleanIp}:3333/api/lan/pair`;
      const hwid = getHardwareFingerprint();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: String(code).trim(),
          terminalId: hwid,
          terminalName: terminalName || os.hostname(),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        await (prisma.settings as any).upsert({
          where: { id: "singleton" },
          update: {
            terminalMode: "SLAVE",
            masterIp: cleanIp,
            lanSecret: data.lanSecret,
          },
          create: {
            id: "singleton",
            terminalMode: "SLAVE",
            masterIp: cleanIp,
            lanSecret: data.lanSecret,
          },
        });
        return { success: true, ...data };
      } else {
        const errData = await res.json().catch(() => null);
        return { success: false, error: errData?.error || `Falha no emparelhamento (Status ${res.status})` };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.name === "AbortError" ? "Tempo limite ao contactar o Master." : (err?.message || "Erro de conexão."),
      };
    }
  });

  ipcMain.handle("lan:start-discovery", async (_, params?: { lastKnownMasterIp?: string }) => {
    try {
      const { lanDiscoveryClient } = await import("../lan-discovery");
      await lanDiscoveryClient.startScanning(params?.lastKnownMasterIp);
      return true;
    } catch (err: any) {
      console.warn("⚠️ Falha ao iniciar scan de auto-descoberta LAN:", err);
      return false;
    }
  });

  ipcMain.handle("lan:diagnose-switch", async (_, { targetIp, port = 3333 }) => {
    try {
      const { lanDiscoveryClient } = await import("../lan-discovery");
      return await lanDiscoveryClient.diagnoseMasterConnection(targetIp, port);
    } catch (err: any) {
      return {
        success: false,
        isTcpReachable: false,
        isMdnsReachable: false,
        possibleIgmpSnooping: false,
        message: err?.message || "Erro ao executar diagnóstico de rede.",
      };
    }
  });

  ipcMain.handle("lan:stop-discovery", async () => {
    try {
      const { lanDiscoveryClient } = await import("../lan-discovery");
      lanDiscoveryClient.stopScanning();
      return true;
    } catch {
      return false;
    }
  });

  ipcMain.handle("lan:get-discovered-masters", async () => {
    try {
      const { lanDiscoveryClient } = await import("../lan-discovery");
      return lanDiscoveryClient.getDiscoveredNodes();
    } catch {
      return [];
    }
  });

  ipcMain.handle("lan:verify-hash-chain", async () => {
    try {
      const { backupMasterService } = await import("../backup-master");
      return await backupMasterService.verifyFiscalHashChain();
    } catch (err: any) {
      return { isValid: false, error: err?.message || "Erro ao validar cadeia fiscal." };
    }
  });

  ipcMain.handle("lan:promote-backup-master", async (_, params) => {
    try {
      const { backupMasterService } = await import("../backup-master");
      return await backupMasterService.promoteToMaster(params);
    } catch (err: any) {
      return { success: false, error: err?.message || "Erro ao promover terminal a Master." };
    }
  });

  ipcMain.handle("lan:check-system-capability", () => {
    const totalMemBytes = os.totalmem();
    const freeMemBytes = os.freemem();
    const totalMemoryGB = Math.round((totalMemBytes / (1024 * 1024 * 1024)) * 10) / 10;
    const freeMemoryGB = Math.round((freeMemBytes / (1024 * 1024 * 1024)) * 10) / 10;
    const cpuCores = os.cpus().length;
    const arch = os.arch();
    const platform = os.platform();

    const isMasterEligible = totalMemoryGB >= 4 && cpuCores >= 2;
    const isOptimalMaster = totalMemoryGB >= 8 && cpuCores >= 4;

    let recommendation = "Adequado para Terminal de Venda (Slave).";
    if (isOptimalMaster) {
      recommendation = "Excelente capacidade para Servidor Central (Master Multi-Terminal).";
    } else if (isMasterEligible) {
      recommendation = "Adequado para Servidor Central (Master com até 3 terminais).";
    }

    return {
      totalMemoryGB,
      freeMemoryGB,
      cpuCores,
      arch,
      platform,
      isMasterEligible,
      isOptimalMaster,
      recommendation,
    };
  });
}
