import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PriceValidator {
  constructor(private readonly prisma: PrismaService) {}

  async validatePriceRules(data: {
    mrp: number;
    ptr: number;
    pts: number;
    distributorPrice: number;
  }): Promise<string[]> {
    const errors: string[] = [];

    if (data.mrp < data.ptr) {
      errors.push(
        'MRP (Maximum Retail Price) must be greater than or equal to PTR (Price to Retailer).',
      );
    }

    if (data.ptr < data.pts) {
      errors.push(
        'PTR (Price to Retailer) must be greater than or equal to PTS (Price to Stockist).',
      );
    }

    if (data.pts < data.distributorPrice) {
      errors.push(
        'PTS (Price to Stockist) must be greater than or equal to Distributor Price.',
      );
    }

    return errors;
  }

  async validateEffectiveDate(
    productId: string,
    effectiveFrom: Date,
    effectiveTo: Date | null,
    excludeId?: string,
  ): Promise<string[]> {
    const errors: string[] = [];

    const where: Record<string, unknown> = {
      productId,
      deletedAt: null,
      effectiveTo: null,
    };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existing = await this.prisma.productPrice.findFirst({
      where: where as never,
    });

    if (existing) {
      errors.push(
        'An open-ended price entry (no effectiveTo date) already exists for this product. Please set an effectiveTo date on the existing price before creating a new one.',
      );
    }

    const overlapping = await this.prisma.productPrice.findFirst({
      where: {
        productId,
        deletedAt: null,
        id: excludeId ? { not: excludeId } : undefined,
        OR: [
          {
            effectiveFrom: { lte: effectiveTo ?? new Date('9999-12-31') },
            effectiveTo: { gte: effectiveFrom },
          },
        ],
      } as never,
    });

    if (overlapping && !existing) {
      errors.push(
        'The effective date range overlaps with an existing price for this product.',
      );
    }

    return errors;
  }
}
