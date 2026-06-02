import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InvitesService {
  constructor(private readonly prisma: PrismaService) {}

  async createInvite(
    organizationId: string,
    userId: string,
    actorUserId: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, organizationId, deletedAt: null },
    });
    if (!user) throw new NotFoundException('User not found');
    const rawToken = `${randomUUID()}${randomUUID()}`;
    const tokenHash = await bcrypt.hash(rawToken, 12);
    await this.prisma.inviteToken.create({
      data: {
        organizationId,
        userId: user.id,
        invitedEmail: user.email,
        tokenHash,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
        inviteSentBy: actorUserId,
      },
    });
    return {
      token: rawToken,
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
    };
  }

  async resendInvite(
    organizationId: string,
    userId: string,
    actorUserId: string,
  ) {
    return this.createInvite(organizationId, userId, actorUserId);
  }

  async acceptInvite(token: string, passwordHash: string) {
    const invites = await this.prisma.inviteToken.findMany({
      where: {
        acceptedAt: null,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    let matched: (typeof invites)[number] | null = null;
    for (const invite of invites) {
      if (await bcrypt.compare(token, invite.tokenHash)) {
        matched = invite;
        break;
      }
    }
    if (!matched) throw new BadRequestException('Invalid invite token');
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: matched.userId },
        data: { passwordHash, status: 'ACTIVE', updatedAt: new Date() },
      }),
      this.prisma.inviteToken.update({
        where: { id: matched.id },
        data: { acceptedAt: new Date() },
      }),
    ]);
    return { success: true };
  }
}
