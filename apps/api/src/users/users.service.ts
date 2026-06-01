import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@dms/database';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUsersDto } from './dto/list-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, query: ListUsersDto) {
    const where: Prisma.UserWhereInput = {
      tenantId,
      deletedAt: null,
      ...(query.search
        ? {
            OR: [
              { fullName: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.status ? { isActive: query.status === 'active' } : {}),
      ...(query.roleId ? { roles: { some: { roleId: query.roleId } } } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        include: {
          roles: { include: { role: true } },
          invitesReceived: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      pages: Math.ceil(total / query.limit),
    };
  }

  async findById(tenantId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        roles: { include: { role: true } },
        permissionOverrides: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(tenantId: string, actorUserId: string, data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email: data.email } },
    });
    if (existing) throw new ConflictException('Email already exists');

    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
    return this.prisma.user.create({
      data: {
        tenantId,
        email: data.email.toLowerCase(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        fullName,
        isActive: false,
        createdBy: actorUserId,
        roles: {
          createMany: {
            data: data.roleIds.map((roleId) => ({
              roleId,
              createdBy: actorUserId,
            })),
            skipDuplicates: true,
          },
        },
      },
    });
  }

  async update(
    tenantId: string,
    id: string,
    actorUserId: string,
    data: UpdateUserDto,
  ) {
    await this.findById(tenantId, id);
    const fullName =
      data.firstName && data.lastName
        ? `${data.firstName.trim()} ${data.lastName.trim()}`
        : undefined;

    return this.prisma.$transaction(async (tx) => {
      if (data.roleIds) {
        await tx.userRole.deleteMany({ where: { userId: id } });
        await tx.userRole.createMany({
          data: data.roleIds.map((roleId) => ({
            roleId,
            userId: id,
            createdBy: actorUserId,
          })),
          skipDuplicates: true,
        });
      }
      return tx.user.update({
        where: { id },
        data: {
          email: data.email?.toLowerCase(),
          firstName: data.firstName?.trim(),
          lastName: data.lastName?.trim(),
          ...(fullName ? { fullName } : {}),
          updatedBy: actorUserId,
        },
      });
    });
  }

  async deactivate(tenantId: string, id: string, actorUserId: string) {
    await this.findById(tenantId, id);
    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        deactivatedAt: new Date(),
        deactivatedBy: actorUserId,
        updatedBy: actorUserId,
      },
    });
  }

  async reactivate(tenantId: string, id: string, actorUserId: string) {
    await this.findById(tenantId, id);
    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: true,
        deactivatedAt: null,
        deactivatedBy: null,
        updatedBy: actorUserId,
      },
    });
  }
}
