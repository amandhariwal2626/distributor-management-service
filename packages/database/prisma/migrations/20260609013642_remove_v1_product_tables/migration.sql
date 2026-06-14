-- ============================================================================
-- Migration: remove_v1_product_tables
-- Drop all v1 product master tables and unused enums
-- ============================================================================
-- Drops 31 tables and 11 enums that were part of the old product master v1
-- These are replaced by the new v2 product master module (18 tables).
-- ============================================================================

-- ============================================================================
-- Drop triggers first
-- ============================================================================
DROP TRIGGER IF EXISTS "trg_product_categories_updated_at" ON "product_categories";
DROP TRIGGER IF EXISTS "trg_product_sub_categories_updated_at" ON "product_sub_categories";
DROP TRIGGER IF EXISTS "trg_brands_updated_at" ON "brands";
DROP TRIGGER IF EXISTS "trg_manufacturers_updated_at" ON "manufacturers";
DROP TRIGGER IF EXISTS "trg_uoms_updated_at" ON "uoms";
DROP TRIGGER IF EXISTS "trg_tax_groups_updated_at" ON "tax_groups";
DROP TRIGGER IF EXISTS "trg_products_updated_at" ON "products";
DROP TRIGGER IF EXISTS "trg_product_uom_conversions_updated_at" ON "product_uom_conversions";
DROP TRIGGER IF EXISTS "trg_product_prices_updated_at" ON "product_prices";
DROP TRIGGER IF EXISTS "trg_product_images_updated_at" ON "product_images";
DROP TRIGGER IF EXISTS "trg_product_documents_updated_at" ON "product_documents";
DROP TRIGGER IF EXISTS "trg_attribute_definitions_updated_at" ON "attribute_definitions";
DROP TRIGGER IF EXISTS "trg_product_attribute_values_updated_at" ON "product_attribute_values";
DROP TRIGGER IF EXISTS "trg_product_tags_updated_at" ON "product_tags";
DROP TRIGGER IF EXISTS "trg_product_tag_mappings_updated_at" ON "product_tag_mappings";
DROP TRIGGER IF EXISTS "trg_product_warehouses_updated_at" ON "product_warehouses";
DROP TRIGGER IF EXISTS "trg_product_approvals_updated_at" ON "product_approvals";

DROP FUNCTION IF EXISTS "product_master_v2_updated_at"();

-- ============================================================================
-- Drop v1 product master tables (reverse dependency order)
-- ============================================================================

-- Workflow
DROP TABLE IF EXISTS "WorkflowHistory" CASCADE;
DROP TABLE IF EXISTS "WorkflowInstance" CASCADE;

-- Upload
DROP TABLE IF EXISTS "UploadError" CASCADE;
DROP TABLE IF EXISTS "UploadStaging" CASCADE;
DROP TABLE IF EXISTS "UploadJob" CASCADE;

-- Substitutions, Bundles
DROP TABLE IF EXISTS "ProductSubstitution" CASCADE;
DROP TABLE IF EXISTS "ProductBundleItem" CASCADE;
DROP TABLE IF EXISTS "ProductBundle" CASCADE;

-- Prices
DROP TABLE IF EXISTS "ProductPriceHistory" CASCADE;
DROP TABLE IF EXISTS "ProductPriceMaster" CASCADE;

-- Documents
DROP TABLE IF EXISTS "DocumentVersion" CASCADE;
DROP TABLE IF EXISTS "ProductDocument" CASCADE;

-- Attributes
DROP TABLE IF EXISTS "ProductAttributeMapping" CASCADE;
DROP TABLE IF EXISTS "AttributeMaster" CASCADE;

-- Tax
DROP TABLE IF EXISTS "ProductTax" CASCADE;
DROP TABLE IF EXISTS "GstSlabMaster" CASCADE;
DROP TABLE IF EXISTS "HsnMaster" CASCADE;

-- Geography
DROP TABLE IF EXISTS "ProductGeographyMapping" CASCADE;
DROP TABLE IF EXISTS "DepotMaster" CASCADE;
DROP TABLE IF EXISTS "RegionMaster" CASCADE;
DROP TABLE IF EXISTS "ZoneMaster" CASCADE;
DROP TABLE IF EXISTS "StateMaster" CASCADE;
DROP TABLE IF EXISTS "CountryMaster" CASCADE;

-- Core product
DROP TABLE IF EXISTS "ProductMaster" CASCADE;

-- Hierarchy
DROP TABLE IF EXISTS "VariantMaster" CASCADE;
DROP TABLE IF EXISTS "SubbrandMaster" CASCADE;
DROP TABLE IF EXISTS "BrandMaster" CASCADE;
DROP TABLE IF EXISTS "SubcategoryMaster" CASCADE;
DROP TABLE IF EXISTS "CategoryMaster" CASCADE;
DROP TABLE IF EXISTS "Division" CASCADE;
DROP TABLE IF EXISTS "BusinessUnit" CASCADE;

-- ============================================================================
-- Drop unused v1 ENUMs
-- ============================================================================
DROP TYPE IF EXISTS "ProductStatus" CASCADE;
DROP TYPE IF EXISTS "AvailabilityStatus" CASCADE;
DROP TYPE IF EXISTS "PriceStatus" CASCADE;
DROP TYPE IF EXISTS "WorkflowState" CASCADE;
DROP TYPE IF EXISTS "WorkflowEntityType" CASCADE;
DROP TYPE IF EXISTS "UploadStatus" CASCADE;
DROP TYPE IF EXISTS "AttributeType" CASCADE;
DROP TYPE IF EXISTS "DocumentCategory" CASCADE;
DROP TYPE IF EXISTS "SubstitutionType" CASCADE;
DROP TYPE IF EXISTS "BundleType" CASCADE;
DROP TYPE IF EXISTS "TaxType" CASCADE;

-- ============================================================================
-- Migration complete
-- ============================================================================
