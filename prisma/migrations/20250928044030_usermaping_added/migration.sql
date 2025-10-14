-- CreateTable
CREATE TABLE "public"."UserMaping" (
    "UserMapingAutoID" TEXT NOT NULL,
    "CreatedByID" TEXT NOT NULL,
    "AssignedToID" TEXT NOT NULL,
    "AssignUserID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserMaping_pkey" PRIMARY KEY ("UserMapingAutoID")
);

-- CreateIndex
CREATE INDEX "UserMaping_AssignedToID_idx" ON "public"."UserMaping"("AssignedToID");

-- CreateIndex
CREATE INDEX "UserMaping_AssignUserID_idx" ON "public"."UserMaping"("AssignUserID");

-- CreateIndex
CREATE INDEX "UserMaping_CreatedByID_idx" ON "public"."UserMaping"("CreatedByID");

-- AddForeignKey
ALTER TABLE "public"."UserMaping" ADD CONSTRAINT "UserMaping_CreatedByID_fkey" FOREIGN KEY ("CreatedByID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserMaping" ADD CONSTRAINT "UserMaping_AssignedToID_fkey" FOREIGN KEY ("AssignedToID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserMaping" ADD CONSTRAINT "UserMaping_AssignUserID_fkey" FOREIGN KEY ("AssignUserID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
