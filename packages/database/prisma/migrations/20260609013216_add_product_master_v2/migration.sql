-- ============================================================================
-- Migration: add_product_master_v2
-- Enterprise Product Master Module - 18 New Tables
-- ============================================================================
-- This migration adds 5 new ENUMs and 18 new tables for the product master
-- module v2, alongside existing product master v1 tables.
-- ============================================================================

-- ============================================================================
-- NEW ENUMS
-- ============================================================================

CREATE TYPE "product_status_enum" AS ENUM ('draft', 'active', 'inactive');

CREATE TYPE "product_type_enum" AS ENUM ('finished_good', 'raw_material', 'service');

CREATE TYPE "approval_status_enum" AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE "attribute_data_type_enum" AS ENUM ('text', 'number', 'boolean', 'date', 'dropdown');

CREATE TYPE "audit_action_enum" AS ENUM ('create', 'update', 'soft_delete', 'restore');

-- ============================================================================
-- TABLE: product_categories
-- ============================================================================
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "category_code" VARCHAR(50) NOT NULL,
    "category_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: product_sub_categories
-- ============================================================================
CREATE TABLE "product_sub_categories" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "sub_category_code" VARCHAR(50) NOT NULL,
    "sub_category_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "product_sub_categories_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: brands
-- ============================================================================
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "brand_code" VARCHAR(50) NOT NULL,
    "brand_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: manufacturers
-- ============================================================================
CREATE TABLE "manufacturers" (
    "id" TEXT NOT NULL,
    "manufacturer_code" VARCHAR(50) NOT NULL,
    "manufacturer_name" VARCHAR(255) NOT NULL,
    "gst_number" VARCHAR(20),
    "contact_person" VARCHAR(255),
    "email" TEXT,
    "phone" VARCHAR(30),
    "address" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "manufacturers_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: uoms
-- ============================================================================
CREATE TABLE "uoms" (
    "id" TEXT NOT NULL,
    "uom_code" VARCHAR(20) NOT NULL,
    "uom_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "uoms_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: tax_groups
-- ============================================================================
CREATE TABLE "tax_groups" (
    "id" TEXT NOT NULL,
    "tax_code" VARCHAR(50) NOT NULL,
    "tax_name" VARCHAR(255) NOT NULL,
    "cgst" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "sgst" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "igst" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "cess" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "tax_groups_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_tax_cgst_non_negative" CHECK ("cgst" >= 0),
    CONSTRAINT "chk_tax_sgst_non_negative" CHECK ("sgst" >= 0),
    CONSTRAINT "chk_tax_igst_non_negative" CHECK ("igst" >= 0),
    CONSTRAINT "chk_tax_cess_non_negative" CHECK ("cess" >= 0)
);

-- ============================================================================
-- TABLE: products
-- ============================================================================
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "product_code" VARCHAR(50) NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "short_name" VARCHAR(100),
    "description" TEXT,
    "category_id" TEXT,
    "sub_category_id" TEXT,
    "brand_id" TEXT,
    "manufacturer_id" TEXT,
    "uom_id" TEXT NOT NULL,
    "tax_group_id" TEXT,
    "barcode" VARCHAR(100),
    "hsn_code" VARCHAR(20),
    "sku_type" "product_type_enum" NOT NULL DEFAULT 'finished_good',
    "shelf_life_days" INTEGER,
    "reorder_level" INTEGER,
    "image_url" TEXT,
    "status" "product_status_enum" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: product_uom_conversions
-- ============================================================================
CREATE TABLE "product_uom_conversions" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "from_uom_id" TEXT NOT NULL,
    "to_uom_id" TEXT NOT NULL,
    "conversion_factor" DECIMAL(18,6) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "product_uom_conversions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_conversion_factor_positive" CHECK ("conversion_factor" > 0)
);

-- ============================================================================
-- TABLE: product_prices
-- ============================================================================
CREATE TABLE "product_prices" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "mrp" DECIMAL(18,2) NOT NULL,
    "ptr" DECIMAL(18,2) NOT NULL,
    "pts" DECIMAL(18,2) NOT NULL,
    "distributor_price" DECIMAL(18,2) NOT NULL,
    "effective_from" DATE NOT NULL,
    "effective_to" DATE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "product_prices_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: product_images
-- ============================================================================
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "file_name" VARCHAR(255),
    "file_path" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: product_documents
-- ============================================================================
CREATE TABLE "product_documents" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "document_type" VARCHAR(100) NOT NULL,
    "file_name" VARCHAR(255),
    "file_path" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "product_documents_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: attribute_definitions
-- ============================================================================
CREATE TABLE "attribute_definitions" (
    "id" TEXT NOT NULL,
    "attribute_name" VARCHAR(100) NOT NULL,
    "attribute_code" VARCHAR(100) NOT NULL,
    "data_type" "attribute_data_type_enum" NOT NULL DEFAULT 'text',
    "mandatory" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "attribute_definitions_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: product_attribute_values
-- ============================================================================
CREATE TABLE "product_attribute_values" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "attribute_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "product_attribute_values_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: product_tags
-- ============================================================================
CREATE TABLE "product_tags" (
    "id" TEXT NOT NULL,
    "tag_name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: product_tag_mappings
-- ============================================================================
CREATE TABLE "product_tag_mappings" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "product_tag_mappings_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: product_warehouses
-- ============================================================================
CREATE TABLE "product_warehouses" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "min_stock" INTEGER NOT NULL DEFAULT 0,
    "max_stock" INTEGER NOT NULL DEFAULT 0,
    "reorder_level" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "product_warehouses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_min_stock_non_negative" CHECK ("min_stock" >= 0),
    CONSTRAINT "chk_max_stock_gte_min_stock" CHECK ("max_stock" >= "min_stock"),
    CONSTRAINT "chk_reorder_level_non_negative" CHECK ("reorder_level" >= 0)
);

-- ============================================================================
-- TABLE: product_audit_logs
-- ============================================================================
CREATE TABLE "product_audit_logs" (
    "id" TEXT NOT NULL,
    "table_name" VARCHAR(100) NOT NULL,
    "record_id" TEXT NOT NULL,
    "action" "audit_action_enum" NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,
    "changed_by" TEXT,
    "changed_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "product_audit_logs_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- TABLE: product_approvals
-- ============================================================================
CREATE TABLE "product_approvals" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "workflow_id" TEXT,
    "approval_status" "approval_status_enum" NOT NULL DEFAULT 'pending',
    "approved_by" TEXT,
    "approved_at" TIMESTAMP,
    "remarks" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP,
    "deleted_by" TEXT,
    CONSTRAINT "product_approvals_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================================================

ALTER TABLE "product_sub_categories" ADD CONSTRAINT "product_sub_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE "products" ADD CONSTRAINT "products_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "product_sub_categories"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturers"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE "products" ADD CONSTRAINT "products_uom_id_fkey" FOREIGN KEY ("uom_id") REFERENCES "uoms"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "products" ADD CONSTRAINT "products_tax_group_id_fkey" FOREIGN KEY ("tax_group_id") REFERENCES "tax_groups"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "product_uom_conversions" ADD CONSTRAINT "product_uom_conversions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_uom_conversions" ADD CONSTRAINT "product_uom_conversions_from_uom_id_fkey" FOREIGN KEY ("from_uom_id") REFERENCES "uoms"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_uom_conversions" ADD CONSTRAINT "product_uom_conversions_to_uom_id_fkey" FOREIGN KEY ("to_uom_id") REFERENCES "uoms"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "product_documents" ADD CONSTRAINT "product_documents_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attribute_definitions"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "product_tag_mappings" ADD CONSTRAINT "product_tag_mappings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "product_tag_mappings" ADD CONSTRAINT "product_tag_mappings_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "product_tags"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "product_warehouses" ADD CONSTRAINT "product_warehouses_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "product_approvals" ADD CONSTRAINT "product_approvals_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

-- ============================================================================
-- INDEXES
-- ============================================================================

-- product_categories
CREATE UNIQUE INDEX "product_categories_category_code_key" ON "product_categories"("category_code");
CREATE INDEX "product_categories_category_name_idx" ON "product_categories"("category_name");
CREATE INDEX "product_categories_deleted_at_idx" ON "product_categories"("deleted_at");

-- product_sub_categories
CREATE UNIQUE INDEX "product_sub_categories_sub_category_code_key" ON "product_sub_categories"("sub_category_code");
CREATE INDEX "product_sub_categories_category_id_idx" ON "product_sub_categories"("category_id");
CREATE INDEX "product_sub_categories_sub_category_name_idx" ON "product_sub_categories"("sub_category_name");
CREATE INDEX "product_sub_categories_deleted_at_idx" ON "product_sub_categories"("deleted_at");

-- brands
CREATE UNIQUE INDEX "brands_brand_code_key" ON "brands"("brand_code");
CREATE INDEX "brands_brand_name_idx" ON "brands"("brand_name");
CREATE INDEX "brands_deleted_at_idx" ON "brands"("deleted_at");

-- manufacturers
CREATE UNIQUE INDEX "manufacturers_manufacturer_code_key" ON "manufacturers"("manufacturer_code");
CREATE INDEX "manufacturers_manufacturer_name_idx" ON "manufacturers"("manufacturer_name");
CREATE INDEX "manufacturers_gst_number_idx" ON "manufacturers"("gst_number");
CREATE INDEX "manufacturers_deleted_at_idx" ON "manufacturers"("deleted_at");

-- uoms
CREATE UNIQUE INDEX "uoms_uom_code_key" ON "uoms"("uom_code");
CREATE INDEX "uoms_uom_name_idx" ON "uoms"("uom_name");
CREATE INDEX "uoms_deleted_at_idx" ON "uoms"("deleted_at");

-- tax_groups
CREATE UNIQUE INDEX "tax_groups_tax_code_key" ON "tax_groups"("tax_code");
CREATE INDEX "tax_groups_deleted_at_idx" ON "tax_groups"("deleted_at");

-- products
CREATE UNIQUE INDEX "products_product_code_key" ON "products"("product_code");
CREATE INDEX "products_product_name_idx" ON "products"("product_name");
CREATE INDEX "products_barcode_idx" ON "products"("barcode");
CREATE INDEX "products_category_id_idx" ON "products"("category_id");
CREATE INDEX "products_brand_id_idx" ON "products"("brand_id");
CREATE INDEX "products_manufacturer_id_idx" ON "products"("manufacturer_id");
CREATE INDEX "products_uom_id_idx" ON "products"("uom_id");
CREATE INDEX "products_hsn_code_idx" ON "products"("hsn_code");
CREATE INDEX "products_status_idx" ON "products"("status");
CREATE INDEX "products_sku_type_idx" ON "products"("sku_type");
CREATE INDEX "products_deleted_at_idx" ON "products"("deleted_at");

-- product_uom_conversions
CREATE UNIQUE INDEX "product_uom_conversions_product_id_from_uom_id_to_uom_id_key" ON "product_uom_conversions"("product_id", "from_uom_id", "to_uom_id");
CREATE INDEX "product_uom_conversions_product_id_idx" ON "product_uom_conversions"("product_id");
CREATE INDEX "product_uom_conversions_from_uom_id_idx" ON "product_uom_conversions"("from_uom_id");
CREATE INDEX "product_uom_conversions_to_uom_id_idx" ON "product_uom_conversions"("to_uom_id");
CREATE INDEX "product_uom_conversions_deleted_at_idx" ON "product_uom_conversions"("deleted_at");

-- product_prices
CREATE INDEX "product_prices_product_id_idx" ON "product_prices"("product_id");
CREATE INDEX "product_prices_effective_from_idx" ON "product_prices"("effective_from");
CREATE INDEX "product_prices_effective_to_idx" ON "product_prices"("effective_to");
CREATE INDEX "product_prices_product_id_effective_from_effective_to_idx" ON "product_prices"("product_id", "effective_from", "effective_to");
CREATE INDEX "product_prices_deleted_at_idx" ON "product_prices"("deleted_at");

-- product_images
CREATE UNIQUE INDEX "product_images_product_id_is_primary_key" ON "product_images"("product_id") WHERE "is_primary" = true;
CREATE INDEX "product_images_product_id_idx" ON "product_images"("product_id");
CREATE INDEX "product_images_deleted_at_idx" ON "product_images"("deleted_at");

-- product_documents
CREATE INDEX "product_documents_product_id_idx" ON "product_documents"("product_id");
CREATE INDEX "product_documents_document_type_idx" ON "product_documents"("document_type");
CREATE INDEX "product_documents_deleted_at_idx" ON "product_documents"("deleted_at");

-- attribute_definitions
CREATE UNIQUE INDEX "attribute_definitions_attribute_code_key" ON "attribute_definitions"("attribute_code");
CREATE INDEX "attribute_definitions_data_type_idx" ON "attribute_definitions"("data_type");
CREATE INDEX "attribute_definitions_deleted_at_idx" ON "attribute_definitions"("deleted_at");

-- product_attribute_values
CREATE UNIQUE INDEX "product_attribute_values_product_id_attribute_id_key" ON "product_attribute_values"("product_id", "attribute_id");
CREATE INDEX "product_attribute_values_product_id_idx" ON "product_attribute_values"("product_id");
CREATE INDEX "product_attribute_values_attribute_id_idx" ON "product_attribute_values"("attribute_id");
CREATE INDEX "product_attribute_values_deleted_at_idx" ON "product_attribute_values"("deleted_at");

-- product_tags
CREATE UNIQUE INDEX "product_tags_tag_name_key" ON "product_tags"("tag_name");
CREATE INDEX "product_tags_deleted_at_idx" ON "product_tags"("deleted_at");

-- product_tag_mappings
CREATE UNIQUE INDEX "product_tag_mappings_product_id_tag_id_key" ON "product_tag_mappings"("product_id", "tag_id");
CREATE INDEX "product_tag_mappings_product_id_idx" ON "product_tag_mappings"("product_id");
CREATE INDEX "product_tag_mappings_tag_id_idx" ON "product_tag_mappings"("tag_id");
CREATE INDEX "product_tag_mappings_deleted_at_idx" ON "product_tag_mappings"("deleted_at");

-- product_warehouses
CREATE UNIQUE INDEX "product_warehouses_product_id_warehouse_id_key" ON "product_warehouses"("product_id", "warehouse_id");
CREATE INDEX "product_warehouses_product_id_idx" ON "product_warehouses"("product_id");
CREATE INDEX "product_warehouses_warehouse_id_idx" ON "product_warehouses"("warehouse_id");
CREATE INDEX "product_warehouses_deleted_at_idx" ON "product_warehouses"("deleted_at");

-- product_audit_logs
CREATE INDEX "product_audit_logs_table_name_record_id_idx" ON "product_audit_logs"("table_name", "record_id");
CREATE INDEX "product_audit_logs_changed_at_idx" ON "product_audit_logs"("changed_at");
CREATE INDEX "product_audit_logs_action_idx" ON "product_audit_logs"("action");
CREATE INDEX "product_audit_logs_changed_by_idx" ON "product_audit_logs"("changed_by");

-- product_approvals
CREATE INDEX "product_approvals_product_id_idx" ON "product_approvals"("product_id");
CREATE INDEX "product_approvals_approval_status_idx" ON "product_approvals"("approval_status");
CREATE INDEX "product_approvals_approved_by_idx" ON "product_approvals"("approved_by");
CREATE INDEX "product_approvals_workflow_id_idx" ON "product_approvals"("workflow_id");
CREATE INDEX "product_approvals_deleted_at_idx" ON "product_approvals"("deleted_at");

-- ============================================================================
-- UPDATED AT TRIGGERS (mirroring Prisma's @updatedAt behavior)
-- ============================================================================

CREATE OR REPLACE FUNCTION "product_master_v2_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trg_product_categories_updated_at" BEFORE UPDATE ON "product_categories" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_product_sub_categories_updated_at" BEFORE UPDATE ON "product_sub_categories" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_brands_updated_at" BEFORE UPDATE ON "brands" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_manufacturers_updated_at" BEFORE UPDATE ON "manufacturers" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_uoms_updated_at" BEFORE UPDATE ON "uoms" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_tax_groups_updated_at" BEFORE UPDATE ON "tax_groups" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_products_updated_at" BEFORE UPDATE ON "products" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_product_uom_conversions_updated_at" BEFORE UPDATE ON "product_uom_conversions" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_product_prices_updated_at" BEFORE UPDATE ON "product_prices" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_product_images_updated_at" BEFORE UPDATE ON "product_images" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_product_documents_updated_at" BEFORE UPDATE ON "product_documents" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_attribute_definitions_updated_at" BEFORE UPDATE ON "attribute_definitions" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_product_attribute_values_updated_at" BEFORE UPDATE ON "product_attribute_values" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_product_tags_updated_at" BEFORE UPDATE ON "product_tags" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_product_tag_mappings_updated_at" BEFORE UPDATE ON "product_tag_mappings" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_product_warehouses_updated_at" BEFORE UPDATE ON "product_warehouses" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
CREATE TRIGGER "trg_product_approvals_updated_at" BEFORE UPDATE ON "product_approvals" FOR EACH ROW EXECUTE FUNCTION "product_master_v2_updated_at"();
