import { machineIdSync } from 'node-machine-id';
import os from 'os';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { SafeVault } from './storage-key';
import { database } from './database';

// Chave Simétrica do MINDGEST-API (Partilhada entre a Cloud e o Desktop)
// NOTA: No ambiente de Produção real, podes evoluir isto para um Par de Chaves RSA (Pública/Privada)
const MINDGEST_SECRET = process.env.JWT_SECRET || 'fallback_secret';

/**
 * 1. OBTENÇÃO DA IMPRESSÃO DIGITAL FÍSICA (HWID)
 * Gera um Hash SHA-256 combinando a chave de registo MachineGuid do Windows (single source via node-machine-id)
 * com o hostname do sistema operacional: SHA256(machineIdSync(true) + "::" + os.hostname()).
 * Nota: node-machine-id no Windows consulta HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Cryptography\MachineGuid.
 */
export function getHardwareFingerprint(): string {
  try {
    const rawMachineId = machineIdSync(true);
    const hostname = os.hostname();
    return crypto
      .createHash('sha256')
      .update(`${rawMachineId}::${hostname}`)
      .digest('hex');
  } catch (error) {
    console.error("❌ [Security] Erro ao obter HWID:", error);
    throw new Error("Falha de segurança de hardware.");
  }
}

/**
 * 2. PROTEÇÃO ANTI TIME-TRAVEL (Relógio Monotónico)
 * Compara a data/hora do Sistema Operativo com a data da última operação guardada no SQLite.
 * Mantém um timestamp persistente na tabela Settings para validação contínua e regista eventos no audit_log.
 */
export async function validateMonotonicClock(): Promise<{ valid: boolean; reason?: string }> {
  try {
    // 1. Obter o timestamp persistente guardado (ou nula se primeira vez)
    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
    const savedTimestamp = settings?.lastOperationTime ? new Date(settings.lastOperationTime) : null;

    // 2. Comparar com a hora atual
    const currentTime = new Date();

    // 3. Se já havia uma operação guardada e o relógio voltou para trás = FRAUDE
    if (savedTimestamp && currentTime < savedTimestamp) {
      const timeDiff = Math.round((savedTimestamp.getTime() - currentTime.getTime()) / 1000);
      console.error(`🚨 [ALERTA DE FRAUDE] Relógio do sistema voltou ${timeDiff}s para trás!`);
      console.error(`   Última operação: ${savedTimestamp.toISOString()}`);
      console.error(`   Hora atual: ${currentTime.toISOString()}`);
      
      // Registar tentativa de fraude no Audit Log com encadeamento criptográfico
      database.logAuditEvent('CLOCK_TAMPER', 'SYSTEM', {
        timeDiffSeconds: timeDiff,
        savedTimestamp: savedTimestamp.toISOString(),
        currentTime: currentTime.toISOString()
      });

      // Atualizar Settings
      await prisma.settings.upsert({
        where: { id: 'singleton' },
        update: { lastFraudAttempt: currentTime, fraudAttemptCount: (settings?.fraudAttemptCount ?? 0) + 1 },
        create: { id: 'singleton', lastFraudAttempt: currentTime, fraudAttemptCount: 1 }
      });
      
      try {
        const { BrowserWindow } = require('electron');
        BrowserWindow.getAllWindows().forEach((win: any) => {
          try {
            win.webContents.send('security:tamper-detected', 'Adulteração do relógio do sistema detectada. Time-travel não é permitido.');
          } catch (e) {
            console.warn('Falha ao notificar uma BrowserWindow sobre adulteração do relógio:', e);
          }
        });
      } catch (e) {
        console.error("Erro ao notificar webContents sobre adulteração:", e);
      }

      return { valid: false, reason: 'Adulteração do relógio do sistema detectada. Time-travel não é permitido.' };
    }

    // 4. Se passou a validação, guardar o novo timestamp
    await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: { lastOperationTime: currentTime },
      create: { id: 'singleton', lastOperationTime: currentTime }
    });

    return { valid: true };
  } catch (error) {
    console.error("❌ [Security] Erro na validação do relógio:", error);
    return { valid: false, reason: 'Erro interno na validação de segurança.' };
  }
}

export interface LicenseValidationResult {
  valid: boolean;
  graceWarning?: boolean;
  daysLeft?: number;
  reason?: string;
}

/**
 * 3. VALIDAÇÃO DE LICENÇA OFFLINE (Anti-Tampering & Grace Period)
 * Lê o JWT da base de dados local, verifica a assinatura criptográfica, valida HWID e Grace Period.
 */
export async function validateOfflineLicense(): Promise<LicenseValidationResult> {
  try {
    // 1. Validar o Relógio (Anti-Time-Travel) - PRIMEIRA VALIDAÇÃO
    const clockValidation = await validateMonotonicClock();
    if (!clockValidation.valid) {
      database.logAuditEvent('LICENSE_CHECK_FAILED', 'SYSTEM', { reason: 'CLOCK_TAMPER' });
      return { valid: false, reason: clockValidation.reason };
    }

    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });

    if (!settings || !settings.offlineLicense) {
      database.logAuditEvent('LICENSE_CHECK_FAILED', 'SYSTEM', { reason: 'NO_LICENSE' });
      return { valid: false, reason: 'Nenhuma licença offline encontrada. É necessário fazer Login Online.' };
    }

    const currentHwid = getHardwareFingerprint();

    // 2. Desencriptar a licença com SafeVault (DPAPI / HWID) e validar JWT
    const decryptedJwt = SafeVault.decrypt(settings.offlineLicense);
    const payload = jwt.verify(decryptedJwt, MINDGEST_SECRET) as any;

    const now = Date.now();
    const tokenExpMs = payload.exp ? payload.exp * 1000 : 0;
    const offlineGraceDays = typeof payload.offlineGraceDays === 'number' ? payload.offlineGraceDays : 30;
    const gracePeriodMs = offlineGraceDays * 24 * 60 * 60 * 1000;

    // 3. Validar a expiração do JWT com suporte a Grace Period
    let isExpired = false;
    let inGracePeriod = false;
    let daysLeft = 0;

    if (tokenExpMs && tokenExpMs < now) {
      isExpired = true;
      const expiryWithGrace = tokenExpMs + gracePeriodMs;
      if (now < expiryWithGrace) {
        inGracePeriod = true;
        daysLeft = Math.ceil((expiryWithGrace - now) / (24 * 60 * 60 * 1000));
      } else {
        database.logAuditEvent('LICENSE_CHECK_FAILED', 'SYSTEM', { reason: 'LICENSE_EXPIRED_PAST_GRACE', exp: payload.exp });
        return { valid: false, reason: 'A licença offline expirou e o período de carência terminou.' };
      }
    }

    // 4. Validar Hardware ID e Janela de Migração de Formato HWID
    const hwidMatches = payload.hardwareId === currentHwid;
    if (!hwidMatches) {
      // Determinar prazo de migração de HWID (universal 30 dias a partir da emissão iat se não especificado)
      let migrationDeadlineMs: number;
      if (payload.hwidMigrationDeadline) {
        migrationDeadlineMs = typeof payload.hwidMigrationDeadline === 'number'
          ? (payload.hwidMigrationDeadline < 10000000000 ? payload.hwidMigrationDeadline * 1000 : payload.hwidMigrationDeadline)
          : new Date(payload.hwidMigrationDeadline).getTime();
      } else {
        const iatMs = payload.iat ? payload.iat * 1000 : now;
        migrationDeadlineMs = iatMs + (30 * 24 * 60 * 60 * 1000);
      }

      if (now <= migrationDeadlineMs) {
        // Dentro da janela de migração -> aviso de carência sem bloquear
        console.warn(`⚠️ [Security] HWID diferente detectado dentro da janela de migração (${new Date(migrationDeadlineMs).toISOString()}).`);
        database.logAuditEvent('HWID_MIGRATION_PENDING', 'SYSTEM', {
          currentHwid,
          licenseHwid: payload.hardwareId,
          deadline: new Date(migrationDeadlineMs).toISOString()
        });

        try {
          const { BrowserWindow } = require('electron');
          BrowserWindow.getAllWindows().forEach((win: any) => {
            try {
              win.webContents.send('security:hwid-migration-pending', {
                reason: 'hwid_migration_pending',
                deadline: new Date(migrationDeadlineMs).toISOString()
              });
            } catch (e) {}
          });
        } catch (e) {}

        return {
          valid: true,
          graceWarning: true,
          reason: 'hwid_migration_pending'
        };
      } else {
        // Fora da janela de migração -> bloqueio rígido
        console.error("🚨 [Security] HWID mismatch após expiração da janela de migração.");
        database.logAuditEvent('HWID_MISMATCH_HARD', 'SYSTEM', {
          currentHwid,
          licenseHwid: payload.hardwareId,
          deadline: new Date(migrationDeadlineMs).toISOString()
        });

        try {
          const { BrowserWindow } = require('electron');
          BrowserWindow.getAllWindows().forEach((win: any) => {
            try {
              win.webContents.send('security:hwid-mismatch-hard', {
                reason: 'hwid_mismatch_hard'
              });
            } catch (e) {}
          });
        } catch (e) {}

        return { valid: false, reason: 'Cópia ilegal detectada. Hardware ID não corresponde à licença deste PC.' };
      }
    }

    // Se estiver em período de carência por expiração do token
    if (inGracePeriod) {
      console.warn(`⚠️ [Security] Licença em período de carência (${daysLeft} dias restantes).`);
      database.logAuditEvent('LICENSE_GRACE_PERIOD', 'SYSTEM', { daysLeft, exp: payload.exp });

      try {
        const { BrowserWindow } = require('electron');
        BrowserWindow.getAllWindows().forEach((win: any) => {
          try {
            win.webContents.send('security:grace-period-warning', { daysLeft, reason: 'license_expired_in_grace' });
          } catch (e) {}
        });
      } catch (e) {}

      return {
        valid: true,
        graceWarning: true,
        daysLeft,
        reason: 'license_expired_in_grace'
      };
    }

    console.log("✅ [Security] Licença Offline Válida e Assinatura Confirmada.");
    database.logAuditEvent('LICENSE_CHECK', 'SYSTEM', { status: 'VALID' });
    return { valid: true };

  } catch (error: any) {
    console.error("❌ [Security] Falha na validação da licença:", error.message);
    database.logAuditEvent('LICENSE_CHECK_FAILED', 'SYSTEM', { error: error.message });
    return { valid: false, reason: 'Licença corrompida ou inválida.' };
  }
}
