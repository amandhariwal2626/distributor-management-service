import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class RbacService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getAllPermissions(companyId: string): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      where: { organizationId: companyId, deletedAt: null },
      orderBy: { code: 'asc' },
    });
  }

  async getUserPermissions(
    userId: string,
    _companyId: string,
  ): Promise<string[]> {
    void _companyId;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                  where: { permission: { deletedAt: null } },
                },
              },
            },
          },
        },
        permissionOverrides: {
          include: { permission: true },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(
        `User not found. The specified user ID (${userId}) does not exist.`,
      );
    }

    const perms = new Set<string>();
    for (const ur of user.roles) {
      for (const rp of ur.role.permissions) {
        perms.add(rp.permission.code);
      }
    }
    for (const override of user.permissionOverrides) {
      if (override.granted) {
        perms.add(override.permission.code);
      } else {
        perms.delete(override.permission.code);
      }
    }
    return [...perms];
  }

  async checkPermission(
    userId: string,
    permissionCode: string,
    companyId: string,
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, companyId);
    return permissions.includes(permissionCode);
  }

  async assignPermissionOverride(
    userId: string,
    permissionId: string,
    granted: boolean,
    actorId: string,
    companyId: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(
        `User not found. The specified user ID (${userId}) does not exist.`,
      );
    }
    const permission = await this.prisma.permission.findFirst({
      where: { id: permissionId, organizationId: companyId, deletedAt: null },
    });
    if (!permission) {
      throw new NotFoundException(
        `Permission not found. The specified permission ID (${permissionId}) does not exist.`,
      );
    }

    await this.prisma.userPermission.upsert({
      where: { userId_permissionId: { userId, permissionId } },
      create: { userId, permissionId, granted },
      update: { granted },
    });

    await this.auditService.log({
      companyId,
      entityType: 'UserPermission',
      entityId: `${userId}:${permissionId}`,
      action: granted ? 'GRANTED' : 'REVOKED',
      actorId,
    });
  }

  async getPermissionOverrides(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(
        `User not found. The specified user ID (${userId}) does not exist.`,
      );
    }
    return this.prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    });
  }
}
