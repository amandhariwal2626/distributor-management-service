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
    return Array.from(set);
  }
}
