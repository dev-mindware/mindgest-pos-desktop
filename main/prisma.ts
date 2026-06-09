// Força o Prisma a carregar a versão Node (library) e não a do Browser/Edge
process.env.PRISMA_CLIENT_ENGINE_TYPE = "library";

import { PrismaClient } from '@prisma/client';
import path from 'path';
import { app } from 'electron';

// ============================================================
// DATABASE_URL DINÂMICA — CRÍTICO PARA PRODUÇÃO
// Deve ser definida ANTES de instanciar o PrismaClient.
// Em produção: AppData do utilizador (persistente entre atualizações)
// Em desenvolvimento: dev.db na raiz do projecto
// ============================================================
const isProdDb = process.env.NODE_ENV === 'production';
const dbPath = isProdDb
  ? path.join(app.getPath('userData'), 'mindgest-pos.db')
  : path.join(process.cwd(), 'dev.db');

process.env.DATABASE_URL = `file:${dbPath}`;

console.log(`🗄️ [Prisma] Base de dados: ${dbPath} (${isProdDb ? 'produção' : 'desenvolvimento'})`);

// Instancia o cliente do Prisma com logs ativados para vermos as queries no terminal
export const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

// Teste de conexão e criação de tabelas de emergência
async function tableHasColumn(tableName: string, columnName: string) {
  const columns = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `PRAGMA table_info("${tableName}")`
  );
  return columns.some((column) => column.name === columnName);
}

async function hasSyncOutboxInvoiceFK() {
  const fks = await prisma.$queryRawUnsafe<Array<{ table: string; from: string }>>(
    `PRAGMA foreign_key_list("SyncOutbox")`
  );

  return fks.some((fk) => fk.table === 'Invoice' && fk.from === 'entityId');
}

async function rebuildSyncOutboxWithoutInvoiceFK() {
  console.log('🔧 [Prisma] Removendo FK inválida SyncOutbox.entityId -> Invoice.id...');
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys=OFF;`);
  await prisma.$executeRawUnsafe(`PRAGMA defer_foreign_keys=ON;`);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE "new_SyncOutbox" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "entityType" TEXT NOT NULL,
      "entityId" TEXT NOT NULL,
      "action" TEXT NOT NULL,
      "payload" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "errorMsg" TEXT,
      "storeId" TEXT NOT NULL,
      "dependsOnType" TEXT,
      "dependsOnId" TEXT,
      "retryCount" INTEGER NOT NULL DEFAULT 0,
      "lastErrorTime" DATETIME,
      "syncedAt" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
  `);
  await prisma.$executeRawUnsafe(`
    INSERT INTO "new_SyncOutbox" ("id","entityType","entityId","action","payload","status","errorMsg","storeId","dependsOnType","dependsOnId","retryCount","lastErrorTime","syncedAt","createdAt","updatedAt")
    SELECT "id","entityType","entityId","action","payload","status","errorMsg","storeId","dependsOnType","dependsOnId","retryCount","lastErrorTime","syncedAt","createdAt","updatedAt"
    FROM "SyncOutbox";
  `);
  await prisma.$executeRawUnsafe(`DROP TABLE "SyncOutbox";`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "new_SyncOutbox" RENAME TO "SyncOutbox";`);
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys=ON;`);
  await prisma.$executeRawUnsafe(`PRAGMA defer_foreign_keys=OFF;`);
}

async function ensureSyncOutboxSchema() {
  const tableExists = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='SyncOutbox'`
  );

  if (tableExists.length === 0) {
    console.log('🔧 [Prisma] Criando tabela SyncOutbox ausente...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "SyncOutbox" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "entityType" TEXT NOT NULL,
        "entityId" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "payload" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "errorMsg" TEXT,
        "storeId" TEXT NOT NULL,
        "dependsOnType" TEXT,
        "dependsOnId" TEXT,
        "retryCount" INTEGER NOT NULL DEFAULT 0,
        "lastErrorTime" DATETIME,
        "syncedAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);
    return;
  }

  if (await hasSyncOutboxInvoiceFK()) {
    await rebuildSyncOutboxWithoutInvoiceFK();
  }

  const columnsToAdd: Array<[string, string]> = [
    ['dependsOnType', 'TEXT'],
    ['dependsOnId', 'TEXT'],
    ['retryCount', 'INTEGER NOT NULL DEFAULT 0'],
    ['lastErrorTime', 'DATETIME'],
    ['syncedAt', 'DATETIME'],
  ];

  for (const [columnName, definition] of columnsToAdd) {
    if (!(await tableHasColumn('SyncOutbox', columnName))) {
      console.log(`🔧 [Prisma] Adicionando coluna ausente SyncOutbox.${columnName}...`);
      await prisma.$executeRawUnsafe(`ALTER TABLE "SyncOutbox" ADD COLUMN "${columnName}" ${definition};`);
    }
  }
}

async function ensureSettingsSchema() {
  const tableExists = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='Settings'`
  );

  if (tableExists.length > 0) {
    const columnsToAdd: Array<[string, string]> = [
      ['terminalMode', 'TEXT NOT NULL DEFAULT "MASTER"'],
      ['masterIp', 'TEXT'],
      ['lanSecret', 'TEXT'],
    ];

    for (const [columnName, definition] of columnsToAdd) {
      if (!(await tableHasColumn('Settings', columnName))) {
        console.log(`🔧 [Prisma] Adicionando coluna ausente Settings.${columnName}...`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Settings" ADD COLUMN "${columnName}" ${definition};`);
      }
    }
  }
}

export async function testPrismaConnection() {
  try {

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
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "cloudId" TEXT UNIQUE,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "role" TEXT NOT NULL,
        "password" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "storeId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Settings" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "storeId" TEXT,
        "hardwareId" TEXT,
        "offlineLicense" TEXT,
        "lastSync" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "lastOperationTime" DATETIME,
        "lastFraudAttempt" DATETIME,
        "fraudAttemptCount" INTEGER NOT NULL DEFAULT 0,
        "terminalMode" TEXT NOT NULL DEFAULT 'MASTER',
        "masterIp" TEXT,
        "lanSecret" TEXT
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Client" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "cloudId" TEXT UNIQUE,
        "offlineId" TEXT UNIQUE,
        "name" TEXT NOT NULL,
        "taxNumber" TEXT,
        "email" TEXT,
        "phone" TEXT,
        "address" TEXT,
        "storeId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);

    // Ensure unique index for offlineId exists if the column was just added or already present
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Client_offlineId_key" ON "Client"("offlineId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Item" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "cloudId" TEXT UNIQUE,
        "code" TEXT UNIQUE,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" REAL NOT NULL,
        "taxPercent" REAL NOT NULL DEFAULT 14.0,
        "stock" REAL NOT NULL DEFAULT 0.0,
        "barcode" TEXT UNIQUE,
        "categoryId" TEXT,
        "storeId" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Invoice" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "localNo" TEXT NOT NULL UNIQUE,
        "agtNo" TEXT UNIQUE,
        "status" TEXT NOT NULL DEFAULT 'DRAFT',
        "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "netTotal" REAL NOT NULL,
        "taxTotal" REAL NOT NULL,
        "grossTotal" REAL NOT NULL,
        "hash" TEXT,
        "hashControl" TEXT,
        "userId" TEXT NOT NULL,
        "clientId" TEXT,
        "storeId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User" ("id"),
        FOREIGN KEY ("clientId") REFERENCES "Client" ("id")
      );
    `);

    // AGT Series local table (persisted when Cloud sends series to POS)
    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "AgtSeries" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "seriesCode" TEXT UNIQUE,
          "documentType" TEXT NOT NULL,
          "seriesYear" TEXT NOT NULL,
          "companyId" TEXT NOT NULL,
          "establishmentNumber" TEXT NOT NULL DEFAULT 'SEDE',
          "storeId" TEXT,
          "currentSequence" INTEGER NOT NULL DEFAULT 0,
          "lastDocumentNo" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT 1,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        );
      `);

    await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "AgtSeries_documentType_seriesYear_companyId_establishmentNumber_key" ON "AgtSeries"("documentType","seriesYear","companyId","establishmentNumber");
      `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "InvoiceLine" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "invoiceId" TEXT NOT NULL,
        "itemId" TEXT NOT NULL,
        "quantity" REAL NOT NULL,
        "unitPrice" REAL NOT NULL,
        "taxPercent" REAL NOT NULL,
        "discount" REAL NOT NULL DEFAULT 0.0,
        "netTotal" REAL NOT NULL,
        "grossTotal" REAL NOT NULL,
        FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("itemId") REFERENCES "Item" ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_cloudId_key" ON "User"("cloudId");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Client_cloudId_key" ON "Client"("cloudId");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Item_cloudId_key" ON "Item"("cloudId");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Item_code_key" ON "Item"("code");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Item_barcode_key" ON "Item"("barcode");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_localNo_key" ON "Invoice"("localNo");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_agtNo_key" ON "Invoice"("agtNo");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "InvoiceLine_invoiceId_itemId_key" ON "InvoiceLine"("invoiceId", "itemId");
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

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "CashMovement_cloudId_key" ON "CashMovement"("cloudId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "CashSession_cloudId_key" ON "CashSession"("cloudId");
    `);

    await ensureSyncOutboxSchema();
    await ensureSettingsSchema();

    const userCount = await prisma.user.count();
    console.log('✅ [Prisma] Conexão bem-sucedida! Total de Utilizadores na DB:', userCount);
  } catch (error) {
    console.error('❌ [Prisma] Erro fatal de conexão ou criação de tabelas:', error);
  }
}
