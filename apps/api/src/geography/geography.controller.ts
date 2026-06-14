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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { GeographyService } from './geography.service';

@ApiTags('Geography')
@ApiBearerAuth()
@Controller('geography')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GeographyController {
  constructor(private readonly geographyService: GeographyService) {}

  // ── Countries ──────────────────────────────────────────────────

  @Get('countries')
  @Permissions('geography.read')
  @ApiOperation({ summary: 'List all countries' })
  getCountries(@Headers('x-organization-id') organizationId: string) {
    return this.geographyService.getCountries(organizationId);
  }

  @Post('countries')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Create a country' })
  createCountry(
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body()
    body: { code: string; name: string; isoCode?: string; currency?: string },
  ) {
    return this.geographyService.createCountry(
      organizationId,
      body,
      req.user.sub,
    );
  }

  @Patch('countries/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Update a country' })
  updateCountry(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body() body: { name?: string; isoCode?: string; currency?: string },
  ) {
    return this.geographyService.updateCountry(
      organizationId,
      id,
      body,
      req.user.sub,
    );
  }

  @Delete('countries/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Delete a country' })
  deleteCountry(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.geographyService.deleteCountry(
      organizationId,
      id,
      req.user.sub,
    );
  }

  // ── States ─────────────────────────────────────────────────────

  @Get('states')
  @Permissions('geography.read')
  @ApiOperation({ summary: 'List states (optionally by country)' })
  @ApiQuery({ name: 'countryId', required: false })
  getStates(
    @Headers('x-organization-id') organizationId: string,
    @Query('countryId') countryId?: string,
  ) {
    return this.geographyService.getStates(organizationId, countryId);
  }

  @Post('states')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Create a state' })
  createState(
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body()
    body: { countryId: string; code: string; name: string; gstCode?: string },
  ) {
    return this.geographyService.createState(
      organizationId,
      body,
      req.user.sub,
    );
  }

  @Patch('states/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Update a state' })
  updateState(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body() body: { name?: string; gstCode?: string },
  ) {
    return this.geographyService.updateState(
      organizationId,
      id,
      body,
      req.user.sub,
    );
  }

  @Delete('states/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Delete a state' })
  deleteState(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.geographyService.deleteState(organizationId, id, req.user.sub);
  }

  // ── Zones ──────────────────────────────────────────────────────

  @Get('zones')
  @Permissions('geography.read')
  @ApiOperation({ summary: 'List zones (optionally by state)' })
  @ApiQuery({ name: 'stateId', required: false })
  getZones(
    @Headers('x-organization-id') organizationId: string,
    @Query('stateId') stateId?: string,
  ) {
    return this.geographyService.getZones(organizationId, stateId);
  }

  @Post('zones')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Create a zone' })
  createZone(
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body() body: { stateId: string; code: string; name: string },
  ) {
    return this.geographyService.createZone(organizationId, body, req.user.sub);
  }

  @Patch('zones/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Update a zone' })
  updateZone(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body() body: { name?: string },
  ) {
    return this.geographyService.updateZone(
      organizationId,
      id,
      body,
      req.user.sub,
    );
  }

  @Delete('zones/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Delete a zone' })
  deleteZone(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.geographyService.deleteZone(organizationId, id, req.user.sub);
  }

  // ── Regions ────────────────────────────────────────────────────

  @Get('regions')
  @Permissions('geography.read')
  @ApiOperation({ summary: 'List regions (optionally by zone)' })
  @ApiQuery({ name: 'zoneId', required: false })
  getRegions(
    @Headers('x-organization-id') organizationId: string,
    @Query('zoneId') zoneId?: string,
  ) {
    return this.geographyService.getRegions(organizationId, zoneId);
  }

  @Post('regions')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Create a region' })
  createRegion(
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body() body: { zoneId: string; code: string; name: string },
  ) {
    return this.geographyService.createRegion(
      organizationId,
      body,
      req.user.sub,
    );
  }

  @Patch('regions/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Update a region' })
  updateRegion(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body() body: { name?: string },
  ) {
    return this.geographyService.updateRegion(
      organizationId,
      id,
      body,
      req.user.sub,
    );
  }

  @Delete('regions/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Delete a region' })
  deleteRegion(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.geographyService.deleteRegion(organizationId, id, req.user.sub);
  }

  // ── Depots ─────────────────────────────────────────────────────

  @Get('depots')
  @Permissions('geography.read')
  @ApiOperation({ summary: 'List depots (optionally by region)' })
  @ApiQuery({ name: 'regionId', required: false })
  getDepots(
    @Headers('x-organization-id') organizationId: string,
    @Query('regionId') regionId?: string,
  ) {
    return this.geographyService.getDepots(organizationId, regionId);
  }

  @Post('depots')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Create a depot' })
  createDepot(
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body()
    body: {
      regionId: string;
      code: string;
      name: string;
      address?: string;
      city?: string;
      pincode?: string;
    },
  ) {
    return this.geographyService.createDepot(
      organizationId,
      body,
      req.user.sub,
    );
  }

  @Patch('depots/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Update a depot' })
  updateDepot(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body()
    body: { name?: string; address?: string; city?: string; pincode?: string },
  ) {
    return this.geographyService.updateDepot(
      organizationId,
      id,
      body,
      req.user.sub,
    );
  }

  @Delete('depots/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Delete a depot' })
  deleteDepot(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.geographyService.deleteDepot(organizationId, id, req.user.sub);
  }

  // ── Geography Tree ─────────────────────────────────────────────

  @Get('tree')
  @Permissions('geography.read')
  @ApiOperation({ summary: 'Get full geography hierarchy tree' })
  getTree(@Headers('x-organization-id') organizationId: string) {
    return this.geographyService.getTree(organizationId);
  }

  // ── Product Geography Mappings ─────────────────────────────────

  @Post('map')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Create a product-geography mapping' })
  createMapping(
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body()
    body: {
      productId: string;
      countryId?: string;
      stateId?: string;
      zoneId?: string;
      regionId?: string;
      depotId?: string;
      availabilityStatus?: string;
      launchDate?: string;
    },
  ) {
    return this.geographyService.createMapping(
      organizationId,
      body,
      req.user.sub,
    );
  }

  @Patch('map/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Update a product-geography mapping' })
  updateMapping(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Body() body: { availabilityStatus?: string; launchDate?: string },
  ) {
    return this.geographyService.updateMapping(
      organizationId,
      id,
      body,
      req.user.sub,
    );
  }

  @Delete('map/:id')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Delete a product-geography mapping' })
  deleteMapping(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.geographyService.deleteMapping(
      organizationId,
      id,
      req.user.sub,
    );
  }

  @Get('product/:productId')
  @Permissions('geography.read')
  @ApiOperation({ summary: 'Get geography mappings for a product' })
  getProductMappings(
    @Headers('x-organization-id') organizationId: string,
    @Param('productId') productId: string,
  ) {
    return this.geographyService.getProductMappings(organizationId, productId);
  }

  @Get('available-products')
  @Permissions('geography.read')
  @ApiOperation({ summary: 'Get available products by geography' })
  @ApiQuery({ name: 'stateId', required: false })
  @ApiQuery({ name: 'zoneId', required: false })
  @ApiQuery({ name: 'regionId', required: false })
  @ApiQuery({ name: 'depotId', required: false })
  getAvailableProducts(
    @Headers('x-organization-id') organizationId: string,
    @Query('stateId') stateId?: string,
    @Query('zoneId') zoneId?: string,
    @Query('regionId') regionId?: string,
    @Query('depotId') depotId?: string,
  ) {
    return this.geographyService.getAvailableProducts(organizationId, {
      stateId,
      zoneId,
      regionId,
      depotId,
    });
  }

  @Post('activate-launched')
  @Permissions('geography.manage')
  @ApiOperation({ summary: 'Activate all pending launched mappings' })
  activateLaunched(
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.geographyService.activateLaunched(organizationId, req.user.sub);
  }
}
