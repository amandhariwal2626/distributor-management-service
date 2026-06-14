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
import { TaxService } from './tax.service';
import { CreateTaxGroupDto, UpdateTaxGroupDto } from './dto';

@ApiTags('Tax Groups')
@Controller('tax-groups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post()
  @Permissions('tax.configure')
  @ApiOperation({ summary: 'Create a tax group' })
  create(
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: CreateTaxGroupDto,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.taxService.create(req.user.sub, organizationId, dto);
  }

  @Get()
  @Permissions('tax.read')
  @ApiOperation({ summary: 'List all tax groups' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      search?: string;
      status?: string;
    },
  ) {
    const status =
      query.status !== undefined ? query.status === 'true' : undefined;
    return this.taxService.findAll({ ...query, status });
  }

  @Get(':id')
  @Permissions('tax.read')
  @ApiOperation({ summary: 'Get tax group by ID' })
  findById(@Param('id') id: string) {
    return this.taxService.findById(id);
  }

  @Patch(':id')
  @Permissions('tax.configure')
  @ApiOperation({ summary: 'Update tax group' })
  update(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: UpdateTaxGroupDto,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.taxService.update(id, req.user.sub, organizationId, dto);
  }

  @Delete(':id')
  @Permissions('tax.configure')
  @ApiOperation({ summary: 'Soft delete tax group' })
  remove(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.taxService.softDelete(id, req.user.sub);
  }
}
