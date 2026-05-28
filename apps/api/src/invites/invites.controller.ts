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
import { Permissions } from '../decorators/permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { AcceptInviteDto, ResendInviteDto } from './dto/invite.dto';
import { InvitesService } from './invites.service';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users.create')
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: ResendInviteDto,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.invitesService.createInvite(
      tenantId,
      body.userId,
      req.user.sub,
    );
  }

  @Post('resend')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users.update')
  resend(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: ResendInviteDto,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.invitesService.resendInvite(
      tenantId,
      body.userId,
      req.user.sub,
    );
  }

  @Post('accept')
  @HttpCode(200)
  async accept(@Body() body: AcceptInviteDto) {
    const passwordHash = await bcrypt.hash(body.password, 12);
    return this.invitesService.acceptInvite(body.token, passwordHash);
  }
}
