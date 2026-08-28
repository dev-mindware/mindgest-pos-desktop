import dgram from "dgram";
import os from "os";

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

const DISCOVERY_SERVICE_TYPE = "mindgest-pos";
const DISCOVERY_PROTOCOL = "tcp";
const BROADCAST_PORT = 3334;
const DEFAULT_HTTP_PORT = 3333;

let bonjourInstance: any = null;
let publishedService: any = null;
let activeBrowser: any = null;
let broadcastServer: dgram.Socket | null = null;

/**
 * Obtém os endereços IPv4 não-internos da máquina local
 */
export function getAllLocalIps(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips.length > 0 ? ips : ["127.0.0.1"];
}

// ==============================================================================
// CAMADA 1: PUBLICADOR E DESCOBERTA mDNS (BONJOUR)
// ==============================================================================

/**
 * Inicia a publicação mDNS do Servidor Master
 */
export async function startMdnsPublisher(metadata: {
  port?: number;
  storeId?: string;
  storeName?: string;
  appVersion?: string;
}) {
  stopMdnsPublisher();

  try {
    const { Bonjour } = await import("bonjour-service");
    bonjourInstance = new Bonjour();

    const localIps = getAllLocalIps();
    const primaryIp = localIps[0] || "127.0.0.1";

    publishedService = bonjourInstance.publish({
      name: `Mindgest POS - ${metadata.storeName || os.hostname()}`,
      type: DISCOVERY_SERVICE_TYPE,
      protocol: DISCOVERY_PROTOCOL,
      port: metadata.port || DEFAULT_HTTP_PORT,
      txt: {
        version: metadata.appVersion || "2.0.0",
        storeId: metadata.storeId || "",
        storeName: metadata.storeName || "",
        hostname: os.hostname(),
        ip: primaryIp,
        protocolVersion: "2.0",
      },
    });

    console.log(`📡 [LAN Discovery - mDNS] Serviço anunciado: _${DISCOVERY_SERVICE_TYPE}._${DISCOVERY_PROTOCOL}.local na porta ${metadata.port || DEFAULT_HTTP_PORT}`);
  } catch (err) {
    console.warn("⚠️ [LAN Discovery - mDNS] Falha ao iniciar publicação mDNS:", err);
  }
}

/**
 * Encerra o publicador mDNS
 */
export function stopMdnsPublisher() {
  if (publishedService) {
    try {
      publishedService.stop();
    } catch {}
    publishedService = null;
  }
  if (bonjourInstance) {
    try {
      bonjourInstance.destroy();
    } catch {}
    bonjourInstance = null;
  }
}

// ==============================================================================
// CAMADA 2: SERVIDOR E CLIENTE DE BROADCAST UDP (PORTA 3334)
// Resolve bloqueios de Multicast / AP Isolation em routers Wi-Fi
// ==============================================================================

/**
 * Inicia o listener de broadcast UDP no Master
 */
export function startBroadcastServer(metadata: {
  port?: number;
  storeId?: string;
  storeName?: string;
  appVersion?: string;
}) {
  stopBroadcastServer();

  try {
    const server = dgram.createSocket({ type: "udp4", reuseAddr: true });

    server.on("error", (err) => {
      console.warn("⚠️ [LAN Discovery - UDP Server] Erro no socket:", err.message);
      try {
        server.close();
      } catch {}
      broadcastServer = null;
    });

    server.on("message", (msg, rinfo) => {
      try {
        const payload = JSON.parse(msg.toString());
        if (payload.type === "MINDGEST_LAN_PROBE") {
          const response = JSON.stringify({
            type: "MINDGEST_LAN_ANNOUNCE",
            id: `node-${os.hostname()}`,
            name: `Mindgest POS - ${metadata.storeName || os.hostname()}`,
            host: os.hostname(),
            ip: getAllLocalIps()[0] || rinfo.address,
            port: metadata.port || DEFAULT_HTTP_PORT,
            protocolVersion: "2.0",
            storeId: metadata.storeId || "",
            storeName: metadata.storeName || "",
            appVersion: metadata.appVersion || "2.0.0",
            timestamp: Date.now(),
          });

          server.send(response, rinfo.port, rinfo.address, (sendErr) => {
            if (sendErr) {
              console.warn("⚠️ [LAN Discovery - UDP Server] Erro ao responder sonda:", sendErr);
            }
          });
        }
      } catch {
        // Ignora pacotes mal formatados
      }
    });

    server.bind(BROADCAST_PORT, "0.0.0.0", () => {
      console.log(`📡 [LAN Discovery - UDP Server] Listener ativo na porta UDP ${BROADCAST_PORT}`);
    });

    broadcastServer = server;
  } catch (err) {
    console.warn("⚠️ [LAN Discovery - UDP Server] Não foi possível vincular à porta 3334:", err);
  }
}

/**
 * Encerra o listener de broadcast UDP
 */
export function stopBroadcastServer() {
  if (broadcastServer) {
    try {
      broadcastServer.close();
    } catch {}
    broadcastServer = null;
  }
}

// ==============================================================================
// MOTOR UNIFICADO DE DESCOBERTA NO SLAVE (mDNS + UDP BROADCAST)
// ==============================================================================

export class LanDiscoveryClient {
  private discoveredNodes = new Map<string, DiscoveredMasterNode>();
  private onNodeFoundCallbacks: Array<(nodes: DiscoveredMasterNode[]) => void> = [];
  private isScanning = false;
  private udpClient: dgram.Socket | null = null;
  private scanInterval: NodeJS.Timeout | null = null;

  public onNodesUpdated(callback: (nodes: DiscoveredMasterNode[]) => void) {
    this.onNodeFoundCallbacks.push(callback);
    callback(Array.from(this.discoveredNodes.values()));
    return () => {
      this.onNodeFoundCallbacks = this.onNodeFoundCallbacks.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    const list = Array.from(this.discoveredNodes.values());
    this.onNodeFoundCallbacks.forEach((cb) => {
      try {
        cb(list);
      } catch {}
    });
  }

  private registerNode(node: DiscoveredMasterNode) {
    const key = `${node.ip}:${node.port}`;
    this.discoveredNodes.set(key, {
      ...node,
      lastSeen: Date.now(),
    });
    this.notify();
  }

  /**
   * Dispara busca ativa multi-camada (mDNS + UDP Broadcast)
   */
  public async startScanning() {
    if (this.isScanning) return;
    this.isScanning = true;
    this.discoveredNodes.clear();

    // 1. Iniciar scanner mDNS
    try {
      const { Bonjour } = await import("bonjour-service");
      const bonjour = new Bonjour();
      activeBrowser = bonjour.find(
        { type: DISCOVERY_SERVICE_TYPE, protocol: DISCOVERY_PROTOCOL },
        (service: any) => {
          if (!service) return;

          const ip = service.addresses?.find((a: string) => a.includes(".") && !a.startsWith("127.")) || service.host;
          const txt = service.txt || {};

          this.registerNode({
            id: `mdns-${service.name}`,
            name: service.name,
            host: service.host || ip,
            ip: txt.ip || ip,
            port: service.port || DEFAULT_HTTP_PORT,
            protocolVersion: txt.protocolVersion || "2.0",
            storeId: txt.storeId,
            storeName: txt.storeName,
            discoveryLayer: "MDNS",
            lastSeen: Date.now(),
          });
        }
      );
    } catch (err) {
      console.warn("⚠️ [LAN Discovery Client] mDNS indisponível no cliente, prosseguindo com UDP:", err);
    }

    // 2. Iniciar cliente UDP Broadcast
    try {
      this.udpClient = dgram.createSocket({ type: "udp4", reuseAddr: true });
      this.udpClient.on("message", (msg) => {
        try {
          const data = JSON.parse(msg.toString());
          if (data.type === "MINDGEST_LAN_ANNOUNCE" && data.ip && data.port) {
            this.registerNode({
              id: data.id || `node-${data.ip}`,
              name: data.name || `Master (${data.ip})`,
              host: data.host || data.ip,
              ip: data.ip,
              port: data.port,
              protocolVersion: data.protocolVersion || "2.0",
              storeId: data.storeId,
              storeName: data.storeName,
              discoveryLayer: "UDP_BROADCAST",
              lastSeen: Date.now(),
            });
          }
        } catch {}
      });

      this.udpClient.bind(0, () => {
        try {
          this.udpClient?.setBroadcast(true);
          this.sendUdpProbe();
        } catch {}
      });

      // Disparar sonda periódica a cada 3 segundos
      this.scanInterval = setInterval(() => {
        this.sendUdpProbe();
      }, 3000);
    } catch (err) {
      console.warn("⚠️ [LAN Discovery Client] Erro ao iniciar UDP broadcast:", err);
    }
  }

  private sendUdpProbe() {
    if (!this.udpClient) return;
    const probe = Buffer.from(JSON.stringify({ type: "MINDGEST_LAN_PROBE", timestamp: Date.now() }));
    try {
      this.udpClient.send(probe, 0, probe.length, BROADCAST_PORT, "255.255.255.255");
    } catch {}
  }

  public stopScanning() {
    this.isScanning = false;
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    if (activeBrowser) {
      try {
        activeBrowser.stop();
      } catch {}
      activeBrowser = null;
    }
    if (this.udpClient) {
      try {
        this.udpClient.close();
      } catch {}
      this.udpClient = null;
    }
  }

  public getDiscoveredNodes(): DiscoveredMasterNode[] {
    return Array.from(this.discoveredNodes.values());
  }
}

export const lanDiscoveryClient = new LanDiscoveryClient();
