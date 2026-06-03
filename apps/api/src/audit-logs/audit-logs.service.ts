import { Injectable } from '@nestjs/common';
import { Prisma, UserAuditLog } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListAuditLogsDto } from './dto/list-audit-logs.dto';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    organizationId: string;
    actorId?: string;
    action: string;
    entityType?: string;
    entityId?: string;
    oldValue?: Record<string, unknown>;
    newValue?: Record<string, unknown>;
    ipAddress?: string;
  }): Promise<UserAuditLog> {
    return this.prisma.userAuditLog.create({
      data: {
        organizationId: data.organizationId,
        actorId: data.actorId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        oldValue: data.oldValue as Prisma.InputJsonValue,
        newValue: data.newValue as Prisma.InputJsonValue,
        ipAddress: data.ipAddress,
      },
    });
  }

  async findAll(
    organizationId: string,
    query: ListAuditLogsDto,
  ): Promise<{
    items: Prisma.UserAuditLogGetPayload<{
      include: {
        actor: {
          select: {
            id: true;
            profile: { select: { fullName: true } };
            email: true;
          };
        };
      };
    }>[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const where: Prisma.UserAuditLogWhereInput = {
      organizationId,
      ...(query.action ? { action: query.action } : {}),
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.entityId ? { entityId: query.entityId } : {}),
      ...(query.actorId ? { actorId: query.actorId } : {}),
      ...(query.from || query.to
        ? {
            createdAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.userAuditLog.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              profile: { select: { fullName: true } },
              email: true,
            },
          },
        },
      }),
      this.prisma.userAuditLog.count({ where }),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      pages: Math.ceil(total / query.limit),
    };
  }
}
