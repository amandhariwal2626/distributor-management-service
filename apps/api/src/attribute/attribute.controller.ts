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
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Permissions } from '../decorators/permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AttributeService } from './attribute.service';
import {
  CreateAttributeDto,
  UpdateAttributeDto,
  SetAttributeValueDto,
} from './dto';

@ApiTags('Attributes')
@Controller('attributes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  // ==================== DEFINITIONS ====================

  @Post('definitions')
  @Permissions('attribute.manage')
  @ApiOperation({ summary: 'Create an attribute definition' })
  createDefinition(
    @Headers('x-organization-id') organizationId: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: CreateAttributeDto,
  ) {
    return this.attributeService.create(organizationId, req.user.sub, dto);
  }

  @Get('definitions')
  @Permissions('attribute.read')
  @ApiOperation({ summary: 'List attribute definitions' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'dataType', required: false })
  @ApiQuery({ name: 'mandatory', required: false })
  findAllDefinitions(
    @Query()
    query: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      search?: string;
      dataType?: string;
      mandatory?: string;
    },
  ) {
    return this.attributeService.findAll({
      ...query,
      mandatory:
        query.mandatory !== undefined ? query.mandatory === 'true' : undefined,
    });
  }

  @Get('definitions/:id')
  @Permissions('attribute.read')
  @ApiOperation({ summary: 'Get attribute definition by ID' })
  findDefinitionById(@Param('id') id: string) {
    return this.attributeService.findById(id);
  }

  @Patch('definitions/:id')
  @Permissions('attribute.manage')
  @ApiOperation({ summary: 'Update attribute definition' })
  updateDefinition(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: UpdateAttributeDto,
  ) {
    return this.attributeService.update(organizationId, id, req.user.sub, dto);
  }

  @Delete('definitions/:id')
  @Permissions('attribute.manage')
  @ApiOperation({ summary: 'Soft delete attribute definition' })
  deleteDefinition(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.attributeService.delete(organizationId, id, req.user.sub);
  }

  // ==================== PRODUCT ATTRIBUTE VALUES ====================

  @Post('values')
  @Permissions('attribute.assign')
  @ApiOperation({ summary: 'Set attribute value for a product (upsert)' })
  setValue(
    @Headers('x-organization-id') organizationId: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: SetAttributeValueDto,
  ) {
    return this.attributeService.setValue(organizationId, req.user.sub, dto);
  }

  @Get('values/product/:productId')
  @Permissions('attribute.read')
  @ApiOperation({ summary: 'Get all attribute values for a product' })
  getProductValues(@Param('productId') productId: string) {
    return this.attributeService.getProductValues(productId);
  }

  @Get('values/:id')
  @Permissions('attribute.read')
  @ApiOperation({ summary: 'Get attribute value by ID' })
  findValueById(@Param('id') id: string) {
    return this.attributeService.findValueById(id);
  }

  @Patch('values/:id')
  @Permissions('attribute.assign')
  @ApiOperation({ summary: 'Update attribute value' })
  updateValue(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: { value: string },
  ) {
    return this.attributeService.updateValue(
      organizationId,
      id,
      req.user.sub,
      dto,
    );
  }

  @Delete('values/:id')
  @Permissions('attribute.assign')
  @ApiOperation({ summary: 'Soft delete attribute value' })
  deleteValue(
    @Headers('x-organization-id') organizationId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.attributeService.deleteValue(organizationId, id, req.user.sub);
  }
}
