/*
  Warnings:

  - Made the column `SubMenuId` on table `webUserRight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `MenuId` on table `webUserRight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isAccessBy` on table `webUserRight` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "webUserRight" DROP CONSTRAINT "webUserRight_SubMenuId_fkey";

-- AlterTable
ALTER TABLE "webUserRight" ALTER COLUMN "SubMenuId" SET NOT NULL,
ALTER COLUMN "MenuId" SET NOT NULL,
ALTER COLUMN "isAccessBy" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "webUserRight" ADD CONSTRAINT "webUserRight_SubMenuId_fkey" FOREIGN KEY ("SubMenuId") REFERENCES "SubMenu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
