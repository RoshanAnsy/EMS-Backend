-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'DIRECTOR', 'HOS', 'AREAMANAGER', 'STATEHEAD', 'SALESOFFICER');

-- CreateEnum
CREATE TYPE "public"."ActionTypes" AS ENUM ('LOGIN', 'LOGOUT');

-- CreateEnum
CREATE TYPE "public"."BillStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'NOT_INITIATED');

-- CreateEnum
CREATE TYPE "public"."AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LEAVE', 'HOLIDAY');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('PENDING', 'INPROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "EmplyID" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "public"."Role" NOT NULL,
    "AdharNo" TEXT,
    "PanNo" TEXT,
    "MobileNo" TEXT,
    "EmergencyContactNo" TEXT,
    "PermanentAddress" TEXT,
    "CurrentAddress" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Log" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "public"."ActionTypes" NOT NULL,
    "ipAddress" TEXT,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."webUserRight" (
    "id" TEXT NOT NULL,
    "AddedBY" TEXT,
    "Role" "public"."Role" NOT NULL,
    "MenuId" TEXT NOT NULL,
    "isAccessBy" TEXT NOT NULL,
    "SubMenuId" TEXT NOT NULL,
    "isAccess" BOOLEAN NOT NULL DEFAULT false,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canAdd" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webUserRight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Menu" (
    "id" TEXT NOT NULL,
    "MenuName" TEXT NOT NULL,
    "Priority" INTEGER NOT NULL,
    "Icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubMenu" (
    "id" TEXT NOT NULL,
    "SubMenuName" TEXT NOT NULL,
    "MenuId" TEXT NOT NULL,
    "Priority" INTEGER NOT NULL,
    "Icon" TEXT,
    "Routes" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BankDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "IFSCode" TEXT NOT NULL,
    "accountNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "FixAmount" INTEGER NOT NULL,
    "VariableAmount" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "remark" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "PaidTo" TEXT NOT NULL,
    "PaidBy" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" "public"."BillStatus" NOT NULL DEFAULT 'NOT_INITIATED',

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attendance" (
    "id" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "PunchInAt" TEXT,
    "PunchOutAt" TEXT,
    "status" "public"."AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "PunchInLocation" TEXT,
    "punchOutLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignedTo" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_EmplyID_key" ON "public"."User"("EmplyID");

-- CreateIndex
CREATE INDEX "webUserRight_Role_idx" ON "public"."webUserRight"("Role");

-- CreateIndex
CREATE INDEX "webUserRight_SubMenuId_idx" ON "public"."webUserRight"("SubMenuId");

-- CreateIndex
CREATE INDEX "webUserRight_isAccessBy_idx" ON "public"."webUserRight"("isAccessBy");

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_userId_key" ON "public"."BankDetails"("userId");

-- CreateIndex
CREATE INDEX "Payment_paidAt_idx" ON "public"."Payment"("paidAt");

-- CreateIndex
CREATE INDEX "Attendance_UserId_idx" ON "public"."Attendance"("UserId");

-- CreateIndex
CREATE INDEX "Task_assignedTo_idx" ON "public"."Task"("assignedTo");

-- CreateIndex
CREATE INDEX "Task_assignedBy_idx" ON "public"."Task"("assignedBy");

-- AddForeignKey
ALTER TABLE "public"."Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."webUserRight" ADD CONSTRAINT "webUserRight_SubMenuId_fkey" FOREIGN KEY ("SubMenuId") REFERENCES "public"."SubMenu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubMenu" ADD CONSTRAINT "SubMenu_MenuId_fkey" FOREIGN KEY ("MenuId") REFERENCES "public"."Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BankDetails" ADD CONSTRAINT "BankDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_PaidTo_fkey" FOREIGN KEY ("PaidTo") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_PaidBy_fkey" FOREIGN KEY ("PaidBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
