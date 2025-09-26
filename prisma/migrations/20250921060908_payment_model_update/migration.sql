/*
  Warnings:

  - You are about to drop the column `UserId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_UserId_fkey";

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "UserId",
DROP COLUMN "status",
ADD COLUMN     "AnyTax" INTEGER,
ADD COLUMN     "FoodAllowanceCost" INTEGER,
ADD COLUMN     "GratuityAmount" INTEGER,
ADD COLUMN     "LaultyAmount" INTEGER,
ADD COLUMN     "MisleneousAmount" INTEGER,
ADD COLUMN     "OtherCost" INTEGER,
ADD COLUMN     "PFAmount" INTEGER,
ADD COLUMN     "Tds" INTEGER,
ADD COLUMN     "TravelCost" INTEGER,
ADD COLUMN     "medicleInsuranceCost" INTEGER,
ALTER COLUMN "remark" DROP NOT NULL,
ALTER COLUMN "fileUrl" DROP NOT NULL;
