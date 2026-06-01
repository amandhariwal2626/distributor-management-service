import { Injectable } from '@nestjs/common';
import { SessionStatus } from '@prisma/client';
import { PrismaService } from '@dms/database';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(input: {
    tenantId: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
  }) {
    const session = await this.prisma.session.create({
      data: {
        tenantId: input.tenantId,
        userId: input.userId,
        refreshTokenHash: input.refreshTokenHash,
        expiresAt: input.expiresAt,
        userAgent: input.userAgent,
        ipAddress: input.ipAddress,
      },
    });
    return session;
  }

  async rotateSession(
    sessionId: string,
    refreshTokenHash: string,
    expiresAt: Date,
  ) {
    const session = await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        refreshTokenHash,
        expiresAt,
        lastActivityAt: new Date(),
      },
    });
    return session;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { status: SessionStatus.REVOKED, revokedAt: new Date() },
    });
  }

  async isSessionActive(sessionId: string): Promise<boolean> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return false;
    }
    return (
      session.status === SessionStatus.ACTIVE &&
      session.expiresAt.getTime() > Date.now()
    );
  }
}
