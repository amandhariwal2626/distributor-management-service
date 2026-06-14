-- Create BusinessUnit table
CREATE TABLE "business_units" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "business_units_pkey" PRIMARY KEY ("id")
);

-- Create Division table
CREATE TABLE "divisions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "business_unit_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("id")
);

-- Create SubBrand table
CREATE TABLE "sub_brands" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "sub_brands_pkey" PRIMARY KEY ("id")
);

-- Unique constraints (scoped by company_id)
CREATE UNIQUE INDEX "business_units_company_id_code_key" ON "business_units"("company_id", "code");
CREATE UNIQUE INDEX "divisions_company_id_code_key" ON "divisions"("company_id", "code");
CREATE UNIQUE INDEX "sub_brands_company_id_code_key" ON "sub_brands"("company_id", "code");

-- Indexes
CREATE INDEX "business_units_company_id_idx" ON "business_units"("company_id");
CREATE INDEX "divisions_company_id_idx" ON "divisions"("company_id");
CREATE INDEX "divisions_company_id_business_unit_id_idx" ON "divisions"("company_id", "business_unit_id");
CREATE INDEX "sub_brands_company_id_idx" ON "sub_brands"("company_id");
CREATE INDEX "sub_brands_company_id_brand_id_idx" ON "sub_brands"("company_id", "brand_id");

-- Foreign keys
ALTER TABLE "business_units" ADD CONSTRAINT "business_units_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "divisions" ADD CONSTRAINT "divisions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "divisions" ADD CONSTRAINT "divisions_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sub_brands" ADD CONSTRAINT "sub_brands_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sub_brands" ADD CONSTRAINT "sub_brands_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
