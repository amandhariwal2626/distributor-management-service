import { RoleCode } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  tenantId: string;
  email: string;
  roles: RoleCode[];
  permissions: string[];
  sessionId: string;
  jti: string;
}
