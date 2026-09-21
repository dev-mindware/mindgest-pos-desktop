import axios from "axios";
import { syncService } from "./sync";
import { CLOUD_API_URL } from "./config";
import { prisma } from "./prisma";
import { database } from "./database";
import { FiscalSignatureService } from "./fiscal-signature";
import { getHardwareFingerprint } from "./security";
import { broadcastToRenderers } from "./utils/broadcast";

const CLOUD_API_KEY = process.env.NEXT_PUBLIC_API_KEY || "MG_REg4eFg5eDJQU0lmNWcKUQU0YN3BDZDNvU2dnSnQ5OXRiL3NtbEhqSzhpdXNDZ2V6T2NwbzlCYnJDRWBTkJna3Foa2lHOXcwQkFRRUZBQVNZkbQo2lmN4eFg_MG";
const DEFAULT_SYNC_INTERVAL_MS = 2 * 60 * 1000; // 2 minutos

interface AutoSyncParams {
  token: string;
  storeId: string;
  userId: string;
  intervalMs?: number;
}

interface SyncStatus {
  running: boolean;
  lastSyncAt?: string;
  nextSyncAt?: string;
  lastResult?: any;
}

export class SyncManager {
  private intervalId: NodeJS.Timeout | null = null;
  private isSyncing = false;
  private lastSyncAt: Date | null = null;
  private nextSyncAt: Date | null = null;
  private currentParams: AutoSyncParams | null = null;

  private getNextSyncDate(intervalMs: number): Date {
    return new Date(Date.now() + intervalMs);
  }

  private async canReachCloud(token?: string, storeId?: string): Promise<boolean> {
    const pingPaths = ["/health", "/ping", "/"];
    for (const path of pingPaths) {
      try {
        console.log(`🔎 [SyncManager] Verificando saúde da Cloud em ${CLOUD_API_URL}${path} ...`);
        await axios.get(`${CLOUD_API_URL}${path}`, { 
          timeout: 4000,
          headers: { 'x-api-key': CLOUD_API_KEY }
        });
        console.log(`🔎 [SyncManager] Endpoint ${path} respondeu OK.`);
        return true;
      } catch (err: any) {
        console.warn(`🔎 [SyncManager] Falha ao acessar ${path}: ${err?.message || err}`);
      }
    }

    if (token) {
      try {
        console.log("🔎 [SyncManager] Tentando chamada autenticada /items como fallback para checagem de rede.");
        await axios.get(`${CLOUD_API_URL}/items`, {
          timeout: 6000,
          headers: { 
            Authorization: `Bearer ${token}`,
            'x-api-key': CLOUD_API_KEY
          },
          params: { limit: 1, storeId }
        });
        console.log("🔎 [SyncManager] Chamada autenticada obteve resposta — nuvem acessível.");
        return true;
      } catch (err: any) {
        console.warn("🔎 [SyncManager] Chamada autenticada falhou:", err?.message || err);
      }
    }

    console.warn("🔎 [SyncManager] Não foi possível alcançar a Cloud (todos os testes falharam)." );
    return false;
  }

  /**
   * Envia telemetria fiscal e hash chain de auditoria para a cloud (Heartbeat)
   */
  public async sendHeartbeat(token?: string, storeId?: string): Promise<{ success: boolean; confirmedCheckpointHash?: string; error?: string }> {
    try {
      const keys = await FiscalSignatureService.getOrInitializeKeys();
      const auditResult = database.verifyAuditChain();
      const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
      const lastDoc = await prisma.invoice.findFirst({
        where: storeId ? { storeId } : undefined,
        orderBy: { issueDate: 'desc' }
      });

      const payload = {
        publicKey: keys.publicKey,
        lastDocumentHash: lastDoc?.hash || null,
        lastDocumentDate: lastDoc?.issueDate ? lastDoc.issueDate.toISOString() : null,
        auditChainValid: auditResult.valid,
        lastRowHash: auditResult.lastRowHash,
        firstNewPrevHash: auditResult.firstNewPrevHash || null,
        lastCheckpointHash: auditResult.lastCheckpointHash || null,
        terminalMode: settings?.terminalMode || 'MASTER',
        hardwareId: getHardwareFingerprint(),
        timestamp: new Date().toISOString()
      };

      console.log("📡 [SyncManager] Enviando heartbeat fiscal e de auditoria para a cloud...", {
        auditChainValid: payload.auditChainValid,
        lastRowHash: payload.lastRowHash
      });

      const headers: any = { 'x-api-key': CLOUD_API_KEY };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await axios.post(`${CLOUD_API_URL}/pos/heartbeat`, payload, {
        headers,
        timeout: 8000
      }).catch(async () => {
        // Fallback para endpoint de health com post
        return await axios.post(`${CLOUD_API_URL}/health/heartbeat`, payload, {
          headers,
          timeout: 8000
        });
      });

      const confirmedHash = response?.data?.confirmedCheckpointHash || auditResult.lastRowHash;
      if (confirmedHash) {
        database.setConfirmedCheckpointHash(confirmedHash);
        await prisma.settings.upsert({
          where: { id: 'singleton' },
          update: { lastConfirmedCheckpointHash: confirmedHash },
          create: { id: 'singleton', lastConfirmedCheckpointHash: confirmedHash }
        });
      }

      database.createCheckpointIfDue();
      return { success: true, confirmedCheckpointHash: confirmedHash };
    } catch (err: any) {
      console.warn("⚠️ [SyncManager] Heartbeat não enviado (possivelmente offline):", err?.message || err);
      return { success: false, error: err?.message || String(err) };
    }
  }

  /**
   * Dispara um heartbeat imediato (usado após rotação de chaves ou eventos críticos)
   */
  public async triggerImmediateHeartbeat(): Promise<any> {
    const token = this.currentParams?.token;
    const storeId = this.currentParams?.storeId;
    return await this.sendHeartbeat(token, storeId);
  }

  private async runSyncCycle(token: string, storeId: string, userId: string) {
    if (this.isSyncing) {
      console.log("🔄 [SyncManager] Já há um ciclo de sincronização em curso.");
      return { message: "already_running" };
    }

    this.isSyncing = true;
    this.lastSyncAt = new Date();

    const initialPending = await prisma.syncOutbox.count({
      where: { status: { in: ["PENDING", "PENDING_DEPENDENCIES"] } },
    }).catch(() => 0);

    broadcastToRenderers("sync:state-changed", {
      isSyncing: true,
      pendingCount: initialPending,
    });

    let cycleResult: "success" | "partial" | "error" = "success";

    try {
      const online = await this.canReachCloud(token, storeId);
      if (!online) {
        console.warn("⚠️ [SyncManager] Rede indisponível. Sync adiado.");
        cycleResult = "error";
        return { online: false };
      }

      console.log("🔄 [SyncManager] Iniciando ciclo de sincronização completo...");

      const outboxResult = await syncService.processOutbox(token, userId);
      const categoryResult = await syncService.syncCategories(token, storeId);
      const clientResult = await syncService.syncClients(token, storeId);
      const productResult = await syncService.syncProducts(token, storeId);
      const agtSeriesResult = await syncService.syncAgtSeries(token, storeId);
      const invoiceResult = await syncService.syncInvoices(token, storeId);

      // Executar Heartbeat e verificação de auditoria
      const heartbeatResult = await this.sendHeartbeat(token, storeId);

      const remainingPending = await prisma.syncOutbox.count({
        where: { status: { in: ["PENDING", "PENDING_DEPENDENCIES"] } },
      }).catch(() => 0);

      broadcastToRenderers("sync:outbox-changed", {
        pendingCount: remainingPending,
      });

      if (remainingPending > 0) {
        cycleResult = (outboxResult?.processed ?? 0) > 0 ? "partial" : "error";
      } else {
        cycleResult = "success";
      }

      const result = {
        online: true,
        outbox: outboxResult,
        categories: categoryResult,
        clients: clientResult, 
        products: productResult,
        AGTSeries: agtSeriesResult,
        invoices: invoiceResult,
        heartbeat: heartbeatResult,
        timestamp: new Date().toISOString(),
      };

      console.log("✅ [SyncManager] Ciclo de sincronização completo.", result);
      return result;
    } catch (error: any) {
      console.error("❌ [SyncManager] Erro no ciclo de sincronização:", error?.message || error);
      cycleResult = "error";
      return { online: true, error: error?.message || String(error) };
    } finally {
      this.isSyncing = false;
      this.lastSyncAt = new Date();

      const finalPending = await prisma.syncOutbox.count({
        where: { status: { in: ["PENDING", "PENDING_DEPENDENCIES"] } },
      }).catch(() => 0);

      broadcastToRenderers("sync:state-changed", {
        isSyncing: false,
        lastResult: cycleResult,
        pendingCount: finalPending,
        lastSyncAt: Date.now(),
      });
      broadcastToRenderers("sync:outbox-changed", {
        pendingCount: finalPending,
      });

      if (this.currentParams) {
        const interval = this.currentParams.intervalMs ?? DEFAULT_SYNC_INTERVAL_MS;
        this.nextSyncAt = this.getNextSyncDate(interval);
      }
    }
  }

  public async triggerSync(params: AutoSyncParams) {
    this.currentParams = {
      token: params.token,
      storeId: params.storeId,
      userId: params.userId,
      intervalMs: params.intervalMs ?? DEFAULT_SYNC_INTERVAL_MS
    };
    return this.runSyncCycle(params.token, params.storeId, params.userId);
  }

  public async start(params: AutoSyncParams) {
    if (this.intervalId) {
      this.stop();
    }

    this.currentParams = {
      token: params.token,
      storeId: params.storeId,
      userId: params.userId,
      intervalMs: params.intervalMs ?? DEFAULT_SYNC_INTERVAL_MS
    };

    const intervalMs = this.currentParams.intervalMs ?? DEFAULT_SYNC_INTERVAL_MS;
    this.currentParams.intervalMs = intervalMs;
    this.nextSyncAt = this.getNextSyncDate(intervalMs);

    // Run cleanup on start safely
    if (typeof (syncService as any)?.cleanupOldInvoices === "function") {
      (syncService as any).cleanupOldInvoices().catch((e: any) => console.error("Erro na limpeza de faturas antigas:", e));
    }

    this.intervalId = setInterval(async () => {
      if (!this.currentParams) return;
      await this.runSyncCycle(this.currentParams.token, this.currentParams.storeId, this.currentParams.userId);
    }, intervalMs);

    console.log(`⏱️ [SyncManager] Agendado para sincronizar a cada ${intervalMs / 1000} segundos.`);
    let runResult: any = undefined;
    try {
      runResult = await this.triggerSync(params);
    } catch (err) {
      console.error("❌ [SyncManager] Erro ao iniciar sync imediato:", err);
      runResult = { error: String(err) };
    }

    return { started: true, intervalMs, runResult };
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.currentParams = null;
    this.nextSyncAt = null;
    console.log("⏹️ [SyncManager] Sincronização automática interrompida.");
    return { stopped: true };
  }

  public getStatus(): SyncStatus {
    return {
      running: Boolean(this.intervalId),
      lastSyncAt: this.lastSyncAt?.toISOString(),
      nextSyncAt: this.nextSyncAt?.toISOString(),
      lastResult: undefined
    };
  }
}

export const syncManager = new SyncManager();
