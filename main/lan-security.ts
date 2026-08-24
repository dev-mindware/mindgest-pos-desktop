import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { prisma } from './prisma';

export interface LanSignedPayload {
  terminalId: string;
  timestamp: string;
  idempotencyKey: string;
  signature: string;
  data: any;
}

export class LanSecurity {
  /**
   * Gera a assinatura HMAC-SHA256 para um payload
   */
  static generateSignature(payloadString: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payloadString).digest('hex');
  }

  /**
   * Middleware Express para validação HMAC e Anti-Replay nos endpoints de sincronização LAN
   */
  static async authenticateLanSync(req: Request, res: Response, next: NextFunction) {
    try {
      const terminalId = req.headers['x-terminal-id'] as string;
      const timestamp = req.headers['x-timestamp'] as string;
      const idempotencyKey = req.headers['x-idempotency-key'] as string;
      const clientSignature = req.headers['x-signature'] as string;

      // 1. Validar presença dos cabeçalhos obrigatórios
      if (!timestamp || !clientSignature || !idempotencyKey) {
        return res.status(401).json({
          error: 'Cabeçalhos de autenticação LAN em falta (x-timestamp, x-signature, x-idempotency-key).'
        });
      }

      // 2. Validação Anti-Replay (máximo 5 minutos de drift)
      const requestTime = new Date(timestamp).getTime();
      const now = Date.now();
      const DRIFT_LIMIT_MS = 5 * 60 * 1000;

      if (isNaN(requestTime) || Math.abs(now - requestTime) > DRIFT_LIMIT_MS) {
        return res.status(401).json({
          error: 'Timestamp inválido ou requisição expirada (Proteção Anti-Replay).'
        });
      }

      // 3. Obter o segredo LAN do Master
      const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
      const lanSecret = settings?.lanSecret || 'mindgest-lan-default-key';

      // 4. Validar Assinatura HMAC-SHA256
      const payloadString = `${JSON.stringify(req.body)}:${timestamp}:${idempotencyKey}`;
      const expectedSignature = LanSecurity.generateSignature(payloadString, lanSecret);

      const isValid = crypto.timingSafeEqual(
        Buffer.from(clientSignature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );

      if (!isValid) {
        return res.status(401).json({ error: 'Assinatura criptográfica LAN inválida.' });
      }

      next();
    } catch (err: any) {
      console.error('❌ [LanSecurity] Erro na autenticação HMAC:', err?.message || err);
      return res.status(500).json({ error: 'Falha na validação de segurança LAN.' });
    }
  }
}
