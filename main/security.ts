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
 */
export async function validateMonotonicClock(): Promise<boolean> {
  try {
    // Por enquanto, as faturas estão a cair em 'offline_documents' via legacy database.ts
    // No futuro, quando migrarmos o POS para Prisma, voltamos a usar o prisma.invoice.
    const allDocs = await database.getAllDocuments('unknown'); // 'unknown' é o user_id padrão do legado
    
    if (allDocs.length === 0) return true;

    // Obtém o documento mais recente (o último do array, já que getAllDocuments ordena por data ASC)
    const lastDoc = allDocs[allDocs.length - 1];
    const lastOperationTime = new Date(lastDoc.created_at);

    const currentTime = new Date();

    if (currentTime < lastOperationTime) {
      console.error(`🚨 [ALERTA DE FRAUDE] O relógio do sistema (${currentTime.toISOString()}) está atrasado em relação à última operação registada (${lastOperationTime.toISOString()}).`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ [Security] Erro na validação do relógio:", error);
    return false;
  }
}

/**
 * 3. VALIDAÇÃO DE LICENÇA OFFLINE (Anti-Tampering)
 * Lê o JWT da base de dados local, verifica a assinatura criptográfica e garante que pertence a este PC.
 */
export async function validateOfflineLicense(): Promise<{ valid: boolean; reason?: string }> {
  try {
    // 1. Validar o Relógio (Anti-Time-Travel)
    const clockOk = await validateMonotonicClock();
    if (!clockOk) {
      return { valid: false, reason: 'Relógio do sistema inconsistente. Possível tentativa de fraude.' };
    }

    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });

    if (!settings || !settings.offlineLicense) {
      return { valid: false, reason: 'Nenhuma licença offline encontrada. É necessário fazer Login Online.' };
    }

    const currentHwid = getHardwareFingerprint();

    // 2. Validar a assinatura do JWT com jsonwebtoken (substitui o 'jose')
    const payload = jwt.verify(settings.offlineLicense, MINDGEST_SECRET) as any;

    // 3. Validar a expiração do JWT (O jwt.verify já faz isto por defeito, mas reforçamos)
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return { valid: false, reason: 'A licença offline expirou.' };
    }

    // 4. Validar Hardware ID
    if (payload.hardwareId !== currentHwid) {
      return { valid: false, reason: 'Cópia ilegal detetada. Hardware ID não corresponde à licença deste PC.' };
    }

    // 4. Validar Relógio Monotónico (Impede Time-Travel)
    const clockValid = await validateMonotonicClock();
    if (!clockValid) {
      return { valid: false, reason: 'Adulteração do relógio do sistema detetada.' };
    }

    console.log("✅ [Security] Licença Offline Válida e Assinatura Confirmada.");
    return { valid: true };

  } catch (error: any) {
    console.error("❌ [Security] Falha na validação da licença:", error.message);
    return { valid: false, reason: 'Licença corrompida ou inválida.' };
  }
}
