/*
  Warnings:

  - You are about to drop the `InviteToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordResetToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RevokedToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "session_status_enum" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "user_status_enum" AS ENUM ('ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "gender_enum" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- DropForeignKey
ALTER TABLE "InviteToken" DROP CONSTRAINT "InviteToken_inviteSentBy_fkey";

-- DropForeignKey
ALTER TABLE "InviteToken" DROP CONSTRAINT "InviteToken_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "InviteToken" DROP CONSTRAINT "InviteToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "RevokedToken" DROP CONSTRAINT "RevokedToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_distributorId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_reportingManagerId_fkey";

-- DropForeignKey
ALTER TABLE "UserAuditLog" DROP CONSTRAINT "UserAuditLog_actorId_fkey";

-- DropForeignKey
ALTER TABLE "UserAuditLog" DROP CONSTRAINT "UserAuditLog_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropForeignKey
ALTER TABLE "attribute_definitions" DROP CONSTRAINT "attribute_definitions_company_id_fkey";

-- DropForeignKey
ALTER TABLE "brands" DROP CONSTRAINT "brands_company_id_fkey";

-- DropForeignKey
ALTER TABLE "manufacturers" DROP CONSTRAINT "manufacturers_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_approvals" DROP CONSTRAINT "product_approvals_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_attribute_values" DROP CONSTRAINT "product_attribute_values_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_audit_logs" DROP CONSTRAINT "product_audit_logs_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_documents" DROP CONSTRAINT "product_documents_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_prices" DROP CONSTRAINT "product_prices_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_sub_categories" DROP CONSTRAINT "product_sub_categories_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_tag_mappings" DROP CONSTRAINT "product_tag_mappings_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_tags" DROP CONSTRAINT "product_tags_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_uom_conversions" DROP CONSTRAINT "product_uom_conversions_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_warehouses" DROP CONSTRAINT "product_warehouses_company_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_company_id_fkey";

-- DropForeignKey
ALTER TABLE "tax_groups" DROP CONSTRAINT "tax_groups_company_id_fkey";

-- DropForeignKey
ALTER TABLE "uoms" DROP CONSTRAINT "uoms_company_id_fkey";

-- DropIndex
DROP INDEX "attribute_definitions_data_type_idx";

-- DropIndex
DROP INDEX "attribute_definitions_deleted_at_idx";

-- DropIndex
DROP INDEX "brands_deleted_at_idx";

-- DropIndex
DROP INDEX "manufacturers_deleted_at_idx";

-- DropIndex
DROP INDEX "product_approvals_approval_status_idx";

-- DropIndex
DROP INDEX "product_approvals_approved_by_idx";

-- DropIndex
DROP INDEX "product_approvals_deleted_at_idx";

-- DropIndex
DROP INDEX "product_approvals_product_id_idx";

-- DropIndex
DROP INDEX "product_approvals_workflow_id_idx";

-- DropIndex
DROP INDEX "product_attribute_values_attribute_id_idx";

-- DropIndex
DROP INDEX "product_attribute_values_deleted_at_idx";

-- DropIndex
DROP INDEX "product_attribute_values_product_id_idx";

-- DropIndex
DROP INDEX "product_categories_deleted_at_idx";

-- DropIndex
DROP INDEX "product_documents_deleted_at_idx";

-- DropIndex
DROP INDEX "product_documents_document_type_idx";

-- DropIndex
DROP INDEX "product_documents_product_id_idx";

-- DropIndex
DROP INDEX "product_images_deleted_at_idx";

-- DropIndex
DROP INDEX "product_images_product_id_idx";

-- DropIndex
DROP INDEX "product_prices_deleted_at_idx";

-- DropIndex
DROP INDEX "product_prices_product_id_effective_from_effective_to_idx";

-- DropIndex
DROP INDEX "product_prices_product_id_idx";

-- DropIndex
DROP INDEX "product_sub_categories_deleted_at_idx";

-- DropIndex
DROP INDEX "product_tag_mappings_deleted_at_idx";

-- DropIndex
DROP INDEX "product_tag_mappings_product_id_idx";

-- DropIndex
DROP INDEX "product_tag_mappings_tag_id_idx";

-- DropIndex
DROP INDEX "product_tags_deleted_at_idx";

-- DropIndex
DROP INDEX "product_uom_conversions_deleted_at_idx";

-- DropIndex
DROP INDEX "product_uom_conversions_from_uom_id_idx";

-- DropIndex
DROP INDEX "product_uom_conversions_product_id_idx";

-- DropIndex
DROP INDEX "product_uom_conversions_to_uom_id_idx";

-- DropIndex
DROP INDEX "product_warehouses_deleted_at_idx";

-- DropIndex
DROP INDEX "product_warehouses_product_id_idx";

-- DropIndex
DROP INDEX "product_warehouses_warehouse_id_idx";

-- DropIndex
DROP INDEX "products_deleted_at_idx";

-- DropIndex
DROP INDEX "tax_groups_deleted_at_idx";

-- DropIndex
DROP INDEX "uoms_deleted_at_idx";

-- DropIndex
DROP INDEX "uoms_uom_name_idx";

-- AlterTable
ALTER TABLE "attribute_definitions" ALTER COLUMN "attribute_name" SET DATA TYPE TEXT,
ALTER COLUMN "attribute_code" SET DATA TYPE TEXT,
ALTER COLUMN "data_type" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "brands" ALTER COLUMN "brand_code" SET DATA TYPE TEXT,
ALTER COLUMN "brand_name" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "manufacturers" ALTER COLUMN "manufacturer_code" SET DATA TYPE TEXT,
ALTER COLUMN "manufacturer_name" SET DATA TYPE TEXT,
ALTER COLUMN "gst_number" SET DATA TYPE TEXT,
ALTER COLUMN "contact_person" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_approvals" ALTER COLUMN "approval_status" DROP DEFAULT,
ALTER COLUMN "approved_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_attribute_values" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_audit_logs" ALTER COLUMN "table_name" SET DATA TYPE TEXT,
ALTER COLUMN "changed_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_categories" ALTER COLUMN "category_code" SET DATA TYPE TEXT,
ALTER COLUMN "category_name" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_documents" ALTER COLUMN "document_type" SET DATA TYPE TEXT,
ALTER COLUMN "file_name" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_images" ALTER COLUMN "file_name" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_prices" ALTER COLUMN "effective_from" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "effective_to" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_sub_categories" ALTER COLUMN "sub_category_code" SET DATA TYPE TEXT,
ALTER COLUMN "sub_category_name" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_tag_mappings" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_tags" ALTER COLUMN "tag_name" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_uom_conversions" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_warehouses" ALTER COLUMN "min_stock" DROP DEFAULT,
ALTER COLUMN "max_stock" DROP DEFAULT,
ALTER COLUMN "reorder_level" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "product_code" SET DATA TYPE TEXT,
ALTER COLUMN "product_name" SET DATA TYPE TEXT,
ALTER COLUMN "short_name" SET DATA TYPE TEXT,
ALTER COLUMN "barcode" SET DATA TYPE TEXT,
ALTER COLUMN "hsn_code" SET DATA TYPE TEXT,
ALTER COLUMN "sku_type" DROP DEFAULT,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tax_groups" ALTER COLUMN "tax_code" SET DATA TYPE TEXT,
ALTER COLUMN "tax_name" SET DATA TYPE TEXT,
ALTER COLUMN "cgst" DROP DEFAULT,
ALTER COLUMN "sgst" DROP DEFAULT,
ALTER COLUMN "igst" DROP DEFAULT,
ALTER COLUMN "cess" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "uoms" ALTER COLUMN "uom_code" SET DATA TYPE TEXT,
ALTER COLUMN "uom_name" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "InviteToken";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "PasswordResetToken";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "RevokedToken";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "RolePermission";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserAuditLog";

-- DropTable
DROP TABLE "UserPermission";

-- DropTable
DROP TABLE "UserProfile";

-- DropTable
DROP TABLE "UserRole";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "SessionStatus";

-- DropEnum
DROP TYPE "UserStatus";

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_code" TEXT,
    "employee_code" TEXT,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "display_name" TEXT,
    "full_name" TEXT NOT NULL,
    "gender" "gender_enum",
    "dob" TIMESTAMP(3),
    "mobile" TEXT,
    "alternate_mobile" TEXT,
    "emergency_contact" TEXT,
    "address_line1" TEXT,
    "address_line2" TEXT,
    "address_line3" TEXT,
    "country" TEXT,
    "state" TEXT,
    "district" TEXT,
    "city" TEXT,
    "pincode" TEXT,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password_hash" TEXT,
    "status" "user_status_enum" NOT NULL DEFAULT 'ACTIVE',
    "force_password_change" BOOLEAN NOT NULL DEFAULT false,
    "password_expiry_days" INTEGER,
    "two_factor_auth" BOOLEAN NOT NULL DEFAULT false,
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "reporting_manager_id" TEXT,
    "zone" TEXT,
    "region" TEXT,
    "area" TEXT,
    "territory" TEXT,
    "distributor_id" TEXT,
    "deactivated_at" TIMESTAMP(3),
    "deactivated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "status" "session_status_enum" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revoked_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_jti" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revoked_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invite_tokens" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "invited_email" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "invite_sent_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invite_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_audit_logs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "actor_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT,
    "old_value" TEXT,
    "new_value" TEXT,
    "reason" TEXT,
    "actor_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "actor_id" TEXT,
    "ip_address" TEXT,
    "resource" TEXT,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distributor_masters" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gst_number" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "contact_person" TEXT,
    "contact_number" TEXT,
    "email" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "distributor_masters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_code_key" ON "organizations"("code");

-- CreateIndex
CREATE INDEX "organizations_deleted_at_idx" ON "organizations"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_profiles_full_name_idx" ON "user_profiles"("full_name");

-- CreateIndex
CREATE INDEX "users_organization_id_status_idx" ON "users"("organization_id", "status");

-- CreateIndex
CREATE INDEX "users_organization_id_reporting_manager_id_idx" ON "users"("organization_id", "reporting_manager_id");

-- CreateIndex
CREATE INDEX "users_organization_id_distributor_id_idx" ON "users"("organization_id", "distributor_id");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_organization_id_email_key" ON "users"("organization_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_organization_id_username_key" ON "users"("organization_id", "username");

-- CreateIndex
CREATE INDEX "roles_organization_id_idx" ON "roles"("organization_id");

-- CreateIndex
CREATE INDEX "roles_deleted_at_idx" ON "roles"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "roles_organization_id_name_key" ON "roles"("organization_id", "name");

-- CreateIndex
CREATE INDEX "permissions_organization_id_idx" ON "permissions"("organization_id");

-- CreateIndex
CREATE INDEX "permissions_deleted_at_idx" ON "permissions"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_organization_id_code_key" ON "permissions"("organization_id", "code");

-- CreateIndex
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_status_idx" ON "sessions"("user_id", "status");

-- CreateIndex
CREATE INDEX "sessions_organization_id_status_idx" ON "sessions"("organization_id", "status");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_expires_at_idx" ON "password_reset_tokens"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "revoked_tokens_user_id_expires_at_idx" ON "revoked_tokens"("user_id", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "revoked_tokens_token_jti_key" ON "revoked_tokens"("token_jti");

-- CreateIndex
CREATE INDEX "invite_tokens_organization_id_invited_email_idx" ON "invite_tokens"("organization_id", "invited_email");

-- CreateIndex
CREATE INDEX "invite_tokens_expires_at_idx" ON "invite_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "user_permissions_permission_id_idx" ON "user_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_permission_id_key" ON "user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE INDEX "user_audit_logs_organization_id_created_at_idx" ON "user_audit_logs"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "user_audit_logs_entity_type_entity_id_idx" ON "user_audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "user_audit_logs_actor_id_idx" ON "user_audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_logs_company_id_created_at_idx" ON "audit_logs"("company_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "security_events_company_id_created_at_idx" ON "security_events"("company_id", "created_at");

-- CreateIndex
CREATE INDEX "security_events_event_type_idx" ON "security_events"("event_type");

-- CreateIndex
CREATE INDEX "security_events_actor_id_idx" ON "security_events"("actor_id");

-- CreateIndex
CREATE INDEX "security_events_severity_idx" ON "security_events"("severity");

-- CreateIndex
CREATE INDEX "distributor_masters_company_id_idx" ON "distributor_masters"("company_id");

-- CreateIndex
CREATE INDEX "distributor_masters_is_deleted_idx" ON "distributor_masters"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "distributor_masters_company_id_code_key" ON "distributor_masters"("company_id", "code");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_reporting_manager_id_fkey" FOREIGN KEY ("reporting_manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_distributor_id_fkey" FOREIGN KEY ("distributor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revoked_tokens" ADD CONSTRAINT "revoked_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_invite_sent_by_fkey" FOREIGN KEY ("invite_sent_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audit_logs" ADD CONSTRAINT "user_audit_logs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audit_logs" ADD CONSTRAINT "user_audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distributor_masters" ADD CONSTRAINT "distributor_masters_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sub_categories" ADD CONSTRAINT "product_sub_categories_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufacturers" ADD CONSTRAINT "manufacturers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uoms" ADD CONSTRAINT "uoms_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_groups" ADD CONSTRAINT "tax_groups_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_uom_conversions" ADD CONSTRAINT "product_uom_conversions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_documents" ADD CONSTRAINT "product_documents_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_definitions" ADD CONSTRAINT "attribute_definitions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tag_mappings" ADD CONSTRAINT "product_tag_mappings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_warehouses" ADD CONSTRAINT "product_warehouses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_audit_logs" ADD CONSTRAINT "product_audit_logs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_approvals" ADD CONSTRAINT "product_approvals_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
