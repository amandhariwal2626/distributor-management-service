import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Product, ProductLifecycleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-logs/audit-logs.service';
import { EventPublisherService } from '../events/publishers/event-publisher.service';
import { EventFactoryService } from '../events/event-factory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { ProductValidator } from './validators/product.validator';
import { paginate, buildOrderBy } from '../common/utils/pagination.helper';
import { PaginatedResult } from '../common/interfaces';
import { PRODUCT_EVENTS } from './events/product-events.constants';

const PRODUCT_INCLUDE = {
  category: true,
  subCategory: true,
  brand: true,
  manufacturer: true,
  uom: true,
  taxGroup: true,
  prices: true,
  images: true,
  documents: true,
  attributeValues: true,
  tagMappings: true,
  warehouses: true,
  approvals: true,
  uomConversions: true,
};

const PRODUCT_LIST_INCLUDE = {
  category: { select: { id: true, categoryName: true } },
  subCategory: { select: { id: true, subCategoryName: true } },
  brand: { select: { id: true, brandName: true } },
  manufacturer: { select: { id: true, manufacturerName: true } },
  uom: { select: { id: true, uomName: true } },
};

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
    private readonly eventPublisher: EventPublisherService,
    private readonly eventFactory: EventFactoryService,
    private readonly productValidator: ProductValidator,
  ) {}

  async create(
    dto: CreateProductDto,
    userId: string,
    organizationId: string,
    ipAddress?: string,
  ): Promise<Product> {
    const validationErrors = await this.productValidator.validateCreate({
      productCode: dto.productCode,
      barcode: dto.barcode,
    });

    if (validationErrors.length > 0) {
      throw new ConflictException(
        `Product creation failed: ${validationErrors.join('; ')}`,
      );
    }

    const product = await this.prisma.product.create({
      data: {
        companyId: organizationId,
        productCode: dto.productCode,
        productName: dto.productName,
        shortName: dto.shortName,
        description: dto.description,
        categoryId: dto.categoryId,
        subCategoryId: dto.subCategoryId,
        brandId: dto.brandId,
        manufacturerId: dto.manufacturerId,
        uomId: dto.uomId,
        taxGroupId: dto.taxGroupId,
        barcode: dto.barcode,
        hsnCode: dto.hsnCode,
        skuType: dto.skuType,
        shelfLifeDays: dto.shelfLifeDays,
        reorderLevel: dto.reorderLevel,
        imageUrl: dto.imageUrl,
        status: ProductLifecycleStatus.DRAFT,
        createdBy: userId,
      },
      include: PRODUCT_INCLUDE,
    });

    await this.auditLog.create({
      organizationId: null as unknown as string,
      actorId: userId,
      action: 'PRODUCT_CREATED',
      entityType: 'product',
      entityId: product.id,
      newValue: {
        productCode: product.productCode,
        productName: product.productName,
        status: product.status,
      },
      ipAddress,
    });

    await this.eventPublisher.publish(
      this.eventFactory.createEvent(
        PRODUCT_EVENTS.CREATED,
        product.id,
        'Product',
        {
          productCode: product.productCode,
          productName: product.productName,
          status: product.status,
        },
        { userId, organizationId: userId, ipAddress },
      ),
    );

    return product;
  }

  async findAll(query: ListProductsDto): Promise<PaginatedResult<Product>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.ProductWhereInput = {
      ...(query.includeDeleted ? {} : { deletedAt: null }),
      ...(query.status ? { status: query.status } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.brandId ? { brandId: query.brandId } : {}),
      ...(query.skuType ? { skuType: query.skuType } : {}),
      ...(query.search
        ? {
            OR: [
              { productName: { contains: query.search, mode: 'insensitive' } },
              { productCode: { contains: query.search, mode: 'insensitive' } },
              { shortName: { contains: query.search, mode: 'insensitive' } },
              { barcode: { contains: query.search, mode: 'insensitive' } },
              { hsnCode: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const orderBy = buildOrderBy(query.sortBy, query.sortOrder);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: PRODUCT_LIST_INCLUDE,
      }),
      this.prisma.product.count({ where }),
    ]);

    return paginate(items, total, { page, limit });
  }

  async findById(id: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: PRODUCT_INCLUDE,
    });

    if (!product) {
      throw new NotFoundException(
        `Product not found. The specified product ID (${id}) does not exist or has been removed.`,
      );
    }

    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    userId: string,
    organizationId: string,
    ipAddress?: string,
  ): Promise<Product> {
    const existing = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(
        `Product not found. The specified product ID (${id}) does not exist or has been removed.`,
      );
    }

    if (dto.productCode || dto.barcode) {
      const uniquenessErrors = await this.productValidator.validateCreate({
        productCode: dto.productCode || existing.productCode,
        barcode: dto.barcode,
      });

      const filteredErrors = uniquenessErrors.filter((error) => {
        if (
          error === 'Product code already exists' &&
          dto.productCode === existing.productCode
        )
          return false;
        if (
          error === 'Barcode already exists' &&
          dto.barcode === existing.barcode
        )
          return false;
        return true;
      });

      if (filteredErrors.length > 0) {
        throw new ConflictException(
          `Product update failed: ${filteredErrors.join('; ')}`,
        );
      }
    }

    const changedFields: string[] = [];
    const oldValue: Record<string, unknown> = {};
    const newValue: Record<string, unknown> = {};

    const updatableFields: (keyof UpdateProductDto)[] = [
      'productCode',
      'productName',
      'shortName',
      'description',
      'categoryId',
      'subCategoryId',
      'brandId',
      'manufacturerId',
      'uomId',
      'taxGroupId',
      'barcode',
      'hsnCode',
      'skuType',
      'shelfLifeDays',
      'reorderLevel',
      'imageUrl',
    ];

    for (const field of updatableFields) {
      if (dto[field] !== undefined) {
        const oldVal = existing[field as keyof Product];
        if (String(oldVal) !== String(dto[field])) {
          changedFields.push(field);
          oldValue[field] = oldVal;
          newValue[field] = dto[field];
        }
      }
    }

    if (changedFields.length === 0) {
      return existing;
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.productCode !== undefined
          ? { productCode: dto.productCode }
          : {}),
        ...(dto.productName !== undefined
          ? { productName: dto.productName }
          : {}),
        ...(dto.shortName !== undefined ? { shortName: dto.shortName } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
        ...(dto.subCategoryId !== undefined
          ? { subCategoryId: dto.subCategoryId }
          : {}),
        ...(dto.brandId !== undefined ? { brandId: dto.brandId } : {}),
        ...(dto.manufacturerId !== undefined
          ? { manufacturerId: dto.manufacturerId }
          : {}),
        ...(dto.uomId !== undefined ? { uomId: dto.uomId } : {}),
        ...(dto.taxGroupId !== undefined ? { taxGroupId: dto.taxGroupId } : {}),
        ...(dto.barcode !== undefined ? { barcode: dto.barcode } : {}),
        ...(dto.hsnCode !== undefined ? { hsnCode: dto.hsnCode } : {}),
        ...(dto.skuType !== undefined ? { skuType: dto.skuType } : {}),
        ...(dto.shelfLifeDays !== undefined
          ? { shelfLifeDays: dto.shelfLifeDays }
          : {}),
        ...(dto.reorderLevel !== undefined
          ? { reorderLevel: dto.reorderLevel }
          : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
        updatedBy: userId,
      },
      include: PRODUCT_INCLUDE,
    });

    for (const field of changedFields) {
      await this.auditLog.create({
        organizationId,
        actorId: userId,
        action: 'PRODUCT_UPDATED',
        entityType: 'product',
        entityId: id,
        field,
        oldValue: { [field]: oldValue[field] },
        newValue: { [field]: newValue[field] },
        ipAddress,
      });
    }

    await this.eventPublisher.publish(
      this.eventFactory.createEvent(
        PRODUCT_EVENTS.UPDATED,
        product.id,
        'Product',
        { changedFields, oldValue, newValue },
        { userId, organizationId, ipAddress },
      ),
    );

    return product;
  }

  async delete(
    id: string,
    userId: string,
    organizationId: string,
    ipAddress?: string,
  ): Promise<void> {
    const existing = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(
        `Product not found. The specified product ID (${id}) does not exist or has been removed.`,
      );
    }

    await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
        updatedBy: userId,
      },
    });

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: 'PRODUCT_DELETED',
      entityType: 'product',
      entityId: id,
      oldValue: { deletedAt: null },
      newValue: { deletedAt: new Date(), deletedBy: userId },
      ipAddress,
    });

    await this.eventPublisher.publish(
      this.eventFactory.createEvent(
        PRODUCT_EVENTS.ARCHIVED,
        id,
        'Product',
        { previousStatus: existing.status },
        { userId, organizationId, ipAddress },
      ),
    );
  }

  async activate(
    id: string,
    userId: string,
    organizationId: string,
    ipAddress?: string,
  ): Promise<Product> {
    const existing = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(
        `Product not found. The specified product ID (${id}) does not exist or has been removed.`,
      );
    }

    if (existing.status === ProductLifecycleStatus.ACTIVE) {
      throw new ConflictException('Product is already active');
    }

    if (
      existing.status !== ProductLifecycleStatus.DRAFT &&
      existing.status !== ProductLifecycleStatus.INACTIVE
    ) {
      throw new BadRequestException(
        `Product cannot be activated from status ${String(existing.status)}. Only DRAFT or INACTIVE products can be activated.`,
      );
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        status: ProductLifecycleStatus.ACTIVE,
        updatedBy: userId,
      },
      include: PRODUCT_INCLUDE,
    });

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: 'PRODUCT_ACTIVATED',
      entityType: 'product',
      entityId: id,
      oldValue: { status: existing.status },
      newValue: { status: ProductLifecycleStatus.ACTIVE },
      ipAddress,
    });

    await this.eventPublisher.publish(
      this.eventFactory.createEvent(
        PRODUCT_EVENTS.ACTIVATED,
        id,
        'Product',
        {
          previousStatus: existing.status,
          newStatus: ProductLifecycleStatus.ACTIVE,
        },
        { userId, organizationId, ipAddress },
      ),
    );

    return product;
  }

  async deactivate(
    id: string,
    userId: string,
    organizationId: string,
    ipAddress?: string,
  ): Promise<Product> {
    const existing = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(
        `Product not found. The specified product ID (${id}) does not exist or has been removed.`,
      );
    }

    if (existing.status === ProductLifecycleStatus.INACTIVE) {
      throw new ConflictException('Product is already inactive');
    }

    if (existing.status !== ProductLifecycleStatus.ACTIVE) {
      throw new BadRequestException(
        `Product cannot be deactivated from status ${existing.status}. Only ACTIVE products can be deactivated.`,
      );
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        status: ProductLifecycleStatus.INACTIVE,
        updatedBy: userId,
      },
      include: PRODUCT_INCLUDE,
    });

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: 'PRODUCT_DEACTIVATED',
      entityType: 'product',
      entityId: id,
      oldValue: { status: existing.status },
      newValue: { status: ProductLifecycleStatus.INACTIVE },
      ipAddress,
    });

    await this.eventPublisher.publish(
      this.eventFactory.createEvent(
        PRODUCT_EVENTS.DEACTIVATED,
        id,
        'Product',
        {
          previousStatus: existing.status,
          newStatus: ProductLifecycleStatus.INACTIVE,
        },
        { userId, organizationId, ipAddress },
      ),
    );

    return product;
  }
}
