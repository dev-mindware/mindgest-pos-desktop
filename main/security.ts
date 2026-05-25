import { machineIdSync } from 'node-machine-id';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

// Chave Simétrica do MINDGEST-API (Partilhada entre a Cloud e o Desktop)
// NOTA: No ambiente de Produção real, podes evoluir isto para um Par de Chaves RSA (Pública/Privada)
const MINDGEST_SECRET = process.env.JWT_SECRET || 'fallback_secret';

/**
 * 1. OBTENÇÃO DA IMPRESSÃO DIGITAL FÍSICA (HWID)
 * Gera um Hash SHA-256 único e invariável baseado no UUID do Hardware.
 */
export function getHardwareFingerprint(): string {
  try {
    return machineIdSync(true); 
  } catch (error) {
    console.error("❌ [Security] Erro ao obter HWID:", error);
    throw new Error("Falha de segurança de hardware.");
  }
}

import { database } from './database';

/**
 * 2. PROTEÇÃO ANTI TIME-TRAVEL (Relógio Monotónico)
 * Compara a data/hora do Sistema Operativo com a data da última operação guardada no SQLite.
 * Mantém um timestamp persistente na tabela Settings para validação contínua.
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
      
      // Registar tentativa de fraude na Settings (para auditoria)
      await prisma.settings.upsert({
        where: { id: 'singleton' },
        update: { lastFraudAttempt: currentTime, fraudAttemptCount: (settings?.fraudAttemptCount ?? 0) + 1 },
        create: { id: 'singleton', lastFraudAttempt: currentTime, fraudAttemptCount: 1 }
      });
      
      return { valid: false, reason: 'Adulteração do relógio do sistema detetada. Time-travel não é permitido.' };
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

/**
 * 3. VALIDAÇÃO DE LICENÇA OFFLINE (Anti-Tampering)
 * Lê o JWT da base de dados local, verifica a assinatura criptográfica e garante que pertence a este PC.
 */
export async function validateOfflineLicense(): Promise<{ valid: boolean; reason?: string }> {
  try {
    // 1. Validar o Relógio (Anti-Time-Travel) - PRIMEIRA VALIDAÇÃO
    const clockValidation = await validateMonotonicClock();
    if (!clockValidation.valid) {
      return { valid: false, reason: clockValidation.reason };
    }

    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });

    if (!settings || !settings.offlineLicense) {
      return { valid: false, reason: 'Nenhuma licença offline encontrada. É necessário fazer Login Online.' };
    }

    const currentHwid = getHardwareFingerprint();

    // 2. Validar a assinatura do JWT com jsonwebtoken
    const payload = jwt.verify(settings.offlineLicense, MINDGEST_SECRET) as any;

    // 3. Validar a expiração do JWT
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return { valid: false, reason: 'A licença offline expirou.' };
    }

    // 4. Validar Hardware ID
    if (payload.hardwareId !== currentHwid) {
      return { valid: false, reason: 'Cópia ilegal detetada. Hardware ID não corresponde à licença deste PC.' };
    }

    console.log("✅ [Security] Licença Offline Válida e Assinatura Confirmada.");
    return { valid: true };

  } catch (error: any) {
    console.error("❌ [Security] Falha na validação da licença:", error.message);
    return { valid: false, reason: 'Licença corrompida ou inválida.' };
  }
}
