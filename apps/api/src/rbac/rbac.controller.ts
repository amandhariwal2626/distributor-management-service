import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Permission } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { RbacService } from './rbac.service';
import { PermissionOverrideDto } from './dto/permission-override.dto';

@ApiTags('RBAC')
@ApiBearerAuth()
@Controller('rbac')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('permissions')
  @Permissions('roles.manage')
  @ApiOperation({ summary: 'List all permissions for the organization' })
  @ApiResponse({ status: 200, description: 'Returns all permissions' })
  getAllPermissions(
    @Headers('x-organization-id') organizationId: string,
  ): Promise<Permission[]> {
    return this.rbacService.getAllPermissions(organizationId);
  }

  @Get('users/:userId/permissions')
  @Permissions('roles.read')
  @ApiOperation({ summary: 'Get effective permissions for a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Returns list of permission codes' })
  getUserPermissions(
    @Headers('x-organization-id') organizationId: string,
    @Param('userId') userId: string,
  ): Promise<string[]> {
    return this.rbacService.getUserPermissions(userId, organizationId);
  }

  @Get('users/:userId/overrides')
  @Permissions('roles.read')
  @ApiOperation({ summary: 'Get permission overrides for a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Returns permission overrides' })
  getPermissionOverrides(@Param('userId') userId: string) {
    return this.rbacService.getPermissionOverrides(userId);
  }

  @Post('users/:userId/overrides')
  @Permissions('roles.manage')
  @ApiOperation({ summary: 'Set a permission override for a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 201, description: 'Override created or updated' })
  async setPermissionOverride(
    @Headers('x-organization-id') organizationId: string,
    @Param('userId') userId: string,
    @Body() body: PermissionOverrideDto,
    @Req() req: Request & { user: { sub: string } },
  ): Promise<{ message: string }> {
    await this.rbacService.assignPermissionOverride(
      userId,
      body.permissionId,
      body.granted,
      req.user.sub,
      organizationId,
    );
    return {
      message: `Permission ${body.granted ? 'granted' : 'revoked'} successfully.`,
    };
  }
}
