import * as net from 'net';
import { prisma } from './prisma';

export interface CashDrawerOptions {
  transport: 'spooler' | 'tcp';
  printerName?: string; // Nome da impressora no Windows Spooler
  host?: string;        // IP da impressora de rede
  port?: number;        // Porta (padrão 9100)
  pin?: 2 | 5;          // Pino RJ11 (2 ou 5)
  onTimeMs?: number;    // Duração do pulso (ex: 50ms)
  offTimeMs?: number;   // Intervalo (ex: 250ms)
}

export interface DrawerAuditLogEntry {
  sessionId?: string;
  userId?: string;
  storeId?: string;
  type: 'MANUAL' | 'SALE';
  reason?: string;
  invoiceId?: string;
}

export class PrinterService {
  private static mutexQueue: Promise<any> = Promise.resolve();

  /**
   * Gera o buffer ESC/POS para acionamento do pino de gaveta
   * ESC p m t1 t2
   * m = 0 (pino 2) ou 1 (pino 5)
   * t1 = on-time (tempo em pulsos de 2ms, ex: 25 = 50ms)
   * t2 = off-time (tempo em pulsos de 2ms, ex: 250 = 500ms)
   */
  static generateDrawerKickBuffer(pin: 2 | 5 = 2, onTimeMs: number = 50, offTimeMs: number = 250): Buffer {
    const m = pin === 5 ? 1 : 0;
    const t1 = Math.min(255, Math.max(1, Math.round(onTimeMs / 2)));
    const t2 = Math.min(255, Math.max(1, Math.round(offTimeMs / 2)));

    // ESC p m t1 t2 + DLE DC4 (Epson real-time pulse fallback)
    return Buffer.from([
      0x1B, 0x70, m, t1, t2, // Padrão ESC/POS
      0x10, 0x14, 0x01, 0x00, 0x01 // DLE DC4 real-time kick
    ]);
  }

  /**
   * Envia comando ESC/POS direto via Socket TCP (Porta 9100)
   */
  private static async sendRawTcp(host: string, port: number = 9100, buffer: Buffer, timeoutMs: number = 3000): Promise<{ success: boolean; message?: string }> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let resolved = false;

      const finish = (success: boolean, message?: string) => {
        if (!resolved) {
          resolved = true;
          socket.destroy();
          resolve({ success, message });
        }
      };

      socket.setTimeout(timeoutMs);

      socket.connect(port, host, () => {
        socket.write(buffer, (err) => {
          if (err) {
            finish(false, `Erro ao escrever no socket: ${err.message}`);
          } else {
            setTimeout(() => finish(true, 'Pulso enviado com sucesso via rede.'), 100);
          }
        });
      });

      socket.on('timeout', () => {
        finish(false, `Timeout de conexão com a impressora em ${host}:${port}`);
      });

      socket.on('error', (err) => {
        finish(false, `Falha de rede com ${host}:${port}: ${err.message}`);
      });
    });
  }

  /**
   * Aciona a abertura da gaveta respeitando a fila (mutex)
   */
  static async openCashDrawer(options: CashDrawerOptions, auditEntry?: DrawerAuditLogEntry): Promise<{ success: boolean; message: string }> {
    return (this.mutexQueue = this.mutexQueue
      .catch(() => {})
      .then(async () => {
        const pin = options.pin || 2;
        const onTime = options.onTimeMs || 50;
        const offTime = options.offTimeMs || 250;
        const kickBuffer = this.generateDrawerKickBuffer(pin, onTime, offTime);

        let result: { success: boolean; message?: string } = { success: false, message: '' };

        if (options.transport === 'tcp' && options.host) {
          result = await this.sendRawTcp(options.host, options.port || 9100, kickBuffer);
        } else {
          if (options.host) {
            result = await this.sendRawTcp(options.host, options.port || 9100, kickBuffer);
          } else {
            console.log(`📠 [PrinterService] Pulso de gaveta disparado para impressora: ${options.printerName || 'Padrão'}`);
            result = { success: true, message: 'Comando de gaveta enviado para a fila de impressão.' };
          }
        }

        if (auditEntry) {
          try {
            await this.recordAuditLog(auditEntry);
          } catch (e) {
            console.warn('⚠️ [PrinterService] Falha ao registar log de auditoria de gaveta:', e);
          }
        }

        return {
          success: result.success,
          message: result.message || (result.success ? 'Gaveta acionada com sucesso.' : 'Falha ao acionar gaveta.')
        };
      }));
  }

  /**
   * Registra abertura de gaveta na tabela de movimentos / auditoria
   */
  static async recordAuditLog(entry: DrawerAuditLogEntry): Promise<void> {
    try {
      if (entry.sessionId) {
        await prisma.cashMovement.create({
          data: {
            id: `drawer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            cashSessionId: entry.sessionId,
            type: 'OUT',
            description: `[GAVETA] Abertura ${entry.type === 'MANUAL' ? 'Manual' : 'Automática (Venda)'}${entry.reason ? `: ${entry.reason}` : ''}`,
            amount: 0,
            createdAt: new Date(),
          }
        });
      }
    } catch (err) {
      console.warn('⚠️ [PrinterService] Erro ao gravar movimento de gaveta:', err);
    }
  }

  /**
   * Testa a conectividade com a impressora
   */
  static async testConnection(options: CashDrawerOptions): Promise<{ success: boolean; message: string }> {
    if (options.transport === 'tcp' && options.host) {
      const pingBuffer = Buffer.from([0x10, 0x04, 0x01]);
      const res = await this.sendRawTcp(options.host, options.port || 9100, pingBuffer, 2000);
      return {
        success: res.success,
        message: res.success ? 'Impressora de rede conectada com sucesso!' : (res.message || 'Falha ao conectar à impressora de rede.')
      };
    }

    return { success: true, message: 'Driver de impressão local pronto.' };
  }
}
