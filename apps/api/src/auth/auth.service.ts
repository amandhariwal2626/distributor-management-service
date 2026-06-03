import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { AuditLogService } from '../audit-logs/audit-logs.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesService } from '../roles/roles.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SignupDto } from './dto/signup.dto';

const MAX_LOGIN_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
    private readonly permissionsService: PermissionsService,
    private readonly rolesService: RolesService,
    private readonly auditLog: AuditLogService,
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
    const organization = await this.prisma.organization.findUnique({
      where: { code: dto.organizationCode },
    });
    if (!organization) {
      throw new UnauthorizedException(
        'Organization not found. Please check your organization code.',
      );
    }
    const user = await this.prisma.user.findUnique({
      where: {
        organizationId_email: {
          organizationId: organization.id,
          email: dto.email,
        },
      },
      include: { profile: { select: { fullName: true } } },
    });

    if (!user || user.deletedAt || !user.passwordHash) {
      throw new UnauthorizedException(
        'This email is not registered in our system.',
      );
    }

    if (user.status === 'LOCKED') {
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new ForbiddenException(
          `Account is locked. Try again after ${user.lockedUntil.toISOString()}`,
        );
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: { status: 'ACTIVE', failedLoginAttempts: 0, lockedUntil: null },
      });
    }

    if (user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
      throw new UnauthorizedException(
        'Your account is inactive or suspended. Contact your administrator.',
      );
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      const attempts = user.failedLoginAttempts + 1;
      const lockData: Record<string, unknown> = {
        failedLoginAttempts: attempts,
      };

      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        lockData.status = 'LOCKED';
        lockData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        await this.prisma.user.update({
          where: { id: user.id },
          data: lockData as any,
        });
        await this.auditLog.create({
          organizationId: organization.id,
          actorId: user.id,
          action: 'ACCOUNT_LOCKED',
          entityType: 'user',
          entityId: user.id,
          newValue: { status: 'LOCKED', failedLoginAttempts: attempts },
          ipAddress: context.ipAddress,
        });
        throw new UnauthorizedException(
          `Incorrect password. Your account has been locked due to ${MAX_LOGIN_ATTEMPTS} failed attempts. Try again after 30 minutes.`,
        );
      } else {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: attempts },
        });
      }

      await this.auditLog.create({
        organizationId: organization.id,
        actorId: user.id,
        action: 'LOGIN_FAILED',
        entityType: 'user',
        entityId: user.id,
        newValue: { failedLoginAttempts: attempts },
        ipAddress: context.ipAddress,
      });

      throw new UnauthorizedException(
        `Incorrect password. ${MAX_LOGIN_ATTEMPTS - attempts} attempt(s) remaining before your account is locked.`,
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lastLoginAt: new Date() },
    });

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
      organizationId: organization.id,
      userId: user.id,
      refreshTokenHash,
      expiresAt: new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000),
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
    });
    const payload: JwtPayload = {
      sub: user.id,
      organizationId: organization.id,
      email: user.email,
      roles,
      permissions,
      sessionId: session.id,
      jti: randomUUID(),
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'dev-secret'),
      expiresIn: '15m',
    });
    return {
      accessToken,
      refreshToken,
      sessionId: session.id,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profile?.fullName,
        organizationId: user.organizationId,
        roles,
        permissions,
      },
    };
  }

  async signup(dto: SignupDto): Promise<{
    id: string;
    email: string;
    fullName: string;
    organizationId: string;
  }> {
    let organization = await this.prisma.organization.findUnique({
      where: { code: dto.organizationCode },
    });

    if (!organization) {
      organization = await this.prisma.organization.create({
        data: {
          code: dto.organizationCode,
          name: dto.organizationCode,
        },
      });
    }

    const existing = await this.prisma.user.findUnique({
      where: {
        organizationId_email: {
          organizationId: organization.id,
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
        organizationId: organization.id,
        email: dto.email,
        passwordHash,
        status: 'ACTIVE',
        profile: {
          create: {
            firstName,
            lastName,
            fullName: dto.fullName,
          },
        },
      },
      select: {
        id: true,
        email: true,
        organizationId: true,
        profile: { select: { fullName: true } },
      },
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.profile?.fullName ?? '',
      organizationId: user.organizationId,
    };
  }

  async refresh(
    sessionId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      throw new UnauthorizedException('Session not found. Please login again.');
    }
    if (session.revokedAt) {
      throw new UnauthorizedException(
        'Session has been revoked. Please login again.',
      );
    }
    if (session.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException(
        'Session has expired. Please login again.',
      );
    }
    const valid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
    if (!valid) {
      await this.sessionsService.revokeSession(session.id);
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found. Please login again.');
    }
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(
        `Your account is ${user.status.toLowerCase()}. Please contact your administrator.`,
      );
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
      organizationId: user.organizationId,
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
        organizationId: true,
        status: true,
        profile: { select: { fullName: true } },
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const roles = await this.rolesService.getUserRoles(userId);
    const permissions =
      await this.permissionsService.getUserPermissions(userId);
    return { ...user, fullName: user.profile?.fullName, roles, permissions };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const organization = await this.prisma.organization.findUnique({
      where: { code: dto.organizationCode },
    });
    if (!organization) {
      return;
    }
    const user = await this.prisma.user.findUnique({
      where: {
        organizationId_email: {
          organizationId: organization.id,
          email: dto.email,
        },
      },
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
      throw new BadRequestException(
        'Invalid or expired password reset token. Please request a new password reset link.',
      );
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
