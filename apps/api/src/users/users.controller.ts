import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  createUserSchema,
  updateUserSchema,
  listUsersSchema,
  adminResetPasswordSchema,
} from '@dms/validations';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { UsersService } from './users.service';
import type { ListUsersDto } from './dto/list-users.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

function getIp(req: Request, forwardedFor?: string): string | undefined {
  return forwardedFor || req.ip;
}

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('users.read')
  findAll(
    @Headers('x-organization-id') organizationId: string,
    @Query(new ZodValidationPipe(listUsersSchema)) query: ListUsersDto,
  ): Promise<any> {
    return this.usersService.findAll(organizationId, query);
  }

  @Get('create-options')
  @Permissions('users.read')
  getCreateOptions(
    @Headers('x-organization-id') organizationId: string,
  ): Promise<any> {
    return this.usersService.getCreateOptions(organizationId);
  }

  @Get('hierarchy/tree')
  @Permissions('hierarchy.view')
  getHierarchyTree(
    @Headers('x-organization-id') organizationId: string,
  ): Promise<any[]> {
    return this.usersService.getHierarchyTree(organizationId);
  }

  @Get(':id')
  @Permissions('users.read')
  findById(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
  ): Promise<any> {
    return this.usersService.findById(organizationId, id);
  }

  @Post()
  @Permissions('users.create')
  create(
    @Headers('x-organization-id') organizationId: string,
    @Req() req: Request & { user: { sub: string; roles: string[] } },
    @Body(new ZodValidationPipe(createUserSchema)) body: CreateUserDto,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<any> {
    return this.usersService.create(
      organizationId,
      req.user.sub,
      req.user.roles,
      body,
      getIp(req, forwardedFor),
    );
  }

  @Patch(':id')
  @Permissions('users.update')
  update(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string; roles: string[] } },
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDto,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<any> {
    return this.usersService.update(
      organizationId,
      id,
      req.user.sub,
      req.user.roles,
      body,
      getIp(req, forwardedFor),
    );
  }

  @Delete(':id')
  @Permissions('users.delete')
  delete(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<any> {
    return this.usersService.delete(
      organizationId,
      id,
      req.user.sub,
      getIp(req, forwardedFor),
    );
  }

  @Patch(':id/deactivate')
  @Permissions('users.update')
  deactivate(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<any> {
    return this.usersService.deactivate(
      organizationId,
      id,
      req.user.sub,
      getIp(req, forwardedFor),
    );
  }

  @Patch(':id/reactivate')
  @Permissions('users.update')
  reactivate(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<any> {
    return this.usersService.reactivate(
      organizationId,
      id,
      req.user.sub,
      getIp(req, forwardedFor),
    );
  }

  @Patch(':id/lock')
  @Permissions('users.lock')
  lock(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<any> {
    return this.usersService.lock(
      organizationId,
      id,
      req.user.sub,
      getIp(req, forwardedFor),
    );
  }

  @Patch(':id/unlock')
  @Permissions('users.unlock')
  unlock(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<any> {
    return this.usersService.unlock(
      organizationId,
      id,
      req.user.sub,
      getIp(req, forwardedFor),
    );
  }

  @Patch(':id/suspend')
  @Permissions('users.update')
  suspend(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<any> {
    return this.usersService.suspend(
      organizationId,
      id,
      req.user.sub,
      getIp(req, forwardedFor),
    );
  }

  @Post(':id/reset-password')
  @Permissions('users.reset_password')
  resetPassword(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body(new ZodValidationPipe(adminResetPasswordSchema))
    body: { password: string },
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<any> {
    return this.usersService.adminResetPassword(
      organizationId,
      id,
      req.user.sub,
      body.password,
      getIp(req, forwardedFor),
    );
  }
}
