/*
  Warnings:

  - The values [AREAMANAGER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('ADMIN', 'DIRECTOR', 'HOS', 'AREAMANAGER1', 'AREAMANAGER2', 'STATEHEAD', 'SALESOFFICER', 'AREAMANAGEROPS', 'ACCOUNTANT', 'SITESUPERVISOR', 'HR', 'CP1', 'CP2', 'SCP1', 'SCP2', 'TRAINEE');
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TABLE "public"."webUserRight" ALTER COLUMN "Role" TYPE "public"."Role_new" USING ("Role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;
