/*
  Warnings:

  - You are about to drop the column `status` on the `TargetTask` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."TargetTask_status_idx";

-- AlterTable
ALTER TABLE "public"."TargetTask" DROP COLUMN "status",
ADD COLUMN     "TaskType" "public"."TaskPeriod" NOT NULL DEFAULT 'MONTHLY';

-- CreateIndex
CREATE INDEX "TargetTask_TaskType_idx" ON "public"."TargetTask"("TaskType");
