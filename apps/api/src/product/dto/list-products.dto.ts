import { IsOptional, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductLifecycleStatus, ProductSkuType } from '@prisma/client';
import { SearchDto } from '../../common/dto/pagination.dto';

export class ListProductsDto extends SearchDto {
  @ApiPropertyOptional({
    enum: ProductLifecycleStatus,
    description: 'Filter by product status',
  })
  @IsOptional()
  @IsEnum(ProductLifecycleStatus)
  status?: ProductLifecycleStatus;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by brand ID' })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiPropertyOptional({
    enum: ProductSkuType,
    description: 'Filter by SKU type',
  })
  @IsOptional()
  @IsEnum(ProductSkuType)
  skuType?: ProductSkuType;

  @ApiPropertyOptional({ description: 'Include soft-deleted products' })
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;
}
