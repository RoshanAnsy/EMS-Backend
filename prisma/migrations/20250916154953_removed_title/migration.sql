/*
  Warnings:

  - You are about to drop the column `description` on the `TargetTask` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `TargetTask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."TargetTask" DROP COLUMN "description",
DROP COLUMN "title";
