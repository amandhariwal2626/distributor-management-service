import { SetMetadata } from '@nestjs/common';
import { PRODUCT_PERMISSION_KEY } from '../guards/product-permission.guard';

export const RequireProductPermission = (permission: string) =>
  SetMetadata(PRODUCT_PERMISSION_KEY, permission);
