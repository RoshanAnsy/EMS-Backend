-- AlterTable
ALTER TABLE "webUserRight" ADD COLUMN     "MenuId" TEXT,
ADD COLUMN     "isAccessBy" TEXT;

-- CreateIndex
CREATE INDEX "webUserRight_isAccessBy_idx" ON "webUserRight"("isAccessBy");
