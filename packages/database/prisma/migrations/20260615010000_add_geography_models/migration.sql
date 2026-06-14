-- Create geography tables: countries, states, zones, regions, depots, product_geography_mappings

CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iso_code" TEXT,
    "currency" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "states" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gst_code" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "zones" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "state_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "zone_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "depots" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "pincode" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    CONSTRAINT "depots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "product_geography_mappings" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "country_id" TEXT,
    "state_id" TEXT,
    "zone_id" TEXT,
    "region_id" TEXT,
    "depot_id" TEXT,
    "availability_status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "launch_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    CONSTRAINT "product_geography_mappings_pkey" PRIMARY KEY ("id")
);

-- Unique constraints
CREATE UNIQUE INDEX "countries_company_id_code_key" ON "countries"("company_id", "code");
CREATE UNIQUE INDEX "states_company_id_code_key" ON "states"("company_id", "code");
CREATE UNIQUE INDEX "zones_company_id_code_key" ON "zones"("company_id", "code");
CREATE UNIQUE INDEX "regions_company_id_code_key" ON "regions"("company_id", "code");
CREATE UNIQUE INDEX "depots_company_id_code_key" ON "depots"("company_id", "code");
CREATE UNIQUE INDEX "product_geography_mappings_company_product_geo_key" ON "product_geography_mappings"("company_id", "product_id", "country_id", "state_id", "zone_id", "region_id", "depot_id");

-- Indexes
CREATE INDEX "countries_company_id_idx" ON "countries"("company_id");
CREATE INDEX "states_company_id_idx" ON "states"("company_id");
CREATE INDEX "states_company_id_country_id_idx" ON "states"("company_id", "country_id");
CREATE INDEX "zones_company_id_idx" ON "zones"("company_id");
CREATE INDEX "zones_company_id_state_id_idx" ON "zones"("company_id", "state_id");
CREATE INDEX "regions_company_id_idx" ON "regions"("company_id");
CREATE INDEX "regions_company_id_zone_id_idx" ON "regions"("company_id", "zone_id");
CREATE INDEX "depots_company_id_idx" ON "depots"("company_id");
CREATE INDEX "depots_company_id_region_id_idx" ON "depots"("company_id", "region_id");
CREATE INDEX "product_geography_mappings_company_id_idx" ON "product_geography_mappings"("company_id");
CREATE INDEX "product_geography_mappings_company_id_product_id_idx" ON "product_geography_mappings"("company_id", "product_id");

-- Foreign keys
ALTER TABLE "countries" ADD CONSTRAINT "countries_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "states" ADD CONSTRAINT "states_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "states" ADD CONSTRAINT "states_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "zones" ADD CONSTRAINT "zones_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "zones" ADD CONSTRAINT "zones_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "regions" ADD CONSTRAINT "regions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "regions" ADD CONSTRAINT "regions_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "depots" ADD CONSTRAINT "depots_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "depots" ADD CONSTRAINT "depots_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_geography_mappings" ADD CONSTRAINT "pgm_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_geography_mappings" ADD CONSTRAINT "pgm_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
