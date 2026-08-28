// Força o Prisma a carregar a versão Node (library) e não a do Browser/Edge
process.env.PRISMA_CLIENT_ENGINE_TYPE = "library";

import path from 'path';
import { app } from 'electron';
import fs from 'fs';

// Resolve o caminho do engine nativo do Prisma (.node)
(function setupPrismaEngine() {
  try {
    const isProd = app ? app.isPackaged : false;
    if (isProd && process.resourcesPath) {
      const prodEnginePath = path.join(process.resourcesPath, 'prisma', 'query_engine-windows.dll.node');
      if (fs.existsSync(prodEnginePath)) {
        process.env.PRISMA_QUERY_ENGINE_LIBRARY = prodEnginePath;
        return;
      }
    }
    
    const devEnginePath = path.join(process.cwd(), 'main', 'prisma-client', 'query_engine-windows.dll.node');
    if (fs.existsSync(devEnginePath)) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = devEnginePath;
    }
  } catch (err) {
    console.error('[Prisma] Erro ao configurar caminho do query engine:', err);
  }
})();

import { PrismaClient } from './prisma-client';


function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  let dbDir: string;
  try {
    dbDir = app ? app.getPath('userData') : path.join(process.cwd(), 'prisma');
  } catch {
    dbDir = path.join(process.cwd(), 'prisma');
  }

  if (!fs.existsSync(dbDir)) {
    try {
      fs.mkdirSync(dbDir, { recursive: true });
    } catch {}
  }

  const dbPath = path.join(dbDir, 'dev.db');
  const url = `file:${dbPath}`;
  process.env.DATABASE_URL = url;
  return url;
}

const dbUrl = getDatabaseUrl();

// Instancia o cliente do Prisma com logs ativados e URL explícita
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
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

export async function ensureSettingsSchema() {
  const tableExists = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='Settings'`
  );

  if (tableExists.length > 0) {
    const columnsToAdd: Array<[string, string]> = [
      ['terminalMode', 'TEXT NOT NULL DEFAULT "MASTER"'],
      ['masterIp', 'TEXT'],
      ['lanSecret', 'TEXT'],
      ['softwareValidationNumber', 'TEXT DEFAULT "FE/241/AGT/2026"'],
      ['companyNif', 'TEXT DEFAULT "0000000000"'],
      ['companyName', 'TEXT DEFAULT "MINDGEST"'],
      ['encryptedPrivateKey', 'TEXT'],
      ['publicKey', 'TEXT'],
      ['serieComunicadaAGT', 'BOOLEAN NOT NULL DEFAULT 0'],
      ['backupMasterId', 'TEXT'],
      ['backupMasterIp', 'TEXT'],
      ['lanEnabled', 'BOOLEAN NOT NULL DEFAULT 1'],
    ];

    for (const [columnName, definition] of columnsToAdd) {
      if (!(await tableHasColumn('Settings', columnName))) {
        console.log(`🔧 [Prisma] Adicionando coluna ausente Settings.${columnName}...`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Settings" ADD COLUMN "${columnName}" ${definition};`);
      }
    }
  }
}

export async function ensureInvoiceSchema() {
  const tableExists = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='Invoice'`
  );

  if (tableExists.length > 0) {
    const columnsToAdd: Array<[string, string]> = [
      ['previousHash', 'TEXT'],
      ['qrCode', 'TEXT'],
      ['systemEntryDate', 'DATETIME DEFAULT CURRENT_TIMESTAMP'],
      ['idempotencyKey', 'TEXT'],
      ['terminalId', 'TEXT'],
      ['terminalName', 'TEXT'],
    ];

    for (const [columnName, definition] of columnsToAdd) {
      if (!(await tableHasColumn('Invoice', columnName))) {
        console.log(`🔧 [Prisma] Adicionando coluna ausente Invoice.${columnName}...`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Invoice" ADD COLUMN "${columnName}" ${definition};`);
      }
    }

    try {
      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_idempotencyKey_key" ON "Invoice"("idempotencyKey");
      `);
    } catch {}
  }
}

async function ensureAgtSeriesSchema() {
  const tableExists = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='AgtSeries'`
  );

  if (tableExists.length > 0) {
    const columnsToAdd: Array<[string, string]> = [
      ['lastHash', 'TEXT'],
    ];

    for (const [columnName, definition] of columnsToAdd) {
      if (!(await tableHasColumn('AgtSeries', columnName))) {
        console.log(`🔧 [Prisma] Adicionando coluna ausente AgtSeries.${columnName}...`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "AgtSeries" ADD COLUMN "${columnName}" ${definition};`);
      }
    }
  }
}

async function ensureAgtImmutabilityTriggers() {
  try {
    // 1. Bloquear UPDATE em Invoice emitidas (imutabilidade AGT)
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS "agt_prevent_invoice_update"
      BEFORE UPDATE ON "Invoice"
      BEGIN
        SELECT RAISE(ABORT, 'AGT_COMPLIANCE_ERROR: Documentos fiscais emitidos sao estritamente imutaveis.');
      END;
    `);

    // 2. Bloquear DELETE em Invoice
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS "agt_prevent_invoice_delete"
      BEFORE DELETE ON "Invoice"
      BEGIN
        SELECT RAISE(ABORT, 'AGT_COMPLIANCE_ERROR: Proibida a eliminacao de documentos fiscais.');
      END;
    `);

    // 3. Bloquear DELETE em InvoiceLine (linhas de fatura)
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS "agt_prevent_invoiceline_delete"
      BEFORE DELETE ON "InvoiceLine"
      BEGIN
        SELECT RAISE(ABORT, 'AGT_COMPLIANCE_ERROR: Proibida a eliminacao de linhas de documentos fiscais.');
      END;
    `);

    // 4. Bloquear UPDATE em InvoiceLine
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS "agt_prevent_invoiceline_update"
      BEFORE UPDATE ON "InvoiceLine"
      BEGIN
        SELECT RAISE(ABORT, 'AGT_COMPLIANCE_ERROR: Proibida a alteracao de linhas de documentos fiscais.');
      END;
    `);

    console.log('🛡️ [Prisma] Triggers de Imutabilidade Fiscal AGT ativados com sucesso.');
  } catch (err) {
    console.warn('⚠️ [Prisma] Erro ao criar triggers de imutabilidade AGT:', err);
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
        "nif" TEXT,
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
    await ensureInvoiceSchema();
    await ensureAgtSeriesSchema();
    await ensureAgtImmutabilityTriggers();

    const userCount = await prisma.user.count();
    console.log('✅ [Prisma] Conexão bem-sucedida! Total de Utilizadores na DB:', userCount);
  } catch (error) {
    console.error('❌ [Prisma] Erro fatal de conexão ou criação de tabelas:', error);
  }
}
