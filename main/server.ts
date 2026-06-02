import express from 'express';
import cors from 'cors';
import { prisma } from './prisma';

const app = express();
const PORT = process.env.LOCAL_API_PORT || 3333; // Porta dedicada para o Backend Local

// Middlewares
app.use(cors());
app.use(express.json());

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
// Rotas Base (Exemplo de como vamos estruturar)
// ==========================================

// Obter todos os utilizadores (Teste rápido de Prisma + HTTP)
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aceder à base de dados local.' });
  }
});

// ==========================================
// Inicialização do Servidor
// ==========================================

export function startLocalServer() {
  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(PORT, () => {
        console.log(`🚀 [Local Server] API REST Embutida a rodar em: http://localhost:${PORT}`);
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
