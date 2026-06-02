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
  @Permissions('roles.read')
  findAll(@Headers('x-organization-id') organizationId: string) {
    return this.rolesService.findAll(organizationId);
  }

  @Post()
  @Permissions('roles.create')
  create(
    @Headers('x-organization-id') organizationId: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() body: CreateRoleDto,
  ) {
    return this.rolesService.create(organizationId, req.user.sub, body);
  }

  @Patch(':id')
  @Permissions('roles.update')
  update(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() body: UpdateRoleDto,
  ) {
    return this.rolesService.update(organizationId, id, req.user.sub, body);
  }

  @Delete(':id')
  @Permissions('roles.delete')
  remove(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.rolesService.remove(organizationId, id, req.user.sub);
  }
}
