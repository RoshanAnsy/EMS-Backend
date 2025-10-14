-- CreateTable
CREATE TABLE "public"."paymentReceipt" (
    "PaymentReceiptID" TEXT NOT NULL,
    "FixAmount" BOOLEAN NOT NULL DEFAULT false,
    "VariableAmount" BOOLEAN NOT NULL DEFAULT false,
    "TotalAmount" BOOLEAN NOT NULL DEFAULT false,
    "Tds" BOOLEAN NOT NULL DEFAULT false,
    "AnyTax" BOOLEAN NOT NULL DEFAULT false,
    "TravelCost" BOOLEAN NOT NULL DEFAULT false,
    "OtherCost" BOOLEAN NOT NULL DEFAULT false,
    "FoodAllowanceCost" BOOLEAN NOT NULL DEFAULT false,
    "MedicleInsuranceCost" BOOLEAN NOT NULL DEFAULT false,
    "PFAmount" BOOLEAN NOT NULL DEFAULT false,
    "GratuityAmount" BOOLEAN NOT NULL DEFAULT false,
    "LaultyAmount" BOOLEAN NOT NULL DEFAULT false,
    "MisleneousAmount" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "updatedBY" TEXT NOT NULL,

    CONSTRAINT "paymentReceipt_pkey" PRIMARY KEY ("PaymentReceiptID")
);
