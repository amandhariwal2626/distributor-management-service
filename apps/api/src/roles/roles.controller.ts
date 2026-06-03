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
import { createRoleSchema, updateRoleSchema } from '@dms/validations';
import { Permissions } from '../decorators/permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type { CreateRoleDto, UpdateRoleDto } from './dto/upsert-role.dto';
import { RolesService } from './roles.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('roles.read')
  findAll(
    @Headers('x-organization-id') organizationId: string,
  ): Promise<any[]> {
    return this.rolesService.findAll(organizationId);
  }

  @Post()
  @Permissions('roles.create')
  create(
    @Headers('x-organization-id') organizationId: string,
    @Req() req: Request & { user: { sub: string } },
    @Body(new ZodValidationPipe(createRoleSchema)) body: CreateRoleDto,
  ): Promise<any> {
    return this.rolesService.create(organizationId, req.user.sub, body);
  }

  @Patch(':id')
  @Permissions('roles.update')
  update(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body(new ZodValidationPipe(updateRoleSchema)) body: UpdateRoleDto,
  ): Promise<any> {
    return this.rolesService.update(organizationId, id, req.user.sub, body);
  }

  @Delete(':id')
  @Permissions('roles.delete')
  remove(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ): Promise<any> {
    return this.rolesService.remove(organizationId, id, req.user.sub);
  }
}
