-- CreateEnum
CREATE TYPE "public"."TaskPeriod" AS ENUM ('MONTHLY', 'YEARLY');

-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'SITESUPERVISOR';

-- CreateTable
CREATE TABLE "public"."TargetTask" (
    "TargetTaskID" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignedTo" TEXT NOT NULL,
    "TaskStartedAt" TIMESTAMP(3),
    "TaskCompletedAt" TIMESTAMP(3),
    "TotalProjectCost" INTEGER,
    "TotalAmountTarget" INTEGER,
    "TotalTarget" INTEGER,
    "TotalUnits" INTEGER,
    "remark" TEXT,
    "companyName" TEXT,
    "status" "public"."TaskPeriod" NOT NULL DEFAULT 'MONTHLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TargetTask_pkey" PRIMARY KEY ("TargetTaskID")
);

-- CreateIndex
CREATE INDEX "TargetTask_assignedTo_idx" ON "public"."TargetTask"("assignedTo");

-- CreateIndex
CREATE INDEX "TargetTask_status_idx" ON "public"."TargetTask"("status");

-- CreateIndex
CREATE INDEX "TargetTask_UserId_idx" ON "public"."TargetTask"("UserId");

-- AddForeignKey
ALTER TABLE "public"."TargetTask" ADD CONSTRAINT "TargetTask_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TargetTask" ADD CONSTRAINT "TargetTask_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
