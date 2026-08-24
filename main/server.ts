import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import os from 'os';
import { prisma } from './prisma';
import { FiscalSignatureService } from './fiscal-signature';

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

// FIFO Mutex Promise Queue for Interleaved Single-Series Invoicing with Busy Retry
let invoiceQueue = Promise.resolve();

async function enqueueInvoiceTask<T>(task: () => Promise<T>, maxRetries = 3): Promise<T> {
  const executeWithRetry = async (): Promise<T> => {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await task();
      } catch (err: any) {
        attempt++;
        const isBusy = err?.message?.includes('SQLITE_BUSY') || err?.code === 'P2034' || err?.message?.includes('database is locked');
        if (isBusy && attempt < maxRetries) {
          const jitter = Math.floor(Math.random() * 150) + 150 * attempt;
          console.warn(`⏳ [SQLite WAL] Base de dados ocupada (SQLITE_BUSY). Tentativa ${attempt}/${maxRetries} em ${jitter}ms...`);
          await new Promise((resolve) => setTimeout(resolve, jitter));
        } else {
          throw err;
        }
      }
    }
    throw new Error('Tempo limite excedido na fila de faturação (SQLITE_BUSY).');
  };

  const result = invoiceQueue.then(executeWithRetry, executeWithRetry);
  invoiceQueue = result.then(() => {}, () => {});
  return result;
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
      connectedCount: connectedTerminals.size,
    });
  }

  // Resposta pública mínima (sem fingerprinting ou contagem de terminais)
  res.json({
    status: 'online',
    timestamp: new Date().toISOString()
  });
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
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar itens.' });
  }
});

// 2. Obter Categorias
apiRouter.get('/categories', async (req, res) => {
  try {
    const { storeId } = req.query;
    const where: any = { isActive: true };
    if (storeId) where.storeId = String(storeId);
    const categories = await prisma.category.findMany({ where, orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias.' });
  }
});

// 3. Obter e Criar Clientes
apiRouter.get('/clients', async (req, res) => {
  try {
    const { storeId, search } = req.query;
    const where: any = {};
    if (storeId) where.storeId = String(storeId);
    if (search) {
      const s = String(search);
      where.OR = [
        { name: { contains: s } },
        { taxNumber: { contains: s } },
        { email: { contains: s } },
      ];
    }
    const clients = await prisma.client.findMany({ where, orderBy: { name: 'asc' } });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes.' });
  }
});

apiRouter.post('/clients', async (req, res) => {
  try {
    const clientData = req.body;
    const id = clientData.id || crypto.randomUUID();
    const client = await prisma.client.create({
      data: {
        id,
        name: clientData.name,
        nif: clientData.taxNumber || clientData.nif || '999999999',
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        storeId: clientData.storeId || 'DEFAULT_STORE',
      }
    });

    // Registrar no Outbox para sincronização com a cloud
    await prisma.syncOutbox.create({
      data: {
        entityType: 'CLIENT',
        entityId: id,
        action: 'CREATE',
        payload: JSON.stringify(client),
        status: 'PENDING',
        storeId: clientData.storeId || 'DEFAULT_STORE'
      }
    });

    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Erro ao criar cliente.' });
  }
});

// 4. Sessões e Movimentos de Caixa Centralizados
apiRouter.get('/cash-sessions/current', async (req, res) => {
  try {
    const { storeId } = req.query;
    const session = await prisma.cashSession.findFirst({
      where: {
        storeId: String(storeId),
        status: 'OPEN'
      },
      orderBy: { openingDate: 'desc' }
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sessão de caixa.' });
  }
});

apiRouter.post('/cash-movements', async (req, res) => {
  try {
    const { sessionId, type, description, amount } = req.body;
    const movement = await prisma.cashMovement.create({
      data: {
        id: crypto.randomUUID(),
        cashSessionId: sessionId,
        type,
        description,
        amount: Number(amount),
      }
    });

    await prisma.syncOutbox.create({
      data: {
        entityType: 'CASH_MOVEMENT',
        entityId: movement.id,
        action: 'CREATE',
        payload: JSON.stringify(movement),
        status: 'PENDING',
        storeId: req.body.storeId || 'DEFAULT_STORE'
      }
    });

    res.json(movement);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro ao criar movimento de caixa.' });
  }
});

// =========================================================================
// 5. EMISSÃO CENTRALIZADA ATÓMICA DE FATURAS COM FILA FIFO & SÉRIE OFICIAL AGT
// =========================================================================
apiRouter.post('/invoice/create', async (req, res) => {
  const { invoiceData, storeId, userId, terminalId } = req.body;

  if (!invoiceData || !invoiceData.items || !Array.isArray(invoiceData.items) || invoiceData.items.length === 0) {
    return res.status(400).json({ error: 'Dados da fatura ou itens inválidos.' });
  }

  try {
    // Processamento estritamente serializado na fila FIFO em memória
    const invoiceResponse = await enqueueInvoiceTask(async () => {
      const documentType = (invoiceData.documentType || invoiceData.type || 'FR').toString().toUpperCase();
      const currentYear = new Date().getFullYear().toString();
      const storeIdLocal = storeId || invoiceData.storeId || 'DEFAULT_STORE';
      const establishmentNumber = invoiceData.establishmentNumber || 'SEDE';
      const companyId = invoiceData.companyId || 'DEFAULT_COMPANY';

      // 1. Procurar série oficial da AGT ativa
      let seriesRow = await prisma.agtSeries.findFirst({
        where: {
          documentType,
          seriesYear: currentYear,
          isActive: true,
          OR: [
            { storeId: storeIdLocal },
            { storeId: null },
            { establishmentNumber: establishmentNumber },
          ]
        },
        orderBy: { updatedAt: 'desc' },
      });

      if (!seriesRow) {
        seriesRow = await prisma.agtSeries.findFirst({
          where: {
            documentType,
            isActive: true,
          },
          orderBy: { updatedAt: 'desc' },
        });
      }

      if (!seriesRow || !seriesRow.seriesCode) {
        throw new Error(`Não é possível faturar: Nenhuma série fiscal oficial da AGT (${documentType}) encontrada no Master.`);
      }

      // 2. Transação atómica no SQLite (Validação de Stock + Sequencial Atómico + Inserção)
      return await prisma.$transaction(async (tx) => {
        // A. Validar stock de todos os itens antes de abater
        for (const item of invoiceData.items) {
          const dbItem = await tx.item.findUnique({ where: { id: item.id } });
          if (!dbItem) {
            throw new Error(`Item ${item.name || item.id} não encontrado na base de dados do Master.`);
          }
          const requestedQty = Number(item.quantity || item.qty || 1);
          if (dbItem.stock < requestedQty) {
            throw new Error(`Stock insuficiente para o artigo "${dbItem.name}". Disponível: ${dbItem.stock}, Solicitado: ${requestedQty}`);
          }
        }

        // B. Calcular Totais
        let calculatedNetTotal = 0;
        let calculatedTaxTotal = 0;

        for (const item of invoiceData.items) {
          const qty = Number(item.quantity || item.qty || 1);
          const price = Number(item.price || item.unitPrice || 0);
          const discount = Number(item.discount || 0);
          const itemNet = (price * qty) - discount;
          const taxRate = Number(item.taxRate || item.tax || 0.14);
          const itemTax = itemNet * taxRate;

          calculatedNetTotal += itemNet;
          calculatedTaxTotal += itemTax;
        }

        const calculatedGrossTotal = calculatedNetTotal + calculatedTaxTotal;
        const nextSequence = (seriesRow.currentSequence || 0) + 1;
        const seriesCode = seriesRow.seriesCode;
        const localAgtNo = `${documentType} ${seriesCode}/${nextSequence}`;
        const previousHash = seriesRow.lastHash || '';
        const issueDate = invoiceData.issueDate ? new Date(invoiceData.issueDate) : new Date();

        // C. Assinatura Digital RSA-SHA1 AGT
        const signatureResult = await FiscalSignatureService.signInvoice({
          docNo: localAgtNo,
          issueDate,
          grossTotal: calculatedGrossTotal,
          taxTotal: calculatedTaxTotal,
          previousHash,
        });

        // D. Atualizar a série AGT atómica com o novo número e o hash encadeado
        await tx.agtSeries.update({
          where: { id: seriesRow.id },
          data: {
            currentSequence: nextSequence,
            lastDocumentNo: localAgtNo,
            lastHash: signatureResult.hash,
          },
        });

        // E. Abater Stock
        for (const item of invoiceData.items) {
          const requestedQty = Number(item.quantity || item.qty || 1);
          await tx.item.update({
            where: { id: item.id },
            data: { stock: { decrement: requestedQty } }
          });
        }

        const invoiceId = invoiceData.id || crypto.randomUUID();
        const localNo = `LOCAL-${Date.now()}`;

        // F. Inserir Fatura
        const createdInvoice = await tx.invoice.create({
          data: {
            id: invoiceId,
            localNo,
            agtNo: localAgtNo,
            status: "VALID",
            issueDate,
            systemEntryDate: signatureResult.systemEntryDate,
            netTotal: calculatedNetTotal,
            taxTotal: calculatedTaxTotal,
            grossTotal: calculatedGrossTotal,
            hash: signatureResult.hash,
            hashControl: signatureResult.hashControl,
            previousHash: signatureResult.previousHash,
            qrCode: signatureResult.qrCode,
            userId: userId || 'MASTER_USER',
            clientId: invoiceData.clientId || null,
            storeId: storeIdLocal,
          }
        });

        // G. Inserir Linhas da Fatura
        for (let i = 0; i < invoiceData.items.length; i++) {
          const item = invoiceData.items[i];
          const qty = Number(item.quantity || item.qty || 1);
          const price = Number(item.price || item.unitPrice || 0);
          const discount = Number(item.discount || 0);
          const net = (price * qty) - discount;
          const taxRate = Number(item.taxRate || item.tax || 0.14);
          const tax = net * taxRate;

          await tx.invoiceLine.create({
            data: {
              id: crypto.randomUUID(),
              invoiceId: createdInvoice.id,
              itemId: item.id || crypto.randomUUID(),
              quantity: qty,
              unitPrice: price,
              discount,
              taxPercent: taxRate * 100,
              netTotal: net,
              grossTotal: net + tax,
            }
          });
        }

        // H. Inserir no Outbox do Master para envio posterior à Cloud
        await tx.syncOutbox.create({
          data: {
            entityType: "INVOICE",
            entityId: createdInvoice.id,
            action: "CREATE",
            storeId: storeIdLocal,
            payload: JSON.stringify({
              ...invoiceData,
              id: createdInvoice.id,
              agtNo: localAgtNo,
              hash: signatureResult.hash,
              hashControl: signatureResult.hashControl,
              qrCode: signatureResult.qrCode,
              swValidationNumber: signatureResult.swValidationNumber,
              systemEntryDate: signatureResult.systemEntryDate,
              netTotal: calculatedNetTotal,
              taxTotal: calculatedTaxTotal,
              grossTotal: calculatedGrossTotal,
            }),
            status: "PENDING",
          }
        });

        // I. Atualizar estatística do terminal conectado
        if (terminalId && connectedTerminals.has(terminalId)) {
          const t = connectedTerminals.get(terminalId)!;
          t.totalSales += 1;
        }

        return {
          id: createdInvoice.id,
          localNo: createdInvoice.localNo,
          agtNo: localAgtNo,
          hash: signatureResult.hash,
          hashControl: signatureResult.hashControl,
          qrCode: signatureResult.qrCode,
          swValidationNumber: signatureResult.swValidationNumber,
          netTotal: calculatedNetTotal,
          taxTotal: calculatedTaxTotal,
          grossTotal: calculatedGrossTotal,
          offline: true,
          source: 'LAN_MASTER'
        };
      });
    });

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
// Inicialização do Servidor Local
// ==========================================
export function startLocalServer() {
  return new Promise(async (resolve, reject) => {
    try {
      try {
        await prisma.$executeRawUnsafe(`PRAGMA journal_mode = WAL;`);
        await prisma.$executeRawUnsafe(`PRAGMA busy_timeout = 5000;`);
        console.log('⚡ [Local Server SQLite] Modo WAL e busy_timeout ativados.');
      } catch (dbErr) {
        console.warn('⚠️ Falha ao definir PRAGMA WAL no SQLite:', dbErr);
      }

      const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 [Local Server] API REST Embutida a rodar em: http://0.0.0.0:${PORT}`);
        resolve(server);
      });

      server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`❌ [Local Server] A porta ${PORT} já está em uso!`);
        }
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}
