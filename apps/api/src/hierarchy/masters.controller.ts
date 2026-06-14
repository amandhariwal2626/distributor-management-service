import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { HierarchyService } from './hierarchy.service';

@ApiTags('Masters Lookups')
@ApiBearerAuth()
@Controller('masters')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MastersController {
  constructor(private readonly hierarchyService: HierarchyService) {}

  @Get('business-units')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'List all business units (FE lookup)' })
  getBusinessUnits() {
    return this.hierarchyService.getBusinessUnits();
  }

  @Get('divisions')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'List divisions (FE lookup)' })
  getDivisions(@Query('buId') buId?: string) {
    return this.hierarchyService.getDivisions(buId);
  }
}
