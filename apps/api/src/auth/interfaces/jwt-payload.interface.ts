export interface JwtPayload {
  sub: string;
  tenantId: string;
  email: string;
  roles: string[];
  permissions: string[];
  sessionId: string;
  jti: string;
}
