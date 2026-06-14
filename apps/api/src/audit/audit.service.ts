import { Injectable } from '@nestjs/common';
import { AuditLog, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogEntry, AuditChangeRecord } from './interfaces/audit.interface';
import { ListAuditDto } from './dto/list-audit.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(entry: AuditLogEntry & { companyId: string }): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        companyId: entry.companyId,
        entityType: entry.entityType,
        entityId: entry.entityId,
        action: entry.action,
        field: (entry.field as string) ?? null,
        oldValue:
          entry.oldValue != null ? JSON.stringify(entry.oldValue) : null,
        newValue:
          entry.newValue != null ? JSON.stringify(entry.newValue) : null,
        reason: (entry.reason as string) ?? null,
        actorId: entry.actorId ?? null,
        ipAddress: entry.ipAddress ?? null,
        userAgent: entry.userAgent ?? null,
      },
    });
  }

  async logMany(
    entries: (AuditLogEntry & { companyId: string })[],
  ): Promise<void> {
    if (entries.length === 0) return;

    await this.prisma.auditLog.createMany({
      data: entries.map((entry) => ({
        companyId: entry.companyId,
        entityType: entry.entityType,
        entityId: entry.entityId,
        action: entry.action,
        field: (entry.field as string) ?? null,
        oldValue:
          entry.oldValue != null ? JSON.stringify(entry.oldValue) : null,
        newValue:
          entry.newValue != null ? JSON.stringify(entry.newValue) : null,
        reason: (entry.reason as string) ?? null,
        actorId: entry.actorId ?? null,
        ipAddress: entry.ipAddress ?? null,
        userAgent: entry.userAgent ?? null,
      })),
    });
  }

  async logChanges(
    companyId: string,
    entityType: string,
    entityId: string,
    action: string,
    changes: AuditChangeRecord[],
    context: {
      actorId?: string;
      ipAddress?: string;
      userAgent?: string;
      reason?: string;
    },
  ): Promise<void> {
    if (changes.length === 0) return;

    const entries: (AuditLogEntry & { companyId: string })[] = changes.map(
      (change) => ({
        companyId,
        entityType,
        entityId,
        action,
        field: change.field,
        oldValue:
          change.oldValue !== undefined && change.oldValue !== null
            ? JSON.stringify(change.oldValue)
            : null,
        newValue:
          change.newValue !== undefined && change.newValue !== null
            ? JSON.stringify(change.newValue)
            : null,
        reason: context.reason,
        actorId: context.actorId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      }),
    );

    await this.logMany(entries);
  }

  async findAll(
    companyId: string,
    query: ListAuditDto,
  ): Promise<{
    data: AuditLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const where: Prisma.AuditLogWhereInput = {
      companyId,
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.entityId ? { entityId: query.entityId } : {}),
      ...(query.action ? { action: query.action } : {}),
      ...(query.actorId ? { actorId: query.actorId } : {}),
      ...(query.fromDate || query.toDate
        ? {
            createdAt: {
              ...(query.fromDate ? { gte: new Date(query.fromDate) } : {}),
              ...(query.toDate ? { lte: new Date(query.toDate) } : {}),
            },
          }
        : {}),
    };

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              email: true,
              profile: { select: { fullName: true } },
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data: items,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findByEntity(
    companyId: string,
    entityType: string,
    entityId: string,
  ): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { companyId, entityType, entityId },
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            profile: { select: { fullName: true } },
          },
        },
      },
    });
  }
}
