-- ============================================================================
-- Migration: add_multitenancy_to_product_master
-- Adds company_id to all product master v2 tables for tenant isolation
-- ============================================================================
-- Drops old non-scoped unique indexes, adds company_id column,
-- creates tenant-aware unique constraints + indexes.
-- ============================================================================

-- ============================================================================
-- 1. DROP OLD UNIQUE INDEXES (non-tenant-scoped) THAT CONFLICT
-- ============================================================================

DROP INDEX IF EXISTS "product_categories_category_code_key";
DROP INDEX IF EXISTS "product_sub_categories_sub_category_code_key";
DROP INDEX IF EXISTS "brands_brand_code_key";
DROP INDEX IF EXISTS "manufacturers_manufacturer_code_key";
DROP INDEX IF EXISTS "uoms_uom_code_key";
DROP INDEX IF EXISTS "tax_groups_tax_code_key";
DROP INDEX IF EXISTS "products_product_code_key";
DROP INDEX IF EXISTS "product_uom_conversions_product_id_from_uom_id_to_uom_id_key";
DROP INDEX IF EXISTS "attribute_definitions_attribute_code_key";
DROP INDEX IF EXISTS "product_attribute_values_product_id_attribute_id_key";
DROP INDEX IF EXISTS "product_tags_tag_name_key";
DROP INDEX IF EXISTS "product_tag_mappings_product_id_tag_id_key";
DROP INDEX IF EXISTS "product_warehouses_product_id_warehouse_id_key";

-- ============================================================================
-- 2. DROP OLD STANDALONE INDEXES (replaced by company_id-scoped versions)
-- ============================================================================

DROP INDEX IF EXISTS "product_categories_category_name_idx";
DROP INDEX IF EXISTS "product_sub_categories_category_id_idx";
DROP INDEX IF EXISTS "product_sub_categories_sub_category_name_idx";
DROP INDEX IF EXISTS "brands_brand_name_idx";
DROP INDEX IF EXISTS "manufacturers_manufacturer_name_idx";
DROP INDEX IF EXISTS "manufacturers_gst_number_idx";
DROP INDEX IF EXISTS "products_product_name_idx";
DROP INDEX IF EXISTS "products_barcode_idx";
DROP INDEX IF EXISTS "products_category_id_idx";
DROP INDEX IF EXISTS "products_brand_id_idx";
DROP INDEX IF EXISTS "products_manufacturer_id_idx";
DROP INDEX IF EXISTS "products_uom_id_idx";
DROP INDEX IF EXISTS "products_hsn_code_idx";
DROP INDEX IF EXISTS "products_status_idx";
DROP INDEX IF EXISTS "products_sku_type_idx";
DROP INDEX IF EXISTS "product_prices_effective_from_idx";
DROP INDEX IF EXISTS "product_prices_effective_to_idx";
DROP INDEX IF EXISTS "product_audit_logs_changed_at_idx";
DROP INDEX IF EXISTS "product_audit_logs_table_name_record_id_idx";
DROP INDEX IF EXISTS "product_audit_logs_action_idx";
DROP INDEX IF EXISTS "product_audit_logs_changed_by_idx";

-- Drop old v2 product images primary image unique index (will recreate scoped)
DROP INDEX IF EXISTS "product_images_product_id_is_primary_key";

-- ============================================================================
-- 3. ADD company_id COLUMNS + FOREIGN KEYS
-- ============================================================================

ALTER TABLE "product_categories" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_categories" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "product_sub_categories" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_sub_categories" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "brands" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "brands" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "manufacturers" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "manufacturers" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "uoms" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "uoms" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "tax_groups" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "tax_groups" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "products" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "products" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "product_uom_conversions" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_uom_conversions" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "product_prices" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_prices" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "product_images" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_images" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "product_documents" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_documents" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "attribute_definitions" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "attribute_definitions" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "product_attribute_values" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_attribute_values" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "product_tags" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_tags" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "product_tag_mappings" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_tag_mappings" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "product_warehouses" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_warehouses" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "product_audit_logs" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_audit_logs" ALTER COLUMN "company_id" DROP DEFAULT;

ALTER TABLE "product_approvals" ADD COLUMN "company_id" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "product_approvals" ALTER COLUMN "company_id" DROP DEFAULT;

-- ============================================================================
-- 4. ADD FOREIGN KEY CONSTRAINTS company_id -> organizations(id)
-- ============================================================================

ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_sub_categories" ADD CONSTRAINT "product_sub_categories_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "brands" ADD CONSTRAINT "brands_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "manufacturers" ADD CONSTRAINT "manufacturers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "uoms" ADD CONSTRAINT "uoms_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "tax_groups" ADD CONSTRAINT "tax_groups_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "products" ADD CONSTRAINT "products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_uom_conversions" ADD CONSTRAINT "product_uom_conversions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_documents" ADD CONSTRAINT "product_documents_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "attribute_definitions" ADD CONSTRAINT "attribute_definitions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_tag_mappings" ADD CONSTRAINT "product_tag_mappings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_warehouses" ADD CONSTRAINT "product_warehouses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_audit_logs" ADD CONSTRAINT "product_audit_logs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_approvals" ADD CONSTRAINT "product_approvals_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Organization"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

-- ============================================================================
-- 5. ADD TENANT-AWARE UNIQUE CONSTRAINTS
-- ============================================================================

ALTER TABLE "product_categories" ADD CONSTRAINT "ux_product_categories_company_code" UNIQUE ("company_id", "category_code");
ALTER TABLE "product_sub_categories" ADD CONSTRAINT "ux_product_sub_categories_company_code" UNIQUE ("company_id", "sub_category_code");
ALTER TABLE "brands" ADD CONSTRAINT "ux_brands_company_code" UNIQUE ("company_id", "brand_code");
ALTER TABLE "manufacturers" ADD CONSTRAINT "ux_manufacturers_company_code" UNIQUE ("company_id", "manufacturer_code");
ALTER TABLE "uoms" ADD CONSTRAINT "ux_uoms_company_code" UNIQUE ("company_id", "uom_code");
ALTER TABLE "tax_groups" ADD CONSTRAINT "ux_tax_groups_company_code" UNIQUE ("company_id", "tax_code");
ALTER TABLE "products" ADD CONSTRAINT "ux_products_company_code" UNIQUE ("company_id", "product_code");
ALTER TABLE "product_uom_conversions" ADD CONSTRAINT "ux_product_uom_conversions_company" UNIQUE ("company_id", "product_id", "from_uom_id", "to_uom_id");
ALTER TABLE "attribute_definitions" ADD CONSTRAINT "ux_attribute_definitions_company_code" UNIQUE ("company_id", "attribute_code");
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "ux_product_attribute_values_company" UNIQUE ("company_id", "product_id", "attribute_id");
ALTER TABLE "product_tags" ADD CONSTRAINT "ux_product_tags_company_name" UNIQUE ("company_id", "tag_name");
ALTER TABLE "product_tag_mappings" ADD CONSTRAINT "ux_product_tag_mappings_company" UNIQUE ("company_id", "product_id", "tag_id");
ALTER TABLE "product_warehouses" ADD CONSTRAINT "ux_product_warehouses_company" UNIQUE ("company_id", "product_id", "warehouse_id");

-- ============================================================================
-- 6. ADD TENANT-AWARE INDEXES
-- ============================================================================

-- product_categories
CREATE INDEX "product_categories_company_id_category_name_idx" ON "product_categories"("company_id", "category_name");
CREATE INDEX "product_categories_company_id_status_idx" ON "product_categories"("company_id", "status");
CREATE INDEX "product_categories_company_id_idx" ON "product_categories"("company_id");

-- product_sub_categories
CREATE INDEX "product_sub_categories_company_id_category_id_idx" ON "product_sub_categories"("company_id", "category_id");
CREATE INDEX "product_sub_categories_company_id_sub_category_name_idx" ON "product_sub_categories"("company_id", "sub_category_name");
CREATE INDEX "product_sub_categories_company_id_idx" ON "product_sub_categories"("company_id");

-- brands
CREATE INDEX "brands_company_id_brand_name_idx" ON "brands"("company_id", "brand_name");
CREATE INDEX "brands_company_id_status_idx" ON "brands"("company_id", "status");
CREATE INDEX "brands_company_id_idx" ON "brands"("company_id");

-- manufacturers
CREATE INDEX "manufacturers_company_id_manufacturer_name_idx" ON "manufacturers"("company_id", "manufacturer_name");
CREATE INDEX "manufacturers_company_id_status_idx" ON "manufacturers"("company_id", "status");
CREATE INDEX "manufacturers_company_id_idx" ON "manufacturers"("company_id");

-- uoms
CREATE INDEX "uoms_company_id_uom_name_idx" ON "uoms"("company_id", "uom_name");
CREATE INDEX "uoms_company_id_idx" ON "uoms"("company_id");

-- tax_groups
CREATE INDEX "tax_groups_company_id_tax_name_idx" ON "tax_groups"("company_id", "tax_name");
CREATE INDEX "tax_groups_company_id_status_idx" ON "tax_groups"("company_id", "status");
CREATE INDEX "tax_groups_company_id_idx" ON "tax_groups"("company_id");

-- products
CREATE INDEX "products_company_id_product_name_idx" ON "products"("company_id", "product_name");
CREATE INDEX "products_company_id_category_id_idx" ON "products"("company_id", "category_id");
CREATE INDEX "products_company_id_brand_id_idx" ON "products"("company_id", "brand_id");
CREATE INDEX "products_company_id_manufacturer_id_idx" ON "products"("company_id", "manufacturer_id");
CREATE INDEX "products_company_id_uom_id_idx" ON "products"("company_id", "uom_id");
CREATE INDEX "products_company_id_hsn_code_idx" ON "products"("company_id", "hsn_code");
CREATE INDEX "products_company_id_barcode_idx" ON "products"("company_id", "barcode");
CREATE INDEX "products_company_id_status_idx" ON "products"("company_id", "status");
CREATE INDEX "products_company_id_sku_type_idx" ON "products"("company_id", "sku_type");
CREATE INDEX "products_company_id_idx" ON "products"("company_id");

-- product_uom_conversions
CREATE INDEX "product_uom_conversions_company_id_product_id_idx" ON "product_uom_conversions"("company_id", "product_id");
CREATE INDEX "product_uom_conversions_company_id_idx" ON "product_uom_conversions"("company_id");

-- product_prices
CREATE INDEX "product_prices_company_id_product_id_idx" ON "product_prices"("company_id", "product_id");
CREATE INDEX "product_prices_company_id_effective_from_idx" ON "product_prices"("company_id", "effective_from");
CREATE INDEX "product_prices_company_id_idx" ON "product_prices"("company_id");

-- product_images
CREATE INDEX "product_images_company_id_product_id_idx" ON "product_images"("company_id", "product_id");
CREATE INDEX "product_images_company_id_is_primary_idx" ON "product_images"("company_id", "is_primary");
CREATE INDEX "product_images_company_id_idx" ON "product_images"("company_id");

-- product_documents
CREATE INDEX "product_documents_company_id_product_id_idx" ON "product_documents"("company_id", "product_id");
CREATE INDEX "product_documents_company_id_document_type_idx" ON "product_documents"("company_id", "document_type");
CREATE INDEX "product_documents_company_id_idx" ON "product_documents"("company_id");

-- attribute_definitions
CREATE INDEX "attribute_definitions_company_id_data_type_idx" ON "attribute_definitions"("company_id", "data_type");
CREATE INDEX "attribute_definitions_company_id_idx" ON "attribute_definitions"("company_id");

-- product_attribute_values
CREATE INDEX "product_attribute_values_company_id_product_id_idx" ON "product_attribute_values"("company_id", "product_id");
CREATE INDEX "product_attribute_values_company_id_idx" ON "product_attribute_values"("company_id");

-- product_tags
CREATE INDEX "product_tags_company_id_idx" ON "product_tags"("company_id");

-- product_tag_mappings
CREATE INDEX "product_tag_mappings_company_id_product_id_idx" ON "product_tag_mappings"("company_id", "product_id");
CREATE INDEX "product_tag_mappings_company_id_idx" ON "product_tag_mappings"("company_id");

-- product_warehouses
CREATE INDEX "product_warehouses_company_id_product_id_idx" ON "product_warehouses"("company_id", "product_id");
CREATE INDEX "product_warehouses_company_id_warehouse_id_idx" ON "product_warehouses"("company_id", "warehouse_id");
CREATE INDEX "product_warehouses_company_id_idx" ON "product_warehouses"("company_id");

-- product_audit_logs
CREATE INDEX "product_audit_logs_company_id_changed_at_idx" ON "product_audit_logs"("company_id", "changed_at");
CREATE INDEX "product_audit_logs_company_id_table_name_record_id_idx" ON "product_audit_logs"("company_id", "table_name", "record_id");
CREATE INDEX "product_audit_logs_company_id_idx" ON "product_audit_logs"("company_id");

-- product_approvals
CREATE INDEX "product_approvals_company_id_product_id_idx" ON "product_approvals"("company_id", "product_id");
CREATE INDEX "product_approvals_company_id_approval_status_idx" ON "product_approvals"("company_id", "approval_status");
CREATE INDEX "product_approvals_company_id_idx" ON "product_approvals"("company_id");
