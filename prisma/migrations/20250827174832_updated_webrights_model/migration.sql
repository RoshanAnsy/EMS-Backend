/*
  Warnings:

  - You are about to drop the column `MenuId` on the `webUserRight` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "webUserRight" DROP CONSTRAINT "webUserRight_MenuId_fkey";

-- DropIndex
DROP INDEX "webUserRight_MenuId_idx";

-- AlterTable
ALTER TABLE "webUserRight" DROP COLUMN "MenuId";
