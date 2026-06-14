import {
  Permission as PrismaPermission,
  UserPermission as PrismaUserPermission,
} from '@prisma/client';

export type PermissionEntity = PrismaPermission;

export type UserPermissionEntity = PrismaUserPermission & {
  permission: PrismaPermission;
};
