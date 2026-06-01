import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@dms/database';
import { CreateRoleDto, UpdateRoleDto } from './dto/upsert-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserRoles(userId: string): Promise<string[]> {
    const roles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return roles.map((item) => item.role.name);
  }

  async findAll(tenantId: string) {
    return this.prisma.role.findMany({
      where: { tenantId, deletedAt: null },
      include: { permissions: { include: { permission: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async create(tenantId: string, actorUserId: string, body: CreateRoleDto) {
    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.create({
        data: {
          tenantId,
          name: body.name,
          description: body.description,
          createdBy: actorUserId,
        },
      });
      const permissions = await tx.permission.findMany({
        where: { tenantId, code: { in: body.permissions }, deletedAt: null },
      });
      if (permissions.length) {
        await tx.rolePermission.createMany({
          data: permissions.map((p) => ({
            roleId: role.id,
            permissionId: p.id,
            createdBy: actorUserId,
          })),
        });
      }
      return role;
    });
  }

  async update(
    tenantId: string,
    id: string,
    actorUserId: string,
    body: UpdateRoleDto,
  ) {
    const role = await this.prisma.role.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!role) throw new NotFoundException('Role not found');
    return this.prisma.$transaction(async (tx) => {
      if (body.permissions) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        const permissions = await tx.permission.findMany({
          where: { tenantId, code: { in: body.permissions }, deletedAt: null },
        });
        if (permissions.length) {
          await tx.rolePermission.createMany({
            data: permissions.map((p) => ({
              roleId: id,
              permissionId: p.id,
              createdBy: actorUserId,
            })),
          });
        }
      }
      return tx.role.update({
        where: { id },
        data: {
          name: body.name,
          description: body.description,
          updatedBy: actorUserId,
        },
      });
    });
  }

  async remove(tenantId: string, id: string, actorUserId: string) {
    const role = await this.prisma.role.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!role) throw new NotFoundException('Role not found');
    return this.prisma.role.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: actorUserId },
    });
  }
}
