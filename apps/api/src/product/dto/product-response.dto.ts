import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductLifecycleStatus, ProductSkuType } from '@prisma/client';

export class ProductResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() productCode!: string;
  @ApiProperty() productName!: string;
  @ApiPropertyOptional() shortName?: string;
  @ApiPropertyOptional() description?: string;
  @ApiPropertyOptional() categoryId?: string;
  @ApiPropertyOptional() subCategoryId?: string;
  @ApiPropertyOptional() brandId?: string;
  @ApiPropertyOptional() manufacturerId?: string;
  @ApiProperty() uomId!: string;
  @ApiPropertyOptional() taxGroupId?: string;
  @ApiPropertyOptional() barcode?: string;
  @ApiPropertyOptional() hsnCode?: string;
  @ApiProperty({ enum: ProductSkuType }) skuType!: ProductSkuType;
  @ApiPropertyOptional() shelfLifeDays?: number;
  @ApiPropertyOptional() reorderLevel?: number;
  @ApiPropertyOptional() imageUrl?: string;
  @ApiProperty({ enum: ProductLifecycleStatus })
  status!: ProductLifecycleStatus;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
  @ApiPropertyOptional() createdBy?: string;
  @ApiPropertyOptional() updatedBy?: string;
  @ApiPropertyOptional() deletedAt?: Date;
  @ApiPropertyOptional() deletedBy?: string;
}
