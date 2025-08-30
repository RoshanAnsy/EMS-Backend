/*
  Warnings:

  - You are about to drop the column `userId` on the `webUserRight` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "webUserRight" DROP CONSTRAINT "webUserRight_userId_fkey";

-- DropIndex
DROP INDEX "webUserRight_userId_idx";

-- AlterTable
ALTER TABLE "webUserRight" DROP COLUMN "userId",
ADD COLUMN     "AddedBY" TEXT;
