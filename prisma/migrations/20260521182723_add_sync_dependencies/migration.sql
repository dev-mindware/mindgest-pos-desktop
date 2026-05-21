-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cloudId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "storeId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CashSession" (
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

-- CreateTable
CREATE TABLE "CashMovement" (
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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cloudId" TEXT,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "taxPercent" REAL NOT NULL DEFAULT 14.0,
    "stock" REAL NOT NULL DEFAULT 0.0,
    "barcode" TEXT,
    "categoryId" TEXT,
    "storeId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("barcode", "categoryId", "cloudId", "code", "createdAt", "description", "id", "isActive", "name", "price", "stock", "storeId", "taxPercent", "updatedAt") SELECT "barcode", "categoryId", "cloudId", "code", "createdAt", "description", "id", "isActive", "name", "price", "stock", "storeId", "taxPercent", "updatedAt" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_cloudId_key" ON "Item"("cloudId");
CREATE UNIQUE INDEX "Item_code_key" ON "Item"("code");
CREATE UNIQUE INDEX "Item_barcode_key" ON "Item"("barcode");
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SyncOutbox_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SyncOutbox" ("action", "createdAt", "entityId", "entityType", "errorMsg", "id", "payload", "status", "storeId", "updatedAt") SELECT "action", "createdAt", "entityId", "entityType", "errorMsg", "id", "payload", "status", "storeId", "updatedAt" FROM "SyncOutbox";
DROP TABLE "SyncOutbox";
ALTER TABLE "new_SyncOutbox" RENAME TO "SyncOutbox";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_cloudId_key" ON "Category"("cloudId");

-- CreateIndex
CREATE UNIQUE INDEX "CashSession_cloudId_key" ON "CashSession"("cloudId");

-- CreateIndex
CREATE UNIQUE INDEX "CashMovement_cloudId_key" ON "CashMovement"("cloudId");
