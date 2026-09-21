import { ipcMain, app } from "electron";
import path from "path";
import fs from "fs";
import { prisma } from "../prisma";
import { database } from "../database";
import { SafeVault } from "../storage-key";
import { getHardwareFingerprint } from "../security";

type ValidatorFn = (event: Electron.IpcMainInvokeEvent) => boolean;

export function registerBackupIpcHandlers(validateIpcSender?: ValidatorFn): void {
  ipcMain.handle("backup:export-manual", async (event, { pinGerente, destPath, actorId }: { pinGerente?: string; destPath?: string; actorId?: string }) => {
    if (validateIpcSender && !validateIpcSender(event)) {
      throw new Error("Acesso IPC não autorizado.");
    }

    // 1. Validar autorização do gerente
    if (pinGerente) {
      const authorizedManager = await prisma.user.findFirst({
        where: {
          role: { in: ['MANAGER', 'ADMIN', 'GERENTE'] },
          password: pinGerente,
          isActive: true
        }
      });

      if (!authorizedManager) {
        database.logAuditEvent('UNAUTHORIZED_BACKUP_EXPORT_ATTEMPT', actorId || 'UNKNOWN', {});
        throw new Error("PIN de Gerente inválido ou não autorizado.");
      }
    }

    try {
      console.log(`📦 [Backup] Preparando exportação manual de segurança solicitada por ${actorId || 'SYSTEM'}...`);

      const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
      const fiscalKeyHistory = await prisma.fiscalKeyHistory.findMany({
        orderBy: { rotatedAt: 'desc' }
      });
      const auditChain = database.verifyAuditChain();
      const auditLogs = database.getAuditLogs(1000);
      const offlineDocuments = database.getAllDocuments('unknown');

      // Sanitizar settings: NUNCA exportar a chave privada
      const safeSettings = {
        companyName: settings?.companyName,
        companyNif: settings?.companyNif,
        softwareValidationNumber: settings?.softwareValidationNumber,
        publicKey: settings?.publicKey,
        lastSync: settings?.lastSync,
        lastOperationTime: settings?.lastOperationTime,
        terminalMode: settings?.terminalMode,
        hardwareId: getHardwareFingerprint()
      };

      const backupBundle = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        actorId: actorId || "SYSTEM",
        settings: safeSettings,
        fiscalKeyHistory,
        auditChain,
        auditLogs,
        offlineDocuments
      };

      const bundleJson = JSON.stringify(backupBundle, null, 2);
      const encryptedBundle = SafeVault.encrypt(bundleJson);

      const targetPath = destPath || path.join(
        app.getPath("documents") || app.getPath("userData"),
        `mindgest-pos-backup-${Date.now()}.enc`
      );

      await fs.promises.writeFile(targetPath, encryptedBundle, "utf8");

      // Registar evento no audit log
      database.logAuditEvent('MANUAL_EXPORT', actorId || 'SYSTEM', {
        destPath: targetPath,
        offlineDocsCount: offlineDocuments.length,
        auditLogsCount: auditLogs.length
      });

      console.log(`✅ [Backup] Exportação manual concluída com sucesso em ${targetPath}.`);

      return {
        success: true,
        destPath: targetPath,
        exportedAt: backupBundle.exportedAt,
        offlineDocsCount: offlineDocuments.length
      };
    } catch (err: any) {
      console.error("❌ [Backup] Falha na exportação manual:", err);
      database.logAuditEvent('MANUAL_EXPORT_FAILED', actorId || 'SYSTEM', { error: err?.message || String(err) });
      throw err;
    }
  });
}
