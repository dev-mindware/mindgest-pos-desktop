// Força o Prisma a carregar a versão Node (library) e não a do Browser/Edge
process.env.PRISMA_CLIENT_ENGINE_TYPE = "library";

import { PrismaClient } from '@prisma/client';
import path from 'path';
import { app } from 'electron';

// No Electron de produção, o Prisma precisa saber o caminho exato e seguro do SQLite.
const isProd = process.env.NODE_ENV === "production";

// Define o caminho dinâmico para a base de dados dependendo do ambiente
const dbPath = isProd
  ? path.join(app.getPath("userData"), "dev.db")
  : path.join(process.cwd(), "dev.db");

// Força a variável de ambiente para o PrismaClient usar o caminho correto
process.env.DATABASE_URL = `file:${dbPath}`;

// Instancia o cliente do Prisma com logs ativados para vermos as queries no terminal
export const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

// Teste de conexão (Fase 1 da nossa Checklist)
export async function testPrismaConnection() {
  try {
    console.log("🔄 [Prisma] A tentar conectar à base de dados em:", dbPath);
    const userCount = await prisma.user.count();
    console.log("✅ [Prisma] Conexão bem-sucedida! Total de Utilizadores na DB:", userCount);
  } catch (error) {
    console.error("❌ [Prisma] Erro fatal de conexão:", error);
  }
}
