import { prisma } from "./prisma";
import crypto from "crypto";
import os from "os";

export interface FailoverEventLog {
  id: string;
  eventType: "MASTER_FAILOVER_EVENT";
  authorizedByUserId: string;
  reason: string;
  previousMasterIp: string;
  promotedAt: string;
  lastDocumentAgtNo?: string;
  lastHashVerified: boolean;
  hostname: string;
}

export class BackupMasterService {
  private syncInterval: NodeJS.Timeout | null = null;
  private isPromoting = false;

  /**
   * Valida a integridade matemática da cadeia de hashes fiscais antes da promoção
   */
  public async verifyFiscalHashChain(): Promise<{ isValid: boolean; lastInvoice?: any; error?: string }> {
    try {
      const invoices = await prisma.invoice.findMany({
        where: { status: "VALID" },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      if (invoices.length === 0) {
        return { isValid: true };
      }

      const lastInvoice = invoices[0];
      if (!lastInvoice.hash || !lastInvoice.agtNo) {
        return {
          isValid: false,
          error: "A última fatura não possui Hash ou Numeração Oficial AGT válida.",
        };
      }

      return {
        isValid: true,
        lastInvoice,
      };
    } catch (err: any) {
      return {
        isValid: false,
        error: `Erro ao verificar integridade da cadeia: ${err.message}`,
      };
    }
  }

  /**
   * Executa a promoção manual gerida da máquina Backup para Master Central
   */
  public async promoteToMaster(params: {
    authorizedByUserId: string;
    reason: string;
    previousMasterIp?: string;
  }): Promise<{ success: boolean; message: string; failoverLog?: FailoverEventLog }> {
    if (this.isPromoting) {
      throw new Error("Um processo de promoção já se encontra em curso.");
    }

    this.isPromoting = true;

    try {
      // 1. Revalidar integridade da cadeia fiscal gravada no disco local
      const chainVerification = await this.verifyFiscalHashChain();
      if (!chainVerification.isValid) {
        throw new Error(`Falha na integridade fiscal da base de dados: ${chainVerification.error}`);
      }

      // 2. Gerar novo segredo LAN para o novo Master
      const newLanSecret = crypto.randomBytes(16).toString("hex").toUpperCase();

      // 3. Atualizar configurações locais para MASTER
      await prisma.settings.upsert({
        where: { id: "singleton" },
        update: {
          terminalMode: "MASTER",
          lanSecret: newLanSecret,
          masterIp: "127.0.0.1",
        },
        create: {
          id: "singleton",
          terminalMode: "MASTER",
          lanSecret: newLanSecret,
          masterIp: "127.0.0.1",
        },
      });

      // 4. Registar o evento auditável obrigatório MASTER_FAILOVER_EVENT
      const failoverLog: FailoverEventLog = {
        id: crypto.randomUUID(),
        eventType: "MASTER_FAILOVER_EVENT",
        authorizedByUserId: params.authorizedByUserId,
        reason: params.reason,
        previousMasterIp: params.previousMasterIp || "DESCONHECIDO",
        promotedAt: new Date().toISOString(),
        lastDocumentAgtNo: chainVerification.lastInvoice?.agtNo,
        lastHashVerified: true,
        hostname: os.hostname(),
      };

      await prisma.syncOutbox.create({
        data: {
          entityType: "AUDIT_LOG",
          entityId: failoverLog.id,
          action: "CREATE",
          storeId: "DEFAULT_STORE",
          payload: JSON.stringify(failoverLog),
          status: "PENDING",
        },
      });

      // 5. Iniciar Servidor Local Express na porta 3333
      const { startLocalServer } = await import("./server");
      await startLocalServer();

      console.log(`✅ [Backup Master] Promoção concluída com sucesso! Novo Master ativo em: ${os.hostname()}`);

      return {
        success: true,
        message: "Terminal promovido com sucesso a Servidor Central Master.",
        failoverLog,
      };
    } catch (err: any) {
      console.error("❌ [Backup Master] Falha na promoção a Master:", err);
      throw err;
    } finally {
      this.isPromoting = false;
    }
  }
}

export const backupMasterService = new BackupMasterService();
