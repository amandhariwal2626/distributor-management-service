import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
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

  async findAll(organizationId: string): Promise<any[]> {
    return this.prisma.role.findMany({
      where: { organizationId, deletedAt: null },
      include: { permissions: { include: { permission: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async create(
    organizationId: string,
    actorUserId: string,
    body: CreateRoleDto,
  ): Promise<Role> {
    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.create({
        data: {
          organizationId,
          name: body.name,
          description: body.description,
          createdBy: actorUserId,
        },
      });
      const permissions = await tx.permission.findMany({
        where: {
          organizationId,
          code: { in: body.permissions },
          deletedAt: null,
        },
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
    organizationId: string,
    id: string,
    actorUserId: string,
    body: UpdateRoleDto,
  ): Promise<Role> {
    const role = await this.prisma.role.findFirst({
      where: { id, organizationId, deletedAt: null },
    });
    if (!role)
      throw new NotFoundException(
        `Role not found. The specified role ID (${id}) does not exist.`,
      );
    return this.prisma.$transaction(async (tx) => {
      if (body.permissions) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        const permissions = await tx.permission.findMany({
          where: {
            organizationId,
            code: { in: body.permissions },
            deletedAt: null,
          },
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

  async remove(
    organizationId: string,
    id: string,
    actorUserId: string,
  ): Promise<Role> {
    const role = await this.prisma.role.findFirst({
      where: { id, organizationId, deletedAt: null },
    });
    if (!role)
      throw new NotFoundException(
        `Role not found. The specified role ID (${id}) does not exist.`,
      );
    return this.prisma.role.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: actorUserId },
    });
  }
}
