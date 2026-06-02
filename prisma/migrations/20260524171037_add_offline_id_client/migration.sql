/*
  Warnings:

  - A unique constraint covering the columns `[offlineId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN "offlineId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Client_offlineId_key" ON "Client"("offlineId");
