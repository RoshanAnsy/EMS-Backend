/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Role" ADD VALUE 'AREAMANAGEROPS';
ALTER TYPE "public"."Role" ADD VALUE 'ACCOUNTANT';
ALTER TYPE "public"."Role" ADD VALUE 'HR';
ALTER TYPE "public"."Role" ADD VALUE 'CP1';
ALTER TYPE "public"."Role" ADD VALUE 'CP2';
ALTER TYPE "public"."Role" ADD VALUE 'SCP1';
ALTER TYPE "public"."Role" ADD VALUE 'SCP2';

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "dueDate",
ADD COLUMN     "MobileNo" TEXT,
ADD COLUMN     "PerUnitCost" INTEGER,
ADD COLUMN     "TaskBalanceAmount" INTEGER,
ADD COLUMN     "TaskCompletedAt" TIMESTAMP(3),
ADD COLUMN     "TaskStartedAt" TIMESTAMP(3),
ADD COLUMN     "TotalProjectCost" INTEGER,
ADD COLUMN     "TotalReceivedAmount" INTEGER,
ADD COLUMN     "TotalUnits" INTEGER,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "pinCode" TEXT,
ADD COLUMN     "purpose" TEXT,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "state" TEXT;

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "public"."Task"("status");

-- CreateIndex
CREATE INDEX "Task_pinCode_idx" ON "public"."Task"("pinCode");

-- CreateIndex
CREATE INDEX "Task_city_idx" ON "public"."Task"("city");

-- CreateIndex
CREATE INDEX "Task_state_idx" ON "public"."Task"("state");
