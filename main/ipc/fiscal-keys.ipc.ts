import { ipcMain } from "electron";
import { FiscalSignatureService } from "../fiscal-signature";
import { prisma } from "../prisma";
import { database } from "../database";
import { syncManager } from "../sync-manager";

type ValidatorFn = (event: Electron.IpcMainInvokeEvent) => boolean;

export function registerFiscalKeysIpcHandlers(validateIpcSender?: ValidatorFn): void {
  /**
   * Rotação de chaves RSA autorizada por PIN de Gerente / Admin
   */
  ipcMain.handle("fiscal:rotate-keys", async (event, { pinGerente, reason, actorId }: { pinGerente?: string; reason?: string; actorId?: string }) => {
    if (validateIpcSender && !validateIpcSender(event)) {
      throw new Error("Acesso IPC não autorizado.");
    }

    // Validação de autorização do gerente/administrador
    if (pinGerente) {
      const authorizedManager = await prisma.user.findFirst({
        where: {
          role: { in: ['MANAGER', 'ADMIN', 'GERENTE'] },
          password: pinGerente,
          isActive: true
        }
      });

      if (!authorizedManager) {
        database.logAuditEvent('UNAUTHORIZED_KEY_ROTATION_ATTEMPT', actorId || 'UNKNOWN', { reason });
        throw new Error("PIN de Gerente inválido ou não autorizado.");
      }
    }

    try {
      const result = await FiscalSignatureService.rotateKeys(actorId, reason);

      // Disparar heartbeat / sincronização imediata
      try {
        await syncManager.triggerImmediateHeartbeat();
      } catch (syncErr) {
        console.warn("⚠️ [FiscalKeys] Sync pós-rotação adiado (offline):", syncErr);
      }

      return {
        success: true,
        newPublicKey: result.newPublicKey,
        rotatedAt: result.rotatedAt,
        previousPublicKey: result.previousPublicKey
      };
    } catch (err: any) {
      console.error("❌ [FiscalKeys] Erro ao rodar rotação de chaves:", err);
      throw err;
    }
  });

  /**
   * Consulta histórico de chaves RSA
   */
  ipcMain.handle("fiscal:get-key-history", async (event) => {
    if (validateIpcSender && !validateIpcSender(event)) {
      throw new Error("Acesso IPC não autorizado.");
    }
    return await prisma.fiscalKeyHistory.findMany({
      orderBy: { rotatedAt: 'desc' }
    });
  });

  /**
   * Consulta a chave pública RSA ativa
   */
  ipcMain.handle("fiscal:get-public-key", async () => {
    const keys = await FiscalSignatureService.getOrInitializeKeys();
    return {
      publicKey: keys.publicKey,
      swValidationNumber: keys.swValidationNumber,
      companyNif: keys.companyNif,
      companyName: keys.companyName
    };
  });

  /**
   * Valida a assinatura de um documento
   */
  ipcMain.handle("fiscal:verify-document-signature", async (_, { hashBase, signature, signingDate }: { hashBase: string; signature: string; signingDate?: string }) => {
    const dateObj = signingDate ? new Date(signingDate) : undefined;
    return await FiscalSignatureService.verifyDocumentSignature(hashBase, signature, dateObj);
  });
}
