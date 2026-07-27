-- CreateEnum
CREATE TYPE "PrestaWorkflowStatus" AS ENUM ('TO_PREPARE', 'IN_PROGRESS', 'TO_REVIEW', 'READY', 'ADDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EbayWorkflowStatus" AS ENUM ('TO_PREPARE', 'IN_PROGRESS', 'TO_REVIEW', 'READY', 'LISTED', 'REJECTED');

-- CreateTable
CREATE TABLE "WorkProduct" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ean" TEXT,
    "sku" TEXT,
    "manufacturer" TEXT,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceProductId" TEXT,
    "targetPresta" BOOLEAN NOT NULL DEFAULT false,
    "targetEbay" BOOLEAN NOT NULL DEFAULT false,
    "prestaStatus" "PrestaWorkflowStatus",
    "ebayStatus" "EbayWorkflowStatus",
    "prestaAssignee" "TaskAuthor",
    "ebayAssignee" "TaskAuthor",
    "piaskraftUrl" TEXT,
    "prestaProductId" TEXT,
    "prestaAddedAt" TIMESTAMP(3),
    "ebayUrl" TEXT,
    "ebayItemId" TEXT,
    "ebayListedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdBy" "TaskAuthor" NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkProduct_ean_key" ON "WorkProduct"("ean");

-- CreateIndex
CREATE INDEX "WorkProduct_prestaAssignee_prestaStatus_idx" ON "WorkProduct"("prestaAssignee", "prestaStatus");

-- CreateIndex
CREATE INDEX "WorkProduct_ebayAssignee_ebayStatus_idx" ON "WorkProduct"("ebayAssignee", "ebayStatus");

-- CreateIndex
CREATE INDEX "WorkProduct_archivedAt_idx" ON "WorkProduct"("archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WorkProduct_source_sku_key" ON "WorkProduct"("source", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "WorkProduct_source_sourceProductId_key" ON "WorkProduct"("source", "sourceProductId");
