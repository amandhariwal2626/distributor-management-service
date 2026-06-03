import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { resendInviteSchema, acceptInviteSchema } from '@dms/validations';
import { Permissions } from '../decorators/permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import type { AcceptInviteDto, ResendInviteDto } from './dto/invite.dto';
import { InvitesService } from './invites.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users.create')
  create(
    @Headers('x-organization-id') organizationId: string,
    @Body(new ZodValidationPipe(resendInviteSchema)) body: ResendInviteDto,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.invitesService.createInvite(
      organizationId,
      body.userId,
      req.user.sub,
    );
  }

  @Post('resend')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users.update')
  resend(
    @Headers('x-organization-id') organizationId: string,
    @Body(new ZodValidationPipe(resendInviteSchema)) body: ResendInviteDto,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.invitesService.resendInvite(
      organizationId,
      body.userId,
      req.user.sub,
    );
  }

  @Post('accept')
  @HttpCode(200)
  async accept(
    @Body(new ZodValidationPipe(acceptInviteSchema)) body: AcceptInviteDto,
  ) {
    const passwordHash = await bcrypt.hash(body.password, 12);
    return this.invitesService.acceptInvite(body.token, passwordHash);
  }
}
