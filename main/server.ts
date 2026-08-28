import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import os from 'os';
import { prisma } from './prisma';
import { FiscalSignatureService } from './fiscal-signature';
import { FiscalInvoicingService } from './fiscal-invoicing-service';

const app = express();
const PORT = Number(process.env.LOCAL_API_PORT) || 3333; // Dedicated port for Local Master Server

// ==========================================
// In-Memory Telemetry & Dual-Key Grace Period
// ==========================================
export interface ConnectedTerminal {
  id: string;
  name: string;
  ip: string;
  lastSeen: Date;
  status: 'ACTIVE' | 'IDLE' | 'DISCONNECTED';
  latencyMs?: number;
  totalSales: number;
  appVersion?: string;
}

const connectedTerminals = new Map<string, ConnectedTerminal>();

// Rotação de Chave com Período de Graça (15 minutos)
let activeLanSecret: string | null = null;
let previousLanSecret: string | null = null;
let previousLanSecretExpiresAt: number = 0;

export function setRotatedSecret(newSecret: string) {
  previousLanSecret = activeLanSecret;
  previousLanSecretExpiresAt = Date.now() + (15 * 60 * 1000); // 15 min grace period
  activeLanSecret = newSecret;
}

// Cleanup inactive terminals every 10 seconds (100% in-memory, ZERO disk/SQLite I/O)
setInterval(() => {
  const now = Date.now();
  for (const [id, terminal] of connectedTerminals.entries()) {
    const elapsed = now - new Date(terminal.lastSeen).getTime();
    if (elapsed > 60_000) {
      terminal.status = 'DISCONNECTED';
    } else if (elapsed > 15_000) {
      terminal.status = 'IDLE';
    } else {
      terminal.status = 'ACTIVE';
    }
  }
}, 10_000);

export function getConnectedTerminalsList(): ConnectedTerminal[] {
  return Array.from(connectedTerminals.values());
}

export function revokeConnectedTerminal(terminalId: string): boolean {
  return connectedTerminals.delete(terminalId);
}

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ==========================================
// Middleware de Autenticação LAN com Período de Graça
// ==========================================
async function lanAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (!activeLanSecret) {
      const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
      activeLanSecret = settings?.lanSecret || null;
    }

    if (!activeLanSecret) {
      return next();
    }

    const clientSecret = req.headers['x-lan-secret'];

    // 1. Chave principal ativa
    if (clientSecret === activeLanSecret) {
      return next();
    }

    // 2. Período de graça para chave anterior (máx 15 min após rotação)
    if (previousLanSecret && clientSecret === previousLanSecret && Date.now() < previousLanSecretExpiresAt) {
      res.setHeader('x-lan-key-rotated', 'true');
      return next();
    }

    return res.status(401).json({
      error: 'Acesso Não Autorizado. Código de Segurança LAN inválido ou expirado.',
      code: 'ERR_LAN_SECRET_INVALID'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao validar autenticação LAN.' });
  }
}

// ==========================================
// Gestão de Códigos de Emparelhamento Temporários (TTL 5 min)
// ==========================================
interface PairingCode {
  code: string;
  expiresAt: number;
}
let currentPairingCode: PairingCode | null = null;

export function generatePairingCode(): { code: string; expiresAt: number } {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  currentPairingCode = {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
  return currentPairingCode;
}

export function getCurrentPairingCode() {
  if (currentPairingCode && Date.now() < currentPairingCode.expiresAt) {
    return currentPairingCode;
  }
  currentPairingCode = null;
  return null;
}

// ==========================================
// Rotas Públicas e Diagnóstico Seguro
// ==========================================
// Healthcheck anônimo e sem vazamento de topologia
app.get('/api/health', (req, res) => {
  const clientSecret = req.headers['x-lan-secret'];
  const isAuth = clientSecret && (clientSecret === activeLanSecret || clientSecret === previousLanSecret);

  if (isAuth) {
    return res.json({
      status: 'online',
      hostname: os.hostname(),
      port: PORT,
      timestamp: new Date().toISOString(),
      serverTime: new Date().toISOString(),
      connectedCount: connectedTerminals.size,
    });
  }

  // Resposta pública mínima (sem fingerprinting ou contagem de terminais)
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    serverTime: new Date().toISOString(),
  });
});

// Endpoint de Sincronização de Relógio Relativo (Anti-Replay)
app.get('/api/lan/time', (req, res) => {
  res.json({
    serverTime: new Date().toISOString(),
    timestamp: Date.now(),
  });
});

// Endpoint de Emparelhamento Inicial por Código Curto
app.post('/api/lan/pair', async (req, res) => {
  try {
    const { code, terminalId, terminalName } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Código de emparelhamento obrigatório.' });
    }

    const activeCode = getCurrentPairingCode();
    if (!activeCode || activeCode.code !== String(code).trim()) {
      return res.status(401).json({ error: 'Código de emparelhamento inválido ou expirado. Gere um novo código no Master.' });
    }

    if (!activeLanSecret) {
      const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
      activeLanSecret = settings?.lanSecret || null;
      if (!activeLanSecret) {
        activeLanSecret = crypto.randomBytes(16).toString('hex').toUpperCase();
        await prisma.settings.upsert({
          where: { id: 'singleton' },
          update: { lanSecret: activeLanSecret },
          create: { id: 'singleton', lanSecret: activeLanSecret, terminalMode: 'MASTER' }
        });
      }
    }

    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });

    res.json({
      success: true,
      lanSecret: activeLanSecret,
      serverTime: new Date().toISOString(),
      companyNif: settings?.companyNif,
      companyName: settings?.companyName,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro ao processar emparelhamento.' });
  }
});

// Heartbeat Seguro (Exige autenticação LAN para evitar poluição de telemetria)
app.post('/api/lan/heartbeat', lanAuthMiddleware, async (req, res) => {
  try {
    const { terminalId, terminalName, appVersion, clientTime } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const cleanIp = clientIp.replace('::ffff:', '');

    if (!terminalId) {
      return res.status(400).json({ error: 'terminalId obrigatório.' });
    }

    const now = Date.now();
    const latencyMs = clientTime ? Math.max(0, Math.round(now - new Date(clientTime).getTime())) : undefined;

    const existing = connectedTerminals.get(terminalId);
    connectedTerminals.set(terminalId, {
      id: terminalId,
      name: terminalName || existing?.name || `Terminal-${cleanIp}`,
      ip: cleanIp,
      lastSeen: new Date(),
      status: 'ACTIVE',
      latencyMs: latencyMs || existing?.latencyMs || 2,
      totalSales: existing?.totalSales || 0,
      appVersion: appVersion || existing?.appVersion || '1.0.0',
    });

    res.json({
      status: 'OK',
      serverTime: new Date().toISOString(),
      timestamp: Date.now(),
      activeTerminalsCount: connectedTerminals.size,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro no heartbeat LAN.' });
  }
});

// ==========================================
// Rotas Transacionais Protegidas
// ==========================================
const apiRouter = express.Router();
apiRouter.use(lanAuthMiddleware);

// Lista de terminais conectados (para a UI do Master)
apiRouter.get('/lan/terminals', (req, res) => {
  res.json({
    terminals: getConnectedTerminalsList(),
    masterIp: os.networkInterfaces(),
    serverTime: new Date().toISOString(),
  });
});

// Gerar novo código de emparelhamento temporário
apiRouter.get('/lan/pairing-code', (req, res) => {
  const pairing = generatePairingCode();
  res.json({
    code: pairing.code,
    expiresAt: new Date(pairing.expiresAt).toISOString(),
    ttlSeconds: Math.round((pairing.expiresAt - Date.now()) / 1000),
  });
});

// Revogar um terminal escravo
apiRouter.post('/lan/revoke-terminal', (req, res) => {
  const { terminalId } = req.body;
  if (!terminalId) return res.status(400).json({ error: 'terminalId obrigatório.' });
  revokeConnectedTerminal(terminalId);
  res.json({ success: true, message: `Terminal ${terminalId} revogado com sucesso.` });
});

// 1. Obter Itens / Catálogo com Stock Atualizado
apiRouter.get('/items', async (req, res) => {
  try {
    const { storeId, search, categoryId } = req.query;
    const where: any = { isActive: true };
    if (storeId) where.storeId = String(storeId);
    if (categoryId) where.categoryId = String(categoryId);
    if (search) {
      const s = String(search);
      where.OR = [
        { name: { contains: s } },
        { code: { contains: s } },
        { barcode: { contains: s } },
      ];
    }
    const items = await prisma.item.findMany({ where, orderBy: { name: 'asc' } });
    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar produtos locais.' });
  }
});

// 2. Obter Clientes
apiRouter.get('/clients', async (req, res) => {
  try {
    const { storeId, search } = req.query;
    const where: any = {};
    if (storeId) where.storeId = String(storeId);
    if (search) {
      const s = String(search);
      where.OR = [
        { name: { contains: s } },
        { nif: { contains: s } },
        { phone: { contains: s } },
      ];
    }
    const clients = await prisma.client.findMany({ where, orderBy: { name: 'asc' } });
    res.json({ clients });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar clientes locais.' });
  }
});

// 3. Obter Séries Fiscais Ativas no Master
apiRouter.get('/series', async (req, res) => {
  try {
    const { storeId, documentType } = req.query;
    const where: any = { isActive: true };
    if (storeId) where.storeId = String(storeId);
    if (documentType) where.documentType = String(documentType);

    const series = await prisma.agtSeries.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ series });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar séries no Master.' });
  }
});

// 4. Criação de Fatura Atómica Serializada (Delegada ao FiscalInvoicingService)
apiRouter.post('/invoice/create', async (req, res) => {
  try {
    const { invoiceData, storeId, userId, terminalId, terminalName } = req.body;
    const idempotencyKey = invoiceData?.idempotencyKey || (req.headers['x-idempotency-key'] as string);

    const invoiceResponse = await FiscalInvoicingService.processInvoice({
      invoiceData,
      storeId,
      userId,
      terminalId,
      terminalName,
      idempotencyKey,
    });

    if (terminalId && connectedTerminals.has(terminalId) && !invoiceResponse.idempotentReplay) {
      const t = connectedTerminals.get(terminalId)!;
      t.totalSales += 1;
    }

    res.json({ success: true, data: invoiceResponse });
  } catch (err: any) {
    console.error('❌ [Local Server /invoice/create] Erro na emissão:', err?.message || err);
    res.status(400).json({ error: err?.message || 'Erro ao emitir fatura no Master.' });
  }
});

apiRouter.post('/invoice/normal', (req, res, next) => {
  req.body.invoiceData = { ...req.body.invoiceData, documentType: 'FT' };
  next();
});

apiRouter.post('/invoice/invoice-receipt', (req, res, next) => {
  req.body.invoiceData = { ...req.body.invoiceData, documentType: 'FR' };
  next();
});

app.use('/api', apiRouter);

// ==========================================
// Inicialização e Ciclo de Vida do Servidor Local
// ==========================================
let serverInstance: any = null;
let isServerRunning = false;
let serverError: string | null = null;

export function getLocalServerStatus() {
  return {
    isRunning: isServerRunning,
    port: PORT,
    connectedCount: connectedTerminals.size,
    error: serverError,
  };
}

export async function stopLocalServer(): Promise<void> {
  const { stopMdnsPublisher, stopBroadcastServer } = await import("./lan-discovery");
  stopMdnsPublisher();
  stopBroadcastServer();

  return new Promise((resolve) => {
    if (serverInstance) {
      serverInstance.close(() => {
        isServerRunning = false;
        serverInstance = null;
        serverError = null;
        console.log('🛑 [Local Server] Servidor local encerrado com sucesso.');
        resolve();
      });
    } else {
      isServerRunning = false;
      resolve();
    }
  });
}

export function startLocalServer() {
  return new Promise(async (resolve, reject) => {
    if (isServerRunning && serverInstance) {
      console.log(`ℹ️ [Local Server] Servidor já se encontra ativo na porta ${PORT}.`);
      return resolve(serverInstance);
    }

    try {
      try {
        await prisma.$executeRawUnsafe(`PRAGMA journal_mode = WAL;`);
        await prisma.$executeRawUnsafe(`PRAGMA busy_timeout = 5000;`);
        await prisma.$executeRawUnsafe(`PRAGMA synchronous = NORMAL;`);
        console.log('⚡ [Local Server SQLite] Modo WAL, busy_timeout=5000 e synchronous=NORMAL ativados.');
      } catch (dbErr) {
        console.warn('⚠️ Falha ao definir PRAGMA WAL no SQLite:', dbErr);
      }

      const server = app.listen(PORT, '0.0.0.0', async () => {
        isServerRunning = true;
        serverInstance = server;
        serverError = null;
        console.log(`🚀 [Local Server] API REST Embutida a rodar em: http://0.0.0.0:${PORT}`);

        // Iniciar anúncios de auto-descoberta mDNS e Broadcast UDP
        try {
          const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
          const { startMdnsPublisher, startBroadcastServer } = await import("./lan-discovery");
          await startMdnsPublisher({
            port: PORT,
            storeName: settings?.companyName || "Loja Principal",
          });
          startBroadcastServer({
            port: PORT,
            storeName: settings?.companyName || "Loja Principal",
          });
        } catch (discErr) {
          console.warn("⚠️ [Local Server] Falha ao iniciar auto-descoberta mDNS/Broadcast:", discErr);
        }

        resolve(server);
      });

      server.on('error', (err: any) => {
        isServerRunning = false;
        serverError = err?.message || 'Erro no servidor local.';
        if (err.code === 'EADDRINUSE') {
          console.error(`❌ [Local Server] A porta ${PORT} já está em uso!`);
          serverError = `A porta ${PORT} já está ocupada por outra aplicação.`;
        }
        reject(err);
      });
    } catch (err: any) {
      isServerRunning = false;
      serverError = err?.message || 'Erro ao inicializar servidor local.';
      reject(err);
    }
  });
}
