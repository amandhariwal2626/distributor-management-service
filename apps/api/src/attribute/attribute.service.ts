import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-logs/audit-logs.service';
import {
  paginate,
  getPaginationSkip,
  buildOrderBy,
} from '../common/utils/pagination.helper';
import { AttributeValidator } from './validators/attribute.validator';
import {
  CreateAttributeDto,
  UpdateAttributeDto,
  SetAttributeValueDto,
} from './dto';

@Injectable()
export class AttributeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
    private readonly attributeValidator: AttributeValidator,
  ) {}

  // ==================== ATTRIBUTE DEFINITIONS CRUD ====================

  async create(
    organizationId: string,
    userId: string,
    dto: CreateAttributeDto,
  ) {
    await this.attributeValidator.validateAttributeCode(dto.attributeCode);

    const definition = await this.prisma.attributeDefinition.create({
      data: {
        companyId: organizationId,
        attributeName: dto.attributeName,
        attributeCode: dto.attributeCode,
        dataType: dto.dataType,
        mandatory: dto.mandatory ?? false,
        createdBy: userId,
      },
    });

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: 'CREATE',
      entityType: 'AttributeDefinition',
      entityId: definition.id,
      newValue: dto as unknown as Record<string, unknown>,
    });

    return definition;
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    dataType?: string;
    mandatory?: boolean;
  }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.AttributeDefinitionWhereInput = {
      deletedAt: null,
      ...(query.search
        ? {
            OR: [
              {
                attributeName: { contains: query.search, mode: 'insensitive' },
              },
              {
                attributeCode: { contains: query.search, mode: 'insensitive' },
              },
            ],
          }
        : {}),
      ...(query.dataType ? { dataType: query.dataType as any } : {}),
      ...(query.mandatory !== undefined ? { mandatory: query.mandatory } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.attributeDefinition.findMany({
        where,
        skip: getPaginationSkip(page, limit),
        take: limit,
        orderBy: buildOrderBy(query.sortBy, query.sortOrder),
      }),
      this.prisma.attributeDefinition.count({ where }),
    ]);

    return paginate(items, total, { page, limit });
  }

  async findById(id: string) {
    const definition = await this.prisma.attributeDefinition.findFirst({
      where: { id, deletedAt: null },
    });
    if (!definition) {
      throw new NotFoundException(
        `Attribute definition not found. The definition with ID '${id}' does not exist.`,
      );
    }
    return definition;
  }

  async update(
    organizationId: string,
    id: string,
    userId: string,
    dto: UpdateAttributeDto,
  ) {
    const existing = await this.findById(id);

    if (dto.attributeCode && dto.attributeCode !== existing.attributeCode) {
      await this.attributeValidator.validateAttributeCode(
        dto.attributeCode,
        id,
      );
    }

    const updateData: Prisma.AttributeDefinitionUpdateInput = {};
    if (dto.attributeName !== undefined)
      updateData.attributeName = dto.attributeName;
    if (dto.attributeCode !== undefined)
      updateData.attributeCode = dto.attributeCode;
    if (dto.dataType !== undefined) updateData.dataType = dto.dataType;
    if (dto.mandatory !== undefined) updateData.mandatory = dto.mandatory;
    updateData.updatedBy = userId;

    const updated = await this.prisma.attributeDefinition.update({
      where: { id },
      data: updateData,
    });

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: 'UPDATE',
      entityType: 'AttributeDefinition',
      entityId: id,
      oldValue: existing,
      newValue: updated,
    });

    return updated;
  }

  async delete(organizationId: string, id: string, userId: string) {
    const existing = await this.findById(id);

    const valueCount = await this.prisma.productAttributeValue.count({
      where: { attributeId: id, deletedAt: null },
    });

    const deleted = await this.prisma.attributeDefinition.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });

    if (valueCount > 0) {
      await this.prisma.productAttributeValue.updateMany({
        where: { attributeId: id },
        data: { deletedAt: new Date(), deletedBy: userId },
      });
    }

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: 'DELETE',
      entityType: 'AttributeDefinition',
      entityId: id,
      oldValue: existing,
    });

    return deleted;
  }

  // ==================== PRODUCT ATTRIBUTE VALUES ====================

  async setValue(
    organizationId: string,
    userId: string,
    dto: SetAttributeValueDto,
  ) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, deletedAt: null },
    });
    if (!product) {
      throw new NotFoundException(
        `Product not found. The product with ID '${dto.productId}' does not exist.`,
      );
    }

    const attribute = await this.prisma.attributeDefinition.findFirst({
      where: { id: dto.attributeId, deletedAt: null },
    });
    if (!attribute) {
      throw new NotFoundException(
        `Attribute definition not found. The definition with ID '${dto.attributeId}' does not exist.`,
      );
    }

    this.attributeValidator.validateAttributeValue(
      attribute.dataType,
      dto.value,
    );

    const existing = await this.prisma.productAttributeValue.findFirst({
      where: {
        productId: dto.productId,
        attributeId: dto.attributeId,
        deletedAt: null,
      },
    });

    let result;
    if (existing) {
      result = await this.prisma.productAttributeValue.update({
        where: { id: existing.id },
        data: { value: dto.value, updatedBy: userId },
      });
    } else {
      result = await this.prisma.productAttributeValue.create({
        data: {
          companyId: organizationId,
          productId: dto.productId,
          attributeId: dto.attributeId,
          value: dto.value,
          createdBy: userId,
        },
      });
    }

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: existing ? 'UPDATE' : 'CREATE',
      entityType: 'ProductAttributeValue',
      entityId: result.id,
      newValue: {
        productId: dto.productId,
        attributeId: dto.attributeId,
        value: dto.value,
      },
    });

    return result;
  }

  async getProductValues(productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
    });
    if (!product) {
      throw new NotFoundException(
        `Product not found. The product with ID '${productId}' does not exist.`,
      );
    }

    return this.prisma.productAttributeValue.findMany({
      where: { productId, deletedAt: null },
      include: { attribute: true },
    });
  }

  async findValueById(id: string) {
    const value = await this.prisma.productAttributeValue.findFirst({
      where: { id, deletedAt: null },
      include: { attribute: true },
    });
    if (!value) {
      throw new NotFoundException(
        `Attribute value not found. The value with ID '${id}' does not exist.`,
      );
    }
    return value;
  }

  async updateValue(
    organizationId: string,
    id: string,
    userId: string,
    dto: { value: string },
  ) {
    const existing = await this.findValueById(id);

    const attribute = await this.prisma.attributeDefinition.findFirst({
      where: { id: existing.attributeId, deletedAt: null },
    });
    if (!attribute) {
      throw new NotFoundException(
        `Attribute definition not found for the associated value.`,
      );
    }

    this.attributeValidator.validateAttributeValue(
      attribute.dataType,
      dto.value,
    );

    const updated = await this.prisma.productAttributeValue.update({
      where: { id },
      data: { value: dto.value, updatedBy: userId },
    });

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: 'UPDATE',
      entityType: 'ProductAttributeValue',
      entityId: id,
      oldValue: { value: existing.value },
      newValue: { value: dto.value },
    });

    return updated;
  }

  async deleteValue(organizationId: string, id: string, userId: string) {
    const existing = await this.findValueById(id);

    const deleted = await this.prisma.productAttributeValue.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });

    await this.auditLog.create({
      organizationId,
      actorId: userId,
      action: 'DELETE',
      entityType: 'ProductAttributeValue',
      entityId: id,
      oldValue: { value: existing.value },
    });

    return deleted;
  }
}
