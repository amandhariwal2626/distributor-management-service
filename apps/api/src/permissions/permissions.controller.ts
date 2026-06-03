import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions('roles.manage')
  findAll(
    @Headers('x-organization-id') organizationId: string,
  ): Promise<Permission[]> {
    return this.permissionsService.findAll(organizationId);
  }
}
