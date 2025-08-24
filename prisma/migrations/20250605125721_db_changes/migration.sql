/*
  Warnings:

  - You are about to drop the `ArticleView` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `viewContent` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArticleView" DROP CONSTRAINT "ArticleView_articleId_fkey";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "viewContent" TEXT NOT NULL;

-- DropTable
DROP TABLE "ArticleView";
