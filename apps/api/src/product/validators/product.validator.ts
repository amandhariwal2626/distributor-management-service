import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductValidator {
  constructor(private readonly prisma: PrismaService) {}

  async validateCreate(data: {
    productCode: string;
    barcode?: string;
  }): Promise<string[]> {
    const errors: string[] = [];

    const existing = await this.prisma.product.findFirst({
      where: {
        deletedAt: null,
        OR: [
          { productCode: data.productCode },
          ...(data.barcode ? [{ barcode: data.barcode }] : []),
        ],
      },
    });

    if (existing) {
      if (existing.productCode === data.productCode) {
        errors.push('Product code already exists');
      }
      if (data.barcode && existing.barcode === data.barcode) {
        errors.push('Barcode already exists');
      }
    }

    return errors;
  }
}
