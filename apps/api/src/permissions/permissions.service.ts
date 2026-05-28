import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPermissions(userId: string): Promise<string[]> {
    const rows = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
    const set = new Set<string>();
    rows.forEach((row) => {
      row.role.permissions.forEach((permissionRow) => {
        set.add(permissionRow.permission.code);
      });
    });
    const overrides = await this.prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    });
    overrides.forEach((row) => set.add(row.permission.code));
    return Array.from(set);
  }

  async findAll(tenantId: string) {
    return this.prisma.permission.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { code: 'asc' },
    });
  }
}
