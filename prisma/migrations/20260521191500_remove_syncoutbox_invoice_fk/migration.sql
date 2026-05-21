PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

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

INSERT INTO "new_SyncOutbox" ("id","entityType","entityId","action","payload","status","errorMsg","storeId","dependsOnType","dependsOnId","retryCount","lastErrorTime","syncedAt","createdAt","updatedAt")
SELECT "id","entityType","entityId","action","payload","status","errorMsg","storeId","dependsOnType","dependsOnId","retryCount","lastErrorTime","syncedAt","createdAt","updatedAt"
FROM "SyncOutbox";

DROP TABLE "SyncOutbox";
ALTER TABLE "new_SyncOutbox" RENAME TO "SyncOutbox";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
