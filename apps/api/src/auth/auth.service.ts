import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesService } from '../roles/roles.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
    private readonly permissionsService: PermissionsService,
    private readonly rolesService: RolesService,
  ) {}

  async login(
    dto: LoginDto,
    context: { userAgent?: string; ipAddress?: string },
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    sessionId: string;
    user: unknown;
  }> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { code: dto.tenantCode },
    });
    if (!tenant) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const user = await this.prisma.user.findUnique({
      where: {
        tenantId_email: { tenantId: tenant.id, email: dto.email },
      },
    });
    if (!user || user.deletedAt || !user.isActive || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const roles = await this.rolesService.getUserRoles(user.id);
    const permissions = await this.permissionsService.getUserPermissions(
      user.id,
    );
    const refreshToken = randomUUID() + randomUUID();
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    const refreshTtlDays = this.configService.get<number>(
      'JWT_REFRESH_TTL_DAYS',
      7,
    );
    const session = await this.sessionsService.createSession({
      tenantId: tenant.id,
      userId: user.id,
      refreshTokenHash,
      expiresAt: new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000),
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
    });
    const payload: JwtPayload = {
      sub: user.id,
      tenantId: tenant.id,
      email: user.email,
      roles: roles,
      permissions,
      sessionId: session.id,
      jti: randomUUID(),
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'dev-secret'),
      expiresIn: '15m',
    });
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    return {
      accessToken,
      refreshToken,
      sessionId: session.id,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        tenantId: user.tenantId,
        roles,
        permissions,
      },
    };
  }

  async signup(dto: SignupDto): Promise<{
    id: string;
    email: string;
    fullName: string;
    tenantId: string;
  }> {
    let tenant = await this.prisma.tenant.findUnique({
      where: { code: dto.tenantCode },
    });

    if (!tenant) {
      tenant = await this.prisma.tenant.create({
        data: {
          code: dto.tenantCode,
          name: dto.tenantCode,
        },
      });
    }

    const existing = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email: dto.email,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const [firstName, ...rest] = dto.fullName.trim().split(' ');
    const lastName = rest.join(' ') || '-';
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: dto.email,
        firstName,
        lastName,
        fullName: dto.fullName,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        tenantId: true,
      },
    });

    return user;
  }

  async refresh(
    sessionId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (
      !session ||
      session.expiresAt.getTime() <= Date.now() ||
      session.revokedAt
    ) {
      throw new UnauthorizedException('Invalid session');
    }
    const valid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
    if (!valid) {
      await this.sessionsService.revokeSession(session.id);
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!user || user.deletedAt || !user.isActive) {
      throw new UnauthorizedException('Invalid session');
    }
    const roles = await this.rolesService.getUserRoles(user.id);
    const permissions = await this.permissionsService.getUserPermissions(
      user.id,
    );
    const newRefreshToken = randomUUID() + randomUUID();
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 12);
    const refreshTtlDays = this.configService.get<number>(
      'JWT_REFRESH_TTL_DAYS',
      7,
    );
    await this.sessionsService.rotateSession(
      session.id,
      newRefreshTokenHash,
      new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000),
    );
    const payload: JwtPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      roles: roles,
      permissions,
      sessionId: session.id,
      jti: randomUUID(),
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'dev-secret'),
      expiresIn: '15m',
    });
    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionsService.revokeSession(sessionId);
  }

  async me(userId: string): Promise<unknown> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        tenantId: true,
        isActive: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const roles = await this.rolesService.getUserRoles(userId);
    const permissions =
      await this.permissionsService.getUserPermissions(userId);
    return { ...user, roles, permissions };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { code: dto.tenantCode },
    });
    if (!tenant) {
      return;
    }
    const user = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId: tenant.id, email: dto.email } },
    });
    if (!user) {
      return;
    }
    const rawToken = randomUUID() + randomUUID();
    const tokenHash = await bcrypt.hash(rawToken, 12);
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const tokens = await this.prisma.passwordResetToken.findMany({
      where: { usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    const match = await this.findMatchingToken(tokens, dto.token);
    if (!match) {
      throw new BadRequestException('Invalid reset token');
    }
    await this.prisma.user.update({
      where: { id: match.userId },
      data: { passwordHash: await bcrypt.hash(dto.password, 12) },
    });
    await this.prisma.passwordResetToken.update({
      where: { id: match.id },
      data: { usedAt: new Date() },
    });
  }

  private async findMatchingToken(
    tokens: { id: string; tokenHash: string; userId: string }[],
    token: string,
  ): Promise<{ id: string; tokenHash: string; userId: string } | null> {
    for (const stored of tokens) {
      const valid = await bcrypt.compare(token, stored.tokenHash);
      if (valid) {
        return stored;
      }
    }
    return null;
  }
}
