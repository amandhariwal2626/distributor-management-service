import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDocumentDto, userId: string, organizationId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException(
        `Product not found. The product with ID '${dto.productId}' does not exist.`,
      );
    }

    return this.prisma.prodDocument.create({
      data: {
        companyId: organizationId,
        productId: dto.productId,
        documentType: dto.documentType,
        fileName: dto.fileName,
        filePath: dto.filePath,
        createdBy: userId,
      },
    });
  }

  async findAll(productId?: string, documentType?: string) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (productId) where.productId = productId;
    if (documentType) where.documentType = documentType;

    return this.prisma.prodDocument.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.prodDocument.findFirst({
      where: { id, deletedAt: null },
    });
    if (!document) {
      throw new NotFoundException(
        `Document not found. The document with ID '${id}' does not exist.`,
      );
    }
    return document;
  }

  async update(id: string, dto: UpdateDocumentDto, userId: string) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};
    if (dto.documentType !== undefined) data.documentType = dto.documentType;
    if (dto.fileName !== undefined) data.fileName = dto.fileName;
    data.updatedBy = userId;

    return this.prisma.prodDocument.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);

    return this.prisma.prodDocument.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }
}
