import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { prisma } from './prisma';

const app = express();
const PORT = Number(process.env.LOCAL_API_PORT) || 3333; // Porta dedicada para o Backend Local

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// Middleware de Autenticação LAN
// ==========================================
async function lanAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
    const lanSecret = settings?.lanSecret;

    if (!lanSecret) {
      // Se não houver secret configurado no Master, permite (ou pode bloquear, dependendo da política)
      return next();
    }

    const clientSecret = req.headers['x-lan-secret'];
    if (clientSecret !== lanSecret) {
      return res.status(401).json({ error: 'Acesso Não Autorizado. Secret LAN inválido.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao validar autenticação LAN.' });
  }
}

// ==========================================
// Rotas de Teste e Healthcheck
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'MindGest Local Master Server is running!',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// Rotas Transacionais (Protegidas)
// ==========================================
const apiRouter = express.Router();
apiRouter.use(lanAuthMiddleware);

// Obter Itens
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

// Obter Clientes
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
        { email: { contains: s } },
      ];
    }
    const clients = await prisma.client.findMany({ where, orderBy: { name: 'asc' } });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes.' });
  }
});

// Sessão de Caixa
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

apiRouter.post('/invoice', async (req, res) => {
  try {
    // Para simplificar, estamos a assumir que o payload de fatura do Frontend
    // pode ser guardado no SQLite, mas como o Frontend envia para o Outbox do PC local dele,
    // o modo Terminal precisaria enviar a fatura diretamente para a API do Master!
    // TODO: A lógica real de faturação pode ser mais complexa. Por enquanto guardamos num Outbox do Master ou inserimos direto.
    const payload = req.body;
    
    // Inserimos a fatura diretamente na DB do Master (como se fosse criada aqui)
    // Precisaríamos de mapear os campos, mas uma implementação provisória é apenas simular sucesso 
    // ou inserir via prisma.invoice.create se o payload for 1:1 com o prisma.
    res.json({ success: true, message: 'Fatura recebida pelo Master' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar fatura no Master.' });
  }
});

app.use('/api', apiRouter);

// ==========================================
// Inicialização do Servidor
// ==========================================

export function startLocalServer() {
  return new Promise((resolve, reject) => {
    try {
      // 0.0.0.0 permite conexões de qualquer IP na LAN
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
