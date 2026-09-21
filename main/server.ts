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

// Telemetria em tempo real para rede cabeada e Wi-Fi (varredura a cada 2s, 100% in-memory)
setInterval(() => {
  const now = Date.now();
  for (const [id, terminal] of connectedTerminals.entries()) {
    const elapsed = now - new Date(terminal.lastSeen).getTime();
    if (elapsed > 20_000) {
      terminal.status = 'DISCONNECTED';
    } else if (elapsed > 10_000) {
      terminal.status = 'IDLE';
    } else {
      terminal.status = 'ACTIVE';
    }
  }
}, 2_000);

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

// Endpoint de Status e Descoberta Direta de Master
app.get(['/api/lan/status', '/api/status'], async (req, res) => {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } }).catch(() => null);
    res.json({
      status: 'online',
      hostname: os.hostname(),
      storeName: settings?.companyName || 'Mindgest POS',
      storeId: settings?.storeId || '',
      protocolVersion: '2.0',
      port: PORT,
      timestamp: Date.now(),
      serverTime: new Date().toISOString(),
      connectedCount: connectedTerminals.size,
    });
  } catch {
    res.json({
      status: 'online',
      hostname: os.hostname(),
      storeName: 'Mindgest POS',
      protocolVersion: '2.0',
      port: PORT,
      timestamp: Date.now(),
      serverTime: new Date().toISOString(),
      connectedCount: connectedTerminals.size,
    });
  }
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
    const mappedItems = items.map((item) => ({
      ...item,
      id: item.cloudId || item.id, // Compatibilidade com checkout
      localId: item.id,
      quantity: item.stock,
      sku: item.code,
      tax: { rate: (item.taxPercent || 14) / 100 },
      taxRate: (item.taxPercent || 14) / 100,
    }));
    res.json({ data: mappedItems, items: mappedItems, totalPages: 1, total: mappedItems.length });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar produtos locais.' });
  }
});

// 2. Obter Categorias de Produtos (apenas categorias que tenham produtos ativos - suporta categorias mistas)
apiRouter.get('/categories', async (req, res) => {
  try {
    const { storeId } = req.query;
    const where: any = {
      isActive: true,
      items: {
        some: {
          isActive: true,
        },
      },
    };
    if (storeId) where.storeId = String(storeId);
    const categories = await prisma.category.findMany({ where, orderBy: { name: 'asc' } });
    const mapped = categories.map((c) => ({
      ...c,
      id: c.cloudId || c.id,
      localId: c.id,
    }));
    res.json({ data: mapped, categories: mapped, totalPages: 1, total: mapped.length });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar categorias locais.' });
  }
});

// 3. Obter Sessão de Caixa Atual
apiRouter.get('/cash-sessions/current', async (req, res) => {
  try {
    const { storeId } = req.query;
    const where: any = { closingDate: null };
    if (storeId) where.storeId = String(storeId);
    const session = await prisma.cashSession.findFirst({
      where,
      orderBy: { openingDate: 'desc' },
    });

    if (!session) {
      const defaultSession = {
        id: 'LOCAL_DEFAULT_SESSION',
        isOpen: true,
        openingDate: new Date().toISOString(),
        openingBalance: 0,
      };
      return res.json({
        ...defaultSession,
        data: defaultSession,
      });
    }

    const sessionPayload = {
      ...session,
      id: session.cloudId || session.id,
      localId: session.id,
      isOpen: true,
    };

    res.json({
      ...sessionPayload,
      data: sessionPayload,
    });
  } catch (err: any) {
    const defaultSession = {
      id: 'LOCAL_DEFAULT_SESSION',
      isOpen: true,
      openingDate: new Date().toISOString(),
      openingBalance: 0,
    };
    res.json({
      ...defaultSession,
      data: defaultSession,
    });
  }
});

// 4. Obter Clientes
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
    const mapped = clients.map((c) => ({
      ...c,
      id: c.cloudId || c.id,
      localId: c.id,
    }));
    res.json({ data: mapped, clients: mapped, totalPages: 1, total: mapped.length });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar clientes locais.' });
  }
});

// 5. Obter Séries Fiscais Ativas no Master
apiRouter.get('/series', async (req, res) => {
  try {
    const { storeId, documentType } = req.query;
    const where: any = { isActive: true };
    if (storeId) where.storeId = String(storeId);
    if (documentType) where.documentType = String(documentType);

    const series = await prisma.agtSeries.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ data: series, series });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar séries no Master.' });
  }
});

// Helper para mapear fatura local do SQLite para o contrato esperado pelo frontend
function mapLocalInvoiceToResponse(inv: any, outboxStatusMap: Map<string, string>) {
  const syncStatus = outboxStatusMap.get(inv.id) || (inv.agtNo ? 'SYNCED' : 'PENDING');
  return {
    id: inv.id,
    number: inv.agtNo || inv.localNo,
    localNo: inv.localNo,
    agtNo: inv.agtNo,
    type: inv.agtNo?.startsWith('FT') ? 'INVOICE' : inv.agtNo?.startsWith('PP') ? 'PROFORMA' : 'INVOICE_RECEIPT',
    status: inv.status === 'VALID' ? 'PAID' : inv.status,
    syncStatus,
    issueDate: inv.issueDate instanceof Date ? inv.issueDate.toISOString() : inv.issueDate,
    createdAt: inv.createdAt instanceof Date ? inv.createdAt.toISOString() : (inv.systemEntryDate || inv.issueDate),
    total: inv.grossTotal,
    grossTotal: inv.grossTotal,
    netTotal: inv.netTotal,
    subtotal: inv.netTotal,
    taxTotal: inv.taxTotal,
    taxAmount: inv.taxTotal,
    discountAmount: 0,
    retentionAmount: 0,
    hash: inv.hash,
    hashControl: inv.hashControl,
    qrCode: inv.qrCode,
    client: inv.client ? {
      id: inv.client.id,
      name: inv.client.name,
      taxNumber: inv.client.nif || '999999999',
      phone: inv.client.phone,
      address: inv.client.address,
      email: inv.client.email,
    } : {
      id: 'final-consumer',
      name: 'Consumidor Final',
      taxNumber: '999999999',
    },
    user: inv.user ? {
      id: inv.user.id,
      name: inv.user.name,
    } : undefined,
    items: Array.isArray(inv.lines) ? inv.lines.map((l: any) => ({
      id: l.id,
      itemId: l.itemId,
      name: l.item?.name || 'Artigo',
      quantity: l.quantity,
      price: l.unitPrice,
      unitPrice: l.unitPrice,
      discount: l.discount || 0,
      subtotal: l.netTotal,
      taxAmount: l.taxPercent ? (l.netTotal * (l.taxPercent / 100)) : 0,
      total: l.grossTotal,
      tax: { rate: (l.taxPercent || 14) / 100 },
      taxRate: (l.taxPercent || 14) / 100,
    })) : [],
  };
}

// 4. Criação de Fatura Atómica Serializada (Delegada ao FiscalInvoicingService)
async function handleCreateInvoice(req: any, res: any) {
  try {
    const rawInvoiceData = req.body?.invoiceData || req.body || {};
    const documentType = req.body?.documentType || rawInvoiceData.documentType || 'FR';
    const invoiceData = { ...rawInvoiceData, documentType };
    const storeId = req.body?.storeId || invoiceData.storeId;
    const userId = req.body?.userId || invoiceData.userId;
    const terminalId = req.body?.terminalId || req.headers['x-terminal-id'];
    const terminalName = req.body?.terminalName || req.headers['x-terminal-name'];
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
}

apiRouter.post('/invoice/create', handleCreateInvoice);

apiRouter.post('/invoice/normal', (req, res) => {
  if (req.body?.invoiceData) {
    req.body.invoiceData.documentType = 'FT';
  } else if (req.body) {
    req.body.documentType = 'FT';
  }
  return handleCreateInvoice(req, res);
});

apiRouter.post('/invoice/invoice-receipt', (req, res) => {
  if (req.body?.invoiceData) {
    req.body.invoiceData.documentType = 'FR';
  } else if (req.body) {
    req.body.documentType = 'FR';
  }
  return handleCreateInvoice(req, res);
});

// Helper para listar faturas locais com paginação e busca
async function handleListInvoices(req: any, res: any, documentTypePrefix?: string) {
  try {
    const storeId = req.query.storeId ? String(req.query.storeId) : undefined;
    const search = req.query.search ? String(req.query.search).trim() : undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (storeId) where.storeId = storeId;
    if (documentTypePrefix) {
      where.OR = [
        { agtNo: { startsWith: documentTypePrefix } },
        { localNo: { startsWith: documentTypePrefix } },
      ];
    }
    if (search) {
      const searchConditions = [
        { agtNo: { contains: search } },
        { localNo: { contains: search } },
        { client: { name: { contains: search } } },
      ];
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchConditions }];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    const [invoices, total, outboxDocs] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: true,
          user: true,
          lines: { include: { item: true } },
        },
        orderBy: { issueDate: 'desc' },
      }),
      prisma.invoice.count({ where }),
      prisma.syncOutbox.findMany({
        where: { entityType: 'INVOICE' },
        select: { entityId: true, status: true },
      }),
    ]);

    const outboxStatusMap = new Map<string, string>();
    outboxDocs.forEach((d) => outboxStatusMap.set(d.entityId, d.status));

    const mapped = invoices.map((inv) => mapLocalInvoiceToResponse(inv, outboxStatusMap));
    const totalPages = Math.max(1, Math.ceil(total / limit));

    res.json({
      data: mapped,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (err: any) {
    console.error('❌ [Local Server GET /invoice] Erro ao listar faturas:', err?.message || err);
    res.status(500).json({ error: 'Erro ao buscar faturas locais.' });
  }
}

// 5. Listar Faturas-Recibo (FR), Faturas Normais (FT) e Proformas (PP) para Movimentos
apiRouter.get('/invoice/invoice-receipt', (req, res) => handleListInvoices(req, res, 'FR'));
apiRouter.get('/invoice/normal', (req, res) => handleListInvoices(req, res, 'FT'));
apiRouter.get('/invoice/proforma', (req, res) => handleListInvoices(req, res, 'PP'));
apiRouter.get('/invoice', (req, res) => handleListInvoices(req, res));

// 6. Obter Fatura por ID (para Visualização e Emissão de Notas de Crédito)
async function handleGetInvoiceById(req: any, res: any) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'ID da fatura é obrigatório.' });

    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [{ id }, { localNo: id }, { agtNo: id }],
      },
      include: {
        client: true,
        user: true,
        lines: { include: { item: true } },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Fatura não encontrada no banco local.' });
    }

    const outboxDocs = await prisma.syncOutbox.findMany({
      where: { entityType: 'INVOICE', entityId: invoice.id },
      select: { status: true },
    });
    const outboxStatusMap = new Map<string, string>();
    if (outboxDocs.length > 0) {
      outboxStatusMap.set(invoice.id, outboxDocs[0].status);
    }

    const mapped = mapLocalInvoiceToResponse(invoice, outboxStatusMap);
    res.json({
      ...mapped,
      data: mapped,
    });
  } catch (err: any) {
    console.error('❌ [Local Server GET /invoice/:id] Erro:', err?.message || err);
    res.status(500).json({ error: 'Erro ao obter dados da fatura local.' });
  }
}

apiRouter.get('/invoice/invoice-receipt/:id', handleGetInvoiceById);
apiRouter.get('/invoice/normal/:id', handleGetInvoiceById);
apiRouter.get('/invoice/:id', handleGetInvoiceById);

// 7. Obter Notas de Crédito Locais
apiRouter.get('/credit-note', async (req, res) => {
  res.json({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
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
