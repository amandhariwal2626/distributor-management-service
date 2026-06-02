-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED');

-- RenameTable
ALTER TABLE "Tenant" RENAME TO "Organization";

-- DropForeignKey (tenantId -> organizationId rename prep)
ALTER TABLE "User" DROP CONSTRAINT "User_tenantId_fkey";
ALTER TABLE "Role" DROP CONSTRAINT "Role_tenantId_fkey";
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_tenantId_fkey";
ALTER TABLE "Session" DROP CONSTRAINT "Session_tenantId_fkey";
ALTER TABLE "InviteToken" DROP CONSTRAINT "InviteToken_tenantId_fkey";

-- DropIndex (replace with organizationId variants)
DROP INDEX IF EXISTS "Tenant_code_key";
DROP INDEX IF EXISTS "Tenant_deletedAt_idx";
DROP INDEX IF EXISTS "User_tenantId_isActive_idx";
DROP INDEX IF EXISTS "User_tenantId_email_key";
DROP INDEX IF EXISTS "Role_tenantId_idx";
DROP INDEX IF EXISTS "Role_tenantId_name_key";
DROP INDEX IF EXISTS "Permission_tenantId_idx";
DROP INDEX IF EXISTS "Permission_tenantId_code_key";
DROP INDEX IF EXISTS "Session_tenantId_status_idx";
DROP INDEX IF EXISTS "InviteToken_tenantId_invitedEmail_idx";

-- RenameColumn (tenantId -> organizationId)
ALTER TABLE "User" RENAME COLUMN "tenantId" TO "organizationId";
ALTER TABLE "Role" RENAME COLUMN "tenantId" TO "organizationId";
ALTER TABLE "Permission" RENAME COLUMN "tenantId" TO "organizationId";
ALTER TABLE "Session" RENAME COLUMN "tenantId" TO "organizationId";
ALTER TABLE "InviteToken" RENAME COLUMN "tenantId" TO "organizationId";

-- AddForeignKey (recreate with organizationId)
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Role" ADD CONSTRAINT "Role_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InviteToken" ADD CONSTRAINT "InviteToken_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex (organizationId variants)
CREATE UNIQUE INDEX "Organization_code_key" ON "Organization"("code");
CREATE INDEX "Organization_deletedAt_idx" ON "Organization"("deletedAt");

-- AlterTable (add non-PII columns to User)
ALTER TABLE "User" ADD COLUMN "username" TEXT;
ALTER TABLE "User" ADD COLUMN "forcePasswordChange" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "passwordExpiryDays" INTEGER;
ALTER TABLE "User" ADD COLUMN "twoFactorAuth" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "lockedUntil" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "reportingManagerId" TEXT;
ALTER TABLE "User" ADD COLUMN "zone" TEXT;
ALTER TABLE "User" ADD COLUMN "region" TEXT;
ALTER TABLE "User" ADD COLUMN "area" TEXT;
ALTER TABLE "User" ADD COLUMN "territory" TEXT;
ALTER TABLE "User" ADD COLUMN "distributorId" TEXT;

-- Migrate isActive to status
ALTER TABLE "User" ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
UPDATE "User" SET "status" = 'ACTIVE' WHERE "isActive" = true;
UPDATE "User" SET "status" = 'INACTIVE' WHERE "isActive" = false;
ALTER TABLE "User" DROP COLUMN "isActive";

-- CreateIndex (User organizationId indexes)
CREATE UNIQUE INDEX "User_organizationId_email_key" ON "User"("organizationId", "email");
CREATE UNIQUE INDEX "User_organizationId_username_key" ON "User"("organizationId", "username");
CREATE INDEX "User_organizationId_status_idx" ON "User"("organizationId", "status");
CREATE INDEX "User_organizationId_reportingManagerId_idx" ON "User"("organizationId", "reportingManagerId");
CREATE INDEX "User_organizationId_distributorId_idx" ON "User"("organizationId", "distributorId");

-- Add PII columns to User temporarily (for migration to UserProfile)
ALTER TABLE "User" ADD COLUMN "userCode" TEXT;
ALTER TABLE "User" ADD COLUMN "employeeCode" TEXT;
ALTER TABLE "User" ADD COLUMN "middleName" TEXT;
ALTER TABLE "User" ADD COLUMN "displayName" TEXT;
ALTER TABLE "User" ADD COLUMN "gender" "Gender";
ALTER TABLE "User" ADD COLUMN "dob" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "mobile" TEXT;
ALTER TABLE "User" ADD COLUMN "alternateMobile" TEXT;
ALTER TABLE "User" ADD COLUMN "emergencyContact" TEXT;
ALTER TABLE "User" ADD COLUMN "addressLine1" TEXT;
ALTER TABLE "User" ADD COLUMN "addressLine2" TEXT;
ALTER TABLE "User" ADD COLUMN "addressLine3" TEXT;
ALTER TABLE "User" ADD COLUMN "country" TEXT;
ALTER TABLE "User" ADD COLUMN "state" TEXT;
ALTER TABLE "User" ADD COLUMN "district" TEXT;
ALTER TABLE "User" ADD COLUMN "city" TEXT;
ALTER TABLE "User" ADD COLUMN "pincode" TEXT;

-- CreateTable (UserProfile)
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userCode" TEXT,
    "employeeCode" TEXT,
    "firstName" TEXT NOT NULL DEFAULT '',
    "middleName" TEXT,
    "lastName" TEXT NOT NULL DEFAULT '',
    "displayName" TEXT,
    "fullName" TEXT NOT NULL DEFAULT '',
    "gender" "Gender",
    "dob" TIMESTAMP(3),
    "mobile" TEXT,
    "alternateMobile" TEXT,
    "emergencyContact" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "addressLine3" TEXT,
    "country" TEXT,
    "state" TEXT,
    "district" TEXT,
    "city" TEXT,
    "pincode" TEXT,
    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- Migrate existing data from User to UserProfile
INSERT INTO "UserProfile" ("id", "userId", "userCode", "employeeCode", "firstName", "middleName", "lastName", "displayName", "fullName", "gender", "dob", "mobile", "alternateMobile", "emergencyContact", "addressLine1", "addressLine2", "addressLine3", "country", "state", "district", "city", "pincode")
SELECT "id", "id", "userCode", "employeeCode", "firstName", "middleName", "lastName", "displayName", "fullName", "gender", "dob", "mobile", "alternateMobile", "emergencyContact", "addressLine1", "addressLine2", "addressLine3", "country", "state", "district", "city", "pincode"
FROM "User";

-- CreateIndex (UserProfile)
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");
CREATE INDEX "UserProfile_fullName_idx" ON "UserProfile"("fullName");

-- AddForeignKey (UserProfile)
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop PII columns from User
ALTER TABLE "User" DROP COLUMN "userCode";
ALTER TABLE "User" DROP COLUMN "employeeCode";
ALTER TABLE "User" DROP COLUMN "firstName";
ALTER TABLE "User" DROP COLUMN "middleName";
ALTER TABLE "User" DROP COLUMN "lastName";
ALTER TABLE "User" DROP COLUMN "displayName";
ALTER TABLE "User" DROP COLUMN "fullName";
ALTER TABLE "User" DROP COLUMN "gender";
ALTER TABLE "User" DROP COLUMN "dob";
ALTER TABLE "User" DROP COLUMN "mobile";
ALTER TABLE "User" DROP COLUMN "alternateMobile";
ALTER TABLE "User" DROP COLUMN "emergencyContact";
ALTER TABLE "User" DROP COLUMN "addressLine1";
ALTER TABLE "User" DROP COLUMN "addressLine2";
ALTER TABLE "User" DROP COLUMN "addressLine3";
ALTER TABLE "User" DROP COLUMN "country";
ALTER TABLE "User" DROP COLUMN "state";
ALTER TABLE "User" DROP COLUMN "district";
ALTER TABLE "User" DROP COLUMN "city";
ALTER TABLE "User" DROP COLUMN "pincode";

-- AddForeignKey (User self-referential)
ALTER TABLE "User" ADD CONSTRAINT "User_reportingManagerId_fkey" FOREIGN KEY ("reportingManagerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable (add level to Role)
ALTER TABLE "Role" ADD COLUMN "level" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex (Role organizationId)
CREATE INDEX "Role_organizationId_idx" ON "Role"("organizationId");
CREATE UNIQUE INDEX "Role_organizationId_name_key" ON "Role"("organizationId", "name");

-- CreateIndex (Permission organizationId)
CREATE INDEX "Permission_organizationId_idx" ON "Permission"("organizationId");
CREATE UNIQUE INDEX "Permission_organizationId_code_key" ON "Permission"("organizationId", "code");

-- CreateIndex (Session organizationId)
CREATE INDEX "Session_organizationId_status_idx" ON "Session"("organizationId", "status");

-- CreateIndex (InviteToken organizationId)
CREATE INDEX "InviteToken_organizationId_invitedEmail_idx" ON "InviteToken"("organizationId", "invitedEmail");

-- CreateTable (UserAuditLog)
CREATE TABLE "UserAuditLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey (UserAuditLog)
ALTER TABLE "UserAuditLog" ADD CONSTRAINT "UserAuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserAuditLog" ADD CONSTRAINT "UserAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex (UserAuditLog)
CREATE INDEX "UserAuditLog_organizationId_createdAt_idx" ON "UserAuditLog"("organizationId", "createdAt");
CREATE INDEX "UserAuditLog_entityType_entityId_idx" ON "UserAuditLog"("entityType", "entityId");
CREATE INDEX "UserAuditLog_actorId_idx" ON "UserAuditLog"("actorId");

-- Rename primary key constraint
ALTER TABLE "Organization" RENAME CONSTRAINT "Tenant_pkey" TO "Organization_pkey";
