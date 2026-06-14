import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

export const PRODUCT_PERMISSION_KEY = 'product_permission';

@Injectable()
export class ProductPermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PRODUCT_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermission) {
      return true;
    }
    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    return request.user.permissions.includes(requiredPermission);
  }
}
