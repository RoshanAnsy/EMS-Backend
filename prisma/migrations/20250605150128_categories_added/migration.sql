/*
  Warnings:

  - Added the required column `Categories` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('RESULT', 'JOB', 'ADMITCARD', 'ANSWERKEY', 'ADMISSION', 'SYLLABUS', 'CERTIFICATE');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "Categories" "Categories" NOT NULL;
