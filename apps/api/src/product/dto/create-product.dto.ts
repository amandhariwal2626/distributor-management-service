import { IsString, IsOptional, IsEnum, IsInt, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductSkuType } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ description: 'Unique product code' })
  @IsString()
  productCode!: string;

  @ApiProperty({ description: 'Product name' })
  @IsString()
  productName!: string;

  @ApiPropertyOptional({ description: 'Short name / label' })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Sub-category ID' })
  @IsOptional()
  @IsUUID()
  subCategoryId?: string;

  @ApiPropertyOptional({ description: 'Brand ID' })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiPropertyOptional({ description: 'Manufacturer ID' })
  @IsOptional()
  @IsUUID()
  manufacturerId?: string;

  @ApiProperty({ description: 'UOM ID' })
  @IsString()
  uomId!: string;

  @ApiPropertyOptional({ description: 'Tax group ID' })
  @IsOptional()
  @IsUUID()
  taxGroupId?: string;

  @ApiPropertyOptional({ description: 'Barcode / GTIN' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ description: 'HSN code' })
  @IsOptional()
  @IsString()
  hsnCode?: string;

  @ApiProperty({ enum: ProductSkuType, description: 'SKU type' })
  @IsEnum(ProductSkuType)
  skuType!: ProductSkuType;

  @ApiPropertyOptional({ description: 'Shelf life in days' })
  @IsOptional()
  @IsInt()
  shelfLifeDays?: number;

  @ApiPropertyOptional({ description: 'Reorder level' })
  @IsOptional()
  @IsInt()
  reorderLevel?: number;

  @ApiPropertyOptional({ description: 'Image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
