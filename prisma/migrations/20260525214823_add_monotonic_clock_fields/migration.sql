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
    "fraudAttemptCount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Settings" ("hardwareId", "id", "lastSync", "offlineLicense", "storeId") SELECT "hardwareId", "id", "lastSync", "offlineLicense", "storeId" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
