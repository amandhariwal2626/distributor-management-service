import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  paginate,
  getPaginationSkip,
  buildOrderBy,
} from '../common/utils/pagination.helper';
import { CreateTaxGroupDto, UpdateTaxGroupDto } from './dto';

@Injectable()
export class TaxService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, organizationId: string, dto: CreateTaxGroupDto) {
    const existing = await this.prisma.taxGroup.findFirst({
      where: { taxCode: dto.taxCode, deletedAt: null },
    });
    if (existing) {
      throw new ConflictException(
        `Tax group with code '${dto.taxCode}' already exists. Each tax code must be unique.`,
      );
    }

    return this.prisma.taxGroup.create({
      data: {
        companyId: organizationId,
        taxCode: dto.taxCode,
        taxName: dto.taxName,
        cgst: dto.cgst,
        sgst: dto.sgst,
        igst: dto.igst,
        cess: dto.cess,
        status: dto.status ?? true,
        createdBy: userId,
      },
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    status?: boolean;
  }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.TaxGroupWhereInput = {
      deletedAt: null,
      ...(query.search
        ? {
            OR: [
              { taxCode: { contains: query.search, mode: 'insensitive' } },
              { taxName: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.status !== undefined ? { status: query.status } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.taxGroup.findMany({
        where,
        skip: getPaginationSkip(page, limit),
        take: limit,
        orderBy: buildOrderBy(query.sortBy, query.sortOrder),
      }),
      this.prisma.taxGroup.count({ where }),
    ]);

    return paginate(items, total, { page, limit });
  }

  async findById(id: string) {
    const taxGroup = await this.prisma.taxGroup.findFirst({
      where: { id, deletedAt: null },
    });
    if (!taxGroup) {
      throw new NotFoundException(
        `Tax group not found. The record with ID '${id}' does not exist.`,
      );
    }
    return taxGroup;
  }

  async update(
    id: string,
    userId: string,
    organizationId: string,
    dto: UpdateTaxGroupDto,
  ) {
    void organizationId;
    await this.findById(id);

    if (dto.taxCode) {
      const existing = await this.prisma.taxGroup.findFirst({
        where: { taxCode: dto.taxCode, id: { not: id }, deletedAt: null },
      });
      if (existing) {
        throw new ConflictException(
          `Tax group with code '${dto.taxCode}' already exists. Each tax code must be unique.`,
        );
      }
    }

    return this.prisma.taxGroup.update({
      where: { id },
      data: {
        ...(dto.taxCode !== undefined ? { taxCode: dto.taxCode } : {}),
        ...(dto.taxName !== undefined ? { taxName: dto.taxName } : {}),
        ...(dto.cgst !== undefined ? { cgst: dto.cgst } : {}),
        ...(dto.sgst !== undefined ? { sgst: dto.sgst } : {}),
        ...(dto.igst !== undefined ? { igst: dto.igst } : {}),
        ...(dto.cess !== undefined ? { cess: dto.cess } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        updatedBy: userId,
      },
    });
  }

  async softDelete(id: string, userId: string) {
    return this.prisma.taxGroup.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }
}
