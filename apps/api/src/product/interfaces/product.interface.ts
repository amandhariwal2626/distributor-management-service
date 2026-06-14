import { ProductLifecycleStatus, ProductSkuType } from '@prisma/client';

export interface ProductFilter {
  search?: string;
  status?: ProductLifecycleStatus;
  categoryId?: string;
  brandId?: string;
  skuType?: ProductSkuType;
  includeDeleted?: boolean;
}
