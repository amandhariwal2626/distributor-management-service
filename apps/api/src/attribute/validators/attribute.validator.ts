import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AttributeDataType } from '@prisma/client';

@Injectable()
export class AttributeValidator {
  constructor(private readonly prisma: PrismaService) {}

  async validateAttributeCode(code: string, excludeId?: string): Promise<void> {
    const existing = await this.prisma.attributeDefinition.findFirst({
      where: {
        attributeCode: code,
        deletedAt: null,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException(
        `Attribute code '${code}' already exists. Attribute codes must be unique.`,
      );
    }
  }

  validateAttributeValue(dataType: AttributeDataType, value: string): void {
    if (!value) {
      throw new BadRequestException('Attribute value cannot be empty.');
    }

    switch (dataType) {
      case AttributeDataType.NUMBER: {
        const num = Number(value);
        if (isNaN(num)) {
          throw new BadRequestException(
            `The value '${value}' is not a valid number. Please provide a numeric value for this attribute.`,
          );
        }
        break;
      }

      case AttributeDataType.BOOLEAN: {
        const lower = value.toLowerCase();
        if (!['true', 'false', '1', '0', 'yes', 'no'].includes(lower)) {
          throw new BadRequestException(
            `The value '${value}' is not a valid boolean. Accepted values: true, false, 1, 0, yes, no.`,
          );
        }
        break;
      }

      case AttributeDataType.DATE: {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new BadRequestException(
            `The value '${value}' is not a valid date. Please use ISO 8601 format (e.g., 2024-01-01).`,
          );
        }
        break;
      }

      case AttributeDataType.DROPDOWN:
      case AttributeDataType.TEXT:
      default:
        break;
    }
  }
}
