-- This migration adds new roles to the Role enum
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'AREAMANAGER2';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'TRAINEE';
