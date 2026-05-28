import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Permissions } from '../decorators/permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateRoleDto, UpdateRoleDto } from './dto/upsert-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('roles.manage')
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.rolesService.findAll(tenantId);
  }

  @Post()
  @Permissions('roles.manage')
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() body: CreateRoleDto,
  ) {
    return this.rolesService.create(tenantId, req.user.sub, body);
  }

  @Patch(':id')
  @Permissions('roles.manage')
  update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() body: UpdateRoleDto,
  ) {
    return this.rolesService.update(tenantId, id, req.user.sub, body);
  }

  @Delete(':id')
  @Permissions('roles.manage')
  remove(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.rolesService.remove(tenantId, id, req.user.sub);
  }
}
