import {
  Body,
  Controller,
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
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { UsersService } from './users.service';
import { ListUsersDto } from './dto/list-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('users.read')
  findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: ListUsersDto,
  ) {
    return this.usersService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('users.read')
  findById(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.usersService.findById(tenantId, id);
  }

  @Post()
  @Permissions('users.create')
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() body: CreateUserDto,
  ) {
    return this.usersService.create(tenantId, req.user.sub, body);
  }

  @Patch(':id')
  @Permissions('users.update')
  update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(tenantId, id, req.user.sub, body);
  }

  @Patch(':id/deactivate')
  @Permissions('users.update')
  deactivate(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.usersService.deactivate(tenantId, id, req.user.sub);
  }

  @Patch(':id/reactivate')
  @Permissions('users.update')
  reactivate(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.usersService.reactivate(tenantId, id, req.user.sub);
  }
}
