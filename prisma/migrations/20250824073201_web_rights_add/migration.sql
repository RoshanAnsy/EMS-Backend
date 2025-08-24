-- CreateTable
CREATE TABLE "webUserRight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "Role" "Role" NOT NULL,
    "MenuId" TEXT NOT NULL,
    "SubMenuId" TEXT,
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

-- CreateIndex
CREATE INDEX "webUserRight_userId_idx" ON "webUserRight"("userId");

-- CreateIndex
CREATE INDEX "webUserRight_Role_idx" ON "webUserRight"("Role");

-- CreateIndex
CREATE INDEX "webUserRight_MenuId_idx" ON "webUserRight"("MenuId");

-- CreateIndex
CREATE INDEX "webUserRight_SubMenuId_idx" ON "webUserRight"("SubMenuId");

-- AddForeignKey
ALTER TABLE "webUserRight" ADD CONSTRAINT "webUserRight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webUserRight" ADD CONSTRAINT "webUserRight_MenuId_fkey" FOREIGN KEY ("MenuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webUserRight" ADD CONSTRAINT "webUserRight_SubMenuId_fkey" FOREIGN KEY ("SubMenuId") REFERENCES "SubMenu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
