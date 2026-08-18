-- CreateTable
CREATE TABLE "DocumentSequence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cloudId" TEXT,
    "companyCode" TEXT NOT NULL,
    "storeCode" TEXT NOT NULL,
    "documentType" TEXT NOT NULL DEFAULT 'FP',
    "seriesYear" TEXT NOT NULL,
    "versionCode" TEXT NOT NULL DEFAULT '01',
    "seriesCode" TEXT NOT NULL,
    "currentSequence" INTEGER NOT NULL DEFAULT 0,
    "lastDocumentNo" INTEGER NOT NULL DEFAULT 5000,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "storeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AgtSeries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seriesCode" TEXT,
    "documentType" TEXT NOT NULL,
    "seriesYear" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "establishmentNumber" TEXT NOT NULL,
    "storeId" TEXT,
    "currentSequence" INTEGER NOT NULL DEFAULT 0,
    "lastDocumentNo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
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
INSERT INTO "new_Settings" ("fraudAttemptCount", "hardwareId", "id", "lastFraudAttempt", "lastOperationTime", "lastSync", "offlineLicense", "storeId") SELECT "fraudAttemptCount", "hardwareId", "id", "lastFraudAttempt", "lastOperationTime", "lastSync", "offlineLicense", "storeId" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "DocumentSequence_cloudId_key" ON "DocumentSequence"("cloudId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentSequence_seriesCode_key" ON "DocumentSequence"("seriesCode");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentSequence_companyCode_storeCode_documentType_seriesYear_versionCode_key" ON "DocumentSequence"("companyCode", "storeCode", "documentType", "seriesYear", "versionCode");

-- CreateIndex
CREATE UNIQUE INDEX "AgtSeries_seriesCode_key" ON "AgtSeries"("seriesCode");

-- CreateIndex
CREATE UNIQUE INDEX "AgtSeries_documentType_seriesYear_companyId_establishmentNumber_key" ON "AgtSeries"("documentType", "seriesYear", "companyId", "establishmentNumber");
