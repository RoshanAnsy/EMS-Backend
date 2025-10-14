/*
  Warnings:

  - You are about to drop the column `AssignUserID` on the `UserMaping` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserMaping" DROP CONSTRAINT "UserMaping_AssignUserID_fkey";

-- DropIndex
DROP INDEX "public"."UserMaping_AssignUserID_idx";

-- AlterTable
ALTER TABLE "public"."UserMaping" DROP COLUMN "AssignUserID";

-- CreateTable
CREATE TABLE "public"."AssignUserMaping" (
    "id" TEXT NOT NULL,
    "userMapingId" TEXT NOT NULL,
    "assignUserId" TEXT NOT NULL,

    CONSTRAINT "AssignUserMaping_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AssignUserMaping" ADD CONSTRAINT "AssignUserMaping_assignUserId_fkey" FOREIGN KEY ("assignUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssignUserMaping" ADD CONSTRAINT "AssignUserMaping_userMapingId_fkey" FOREIGN KEY ("userMapingId") REFERENCES "public"."UserMaping"("UserMapingAutoID") ON DELETE RESTRICT ON UPDATE CASCADE;
