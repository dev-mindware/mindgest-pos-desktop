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
  : path.join(__dirname, "..", "dev.db");

console.log("💾 [Prisma] Path inicial da base de dados:", dbPath);

// Força a variável de ambiente para o PrismaClient usar o caminho correto
process.env.DATABASE_URL = `file:${dbPath}`;

// Instancia o cliente do Prisma com logs ativados para vermos as queries no terminal
export const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

// Teste de conexão e criação de tabelas de emergência
export async function testPrismaConnection() {
  try {
    console.log("🔄 [Prisma] A tentar conectar à base de dados em:", dbPath);
    
    // Emergência: Criar tabelas se não existirem (SQLite não suporta migrations automáticas no Electron empacotado facilmente)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "CashSession" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "cloudId" TEXT,
        "openingDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "closingDate" DATETIME,
        "openingBalance" REAL NOT NULL,
        "closingBalance" REAL,
        "totalSales" REAL NOT NULL DEFAULT 0.0,
        "totalExpenses" REAL NOT NULL DEFAULT 0.0,
        "status" TEXT NOT NULL DEFAULT 'OPEN',
        "userId" TEXT NOT NULL,
        "storeId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "cloudId" TEXT UNIQUE,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "storeId" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);

    // Forçar o índice único se a tabela já existia sem ele
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Category_cloudId_key" ON "Category"("cloudId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "CashMovement" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "cloudId" TEXT,
        "type" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "amount" REAL NOT NULL,
        "cashSessionId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "CashMovement_cashSessionId_fkey" FOREIGN KEY ("cashSessionId") REFERENCES "CashSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

    const userCount = await prisma.user.count();
    console.log("✅ [Prisma] Conexão bem-sucedida! Total de Utilizadores na DB:", userCount);
  } catch (error) {
    console.error("❌ [Prisma] Erro fatal de conexão ou criação de tabelas:", error);
  }
}
