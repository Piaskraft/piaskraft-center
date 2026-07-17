-- CreateEnum
CREATE TYPE "TaskAssignee" AS ENUM ('ADMIN', 'OPERATOR', 'BOTH');

-- CreateEnum
CREATE TYPE "TaskAuthor" AS ENUM ('ADMIN', 'OPERATOR');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('PIASKRAFT', 'PRESTASHOP', 'EBAY', 'BASELINKER', 'MJW', 'MARKETING', 'DOCUMENTS', 'PHONE', 'PRIVATE', 'OTHER');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'NORMAL', 'IMPORTANT', 'URGENT', 'TODAY');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('NEW', 'TODO', 'IN_PROGRESS', 'WAITING_REVIEW', 'DONE', 'CANCELLED');

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assignedTo" "TaskAssignee" NOT NULL,
    "category" "TaskCategory" NOT NULL,
    "priority" "TaskPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "TaskStatus" NOT NULL DEFAULT 'NEW',
    "date" DATE,
    "time" TIME(0),
    "createdBy" "TaskAuthor" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskComment" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "author" "TaskAuthor" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_date_idx" ON "Task"("date");

-- CreateIndex
CREATE INDEX "Task_assignedTo_status_idx" ON "Task"("assignedTo", "status");

-- CreateIndex
CREATE INDEX "TaskComment_taskId_idx" ON "TaskComment"("taskId");

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
