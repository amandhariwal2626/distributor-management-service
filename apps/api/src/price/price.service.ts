import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProductPrice } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-logs/audit-logs.service';
import { PriceValidator } from './validators/price.validator';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { ListPricesDto } from './dto/list-prices.dto';
import { paginate, buildOrderBy } from '../common/utils/pagination.helper';
import { PaginatedResult } from '../common/interfaces';

@Injectable()
export class PriceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
    private readonly priceValidator: PriceValidator,
  ) {}

  async create(
    dto: CreatePriceDto,
    userId: string,
    organizationId: string,
    ipAddress?: string,
  ): Promise<ProductPrice> {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, deletedAt: null },
    });
    if (!product) {
      throw new NotFoundException(
        `Product not found. The specified product ID (${dto.productId}) does not exist or has been removed.`,
      );
    }

    const ruleErrors = await this.priceValidator.validatePriceRules({
      mrp: dto.mrp,
      ptr: dto.ptr,
      pts: dto.pts,
      distributorPrice: dto.distributorPrice,
    });
    if (ruleErrors.length > 0) {
      throw new BadRequestException(ruleErrors.join(' '));
    }

    const effectiveFrom = new Date(dto.effectiveFrom);
    const effectiveTo = dto.effectiveTo ? new Date(dto.effectiveTo) : null;

    const dateErrors = await this.priceValidator.validateEffectiveDate(
      dto.productId,
      effectiveFrom,
      effectiveTo,
    );
    if (dateErrors.length > 0) {
      throw new ConflictException(dateErrors.join(' '));
    }

    const price = await this.prisma.productPrice.create({
      data: {
        companyId: organizationId,
        productId: dto.productId,
        mrp: dto.mrp,
        ptr: dto.ptr,
        pts: dto.pts,
        distributorPrice: dto.distributorPrice,
        effectiveFrom,
        effectiveTo,
        createdBy: userId,
      },
      include: { product: true },
    });

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: 'PRICE_CREATED',
      entityType: 'product_price',
      entityId: price.id,
      newValue: {
        productId: dto.productId,
        mrp: dto.mrp,
        ptr: dto.ptr,
        pts: dto.pts,
        distributorPrice: dto.distributorPrice,
        effectiveFrom: dto.effectiveFrom,
      },
      ipAddress,
    });

    return price;
  }

  async findAll(query: ListPricesDto): Promise<PaginatedResult<ProductPrice>> {
    const where: Prisma.ProductPriceWhereInput = {
      deletedAt: null,
      ...(query.productId ? { productId: query.productId } : {}),
      ...(query.fromDate || query.toDate
        ? {
            effectiveFrom: {
              ...(query.fromDate ? { gte: new Date(query.fromDate) } : {}),
              ...(query.toDate ? { lte: new Date(query.toDate) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.productPrice.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: buildOrderBy(query.sortBy, query.sortOrder),
        include: { product: true },
      }),
      this.prisma.productPrice.count({ where }),
    ]);

    return paginate(items, total, query);
  }

  async findById(id: string): Promise<ProductPrice> {
    const price = await this.prisma.productPrice.findFirst({
      where: { id, deletedAt: null },
      include: { product: true },
    });
    if (!price) {
      throw new NotFoundException(
        `Price record not found. The specified price ID (${id}) does not exist or has been removed.`,
      );
    }
    return price;
  }

  async update(
    id: string,
    dto: UpdatePriceDto,
    userId: string,
    organizationId: string,
    ipAddress?: string,
  ): Promise<ProductPrice> {
    const existing = await this.findById(id);

    const oldValues: Record<string, unknown> = {};
    const newValues: Record<string, unknown> = {};

    const priceFields = ['mrp', 'ptr', 'pts', 'distributorPrice'] as const;
    for (const field of priceFields) {
      if (dto[field] !== undefined) {
        oldValues[field] = Number(existing[field]);
        newValues[field] = dto[field];
      }
    }

    const effectiveFrom = dto.effectiveFrom
      ? new Date(dto.effectiveFrom)
      : undefined;
    const effectiveTo =
      dto.effectiveTo !== undefined
        ? dto.effectiveTo
          ? new Date(dto.effectiveTo)
          : null
        : undefined;

    if (dto.productId !== undefined) {
      oldValues.productId = existing.productId;
      newValues.productId = dto.productId;
    }

    if (
      dto.mrp !== undefined ||
      dto.ptr !== undefined ||
      dto.pts !== undefined ||
      dto.distributorPrice !== undefined
    ) {
      const ruleErrors = await this.priceValidator.validatePriceRules({
        mrp: dto.mrp ?? Number(existing.mrp),
        ptr: dto.ptr ?? Number(existing.ptr),
        pts: dto.pts ?? Number(existing.pts),
        distributorPrice:
          dto.distributorPrice ?? Number(existing.distributorPrice),
      });
      if (ruleErrors.length > 0) {
        throw new BadRequestException(ruleErrors.join(' '));
      }
    }

    if (dto.effectiveFrom || dto.effectiveTo !== undefined) {
      const dateErrors = await this.priceValidator.validateEffectiveDate(
        dto.productId ?? existing.productId,
        effectiveFrom ?? existing.effectiveFrom,
        effectiveTo !== undefined ? effectiveTo : existing.effectiveTo,
        id,
      );
      if (dateErrors.length > 0) {
        throw new ConflictException(dateErrors.join(' '));
      }
    }

    const updated = await this.prisma.productPrice.update({
      where: { id },
      data: {
        ...(dto.productId !== undefined ? { productId: dto.productId } : {}),
        ...(dto.mrp !== undefined ? { mrp: dto.mrp } : {}),
        ...(dto.ptr !== undefined ? { ptr: dto.ptr } : {}),
        ...(dto.pts !== undefined ? { pts: dto.pts } : {}),
        ...(dto.distributorPrice !== undefined
          ? { distributorPrice: dto.distributorPrice }
          : {}),
        ...(effectiveFrom !== undefined ? { effectiveFrom } : {}),
        ...(effectiveTo !== undefined ? { effectiveTo } : {}),
        updatedBy: userId,
      },
      include: { product: true },
    });

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: 'PRICE_UPDATED',
      entityType: 'product_price',
      entityId: id,
      oldValue: Object.keys(oldValues).length > 0 ? oldValues : undefined,
      newValue: Object.keys(newValues).length > 0 ? newValues : undefined,
      ipAddress,
    });

    return updated;
  }

  async delete(
    id: string,
    userId: string,
    organizationId: string,
    ipAddress?: string,
  ): Promise<void> {
    await this.prisma.productPrice.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: 'PRICE_DELETED',
      entityType: 'product_price',
      entityId: id,
      ipAddress,
    });
  }

  async getActivePrice(productId: string): Promise<ProductPrice | null> {
    const now = new Date();

    const price = await this.prisma.productPrice.findFirst({
      where: {
        productId,
        deletedAt: null,
        effectiveFrom: { lte: now },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: now } }],
      },
      include: { product: true },
      orderBy: { effectiveFrom: 'desc' },
    });

    return price;
  }
}
