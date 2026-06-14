import { Injectable } from '@nestjs/common';
import { Prisma, ProductLifecycleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReportQueryDto } from './dto/report-query.dto';

@Injectable()
export class ReportingService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductReport(filters?: ReportQueryDto) {
    const where: Prisma.ProductWhereInput = { deletedAt: null };
    if (filters?.status)
      where.status = filters.status as ProductLifecycleStatus;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.fromDate || filters?.toDate) {
      where.createdAt = {
        ...(filters.fromDate ? { gte: new Date(filters.fromDate) } : {}),
        ...(filters.toDate ? { lte: new Date(filters.toDate) } : {}),
      };
    }

    const products = await this.prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        _count: {
          select: { prices: true, documents: true, images: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalProducts: products.length,
      byStatus: this.groupBy(products, 'status'),
      products,
    };
  }

  async getPriceReport(filters?: ReportQueryDto) {
    const where: Prisma.ProductPriceWhereInput = { deletedAt: null };
    if (filters?.productId) where.productId = filters.productId;

    const prices = await this.prisma.productPrice.findMany({
      where,
      include: {
        product: { select: { id: true, productCode: true, productName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalPrices: prices.length,
      prices: prices.map((p) => ({
        ...p,
        mrp: Number(p.mrp),
        ptr: Number(p.ptr),
        pts: Number(p.pts),
        distributorPrice: Number(p.distributorPrice),
      })),
    };
  }

  async getAuditReport(companyId: string, filters?: ReportQueryDto) {
    const where: Record<string, unknown> = { companyId };
    if (filters?.entityType) where.entityType = filters.entityType;
    if (filters?.action) where.action = filters.action;
    if (filters?.fromDate || filters?.toDate) {
      where.createdAt = {
        ...(filters.fromDate ? { gte: new Date(filters.fromDate) } : {}),
        ...(filters.toDate ? { lte: new Date(filters.toDate) } : {}),
      };
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10000,
    });

    return {
      totalLogs: logs.length,
      byAction: this.groupBy(logs, 'action'),
      byEntityType: this.groupBy(logs, 'entityType'),
      logs,
    };
  }

  async getDashboardSummary(): Promise<Record<string, unknown>> {
    const [totalProducts, activeProducts, totalPrices] = await Promise.all([
      this.prisma.product.count({
        where: { deletedAt: null },
      }),
      this.prisma.product.count({
        where: { deletedAt: null, status: 'ACTIVE' },
      }),
      this.prisma.productPrice.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      totalPrices,
      generatedAt: new Date().toISOString(),
    };
  }

  private groupBy<T extends Record<string, unknown>>(
    items: T[],
    key: string,
  ): Record<string, number> {
    return items.reduce((acc: Record<string, number>, item: T) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const val = String(item[key] ?? 'UNKNOWN');
      acc[val] = (acc[val] ?? 0) + 1;
      return acc;
    }, {});
  }
}
