import { create } from "zustand";

export interface ConnectedTerminal {
  id: string;
  name: string;
  ip: string;
  lastSeen: string;
  status: "ACTIVE" | "IDLE" | "DISCONNECTED";
  latencyMs?: number;
  totalSales?: number;
  appVersion?: string;
}

export interface DiscoveredMasterNode {
  id: string;
  name: string;
  host: string;
  ip: string;
  port: number;
  protocolVersion: string;
  storeId?: string;
  storeName?: string;
  discoveryLayer: "MDNS" | "UDP_BROADCAST" | "MANUAL";
  lastSeen: number;
}

interface LanState {
  enabled: boolean;
  terminalMode: "MASTER" | "SLAVE";
  localIp: string;
  masterIp: string;
  lanSecret: string;
  
  // Master Server State
  isMasterServerRunning: boolean;
  masterServerError: string | null;
  connectedTerminals: ConnectedTerminal[];
  activePairingCode: { code: string; expiresAt: string; ttlSeconds: number } | null;

  // Slave State
  isSlaveConnected: boolean;
  slaveLatencyMs: number | null;
  slaveLastSeen: string | null;
  slaveError: string | null;
  clockOffsetMs: number;

  // Auto-Discovery Multi-Camada
  isScanningDiscovery: boolean;
  discoveredMasters: DiscoveredMasterNode[];

  // Backup Master (Warm Standby)
  isBackupMasterCandidate: boolean;

  setLanState: (partial: Partial<LanState>) => void;
}

const getInitialEnabled = (): boolean => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mindgest_lan_enabled");
    if (stored !== null) return stored === "true";
  }
  return true;
};

export const useLanStore = create<LanState>((set) => ({
  enabled: getInitialEnabled(),
  terminalMode: "MASTER",
  localIp: "127.0.0.1",
  masterIp: "",
  lanSecret: "",

  isMasterServerRunning: false,
  masterServerError: null,
  connectedTerminals: [],
  activePairingCode: null,

  isSlaveConnected: false,
  slaveLatencyMs: null,
  slaveLastSeen: null,
  slaveError: null,
  clockOffsetMs: 0,

  isScanningDiscovery: false,
  discoveredMasters: [],

  isBackupMasterCandidate: false,

  setLanState: (partial) => {
    if (partial.enabled !== undefined && typeof window !== "undefined") {
      localStorage.setItem("mindgest_lan_enabled", partial.enabled ? "true" : "false");
    }
    set((state) => ({ ...state, ...partial }));
  },
}));
