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
import { ProductPrice } from '@prisma/client';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { PriceService } from './price.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { ListPricesDto } from './dto/list-prices.dto';
import { PaginatedResult } from '../common/interfaces';

function getIp(req: Request, forwardedFor?: string): string | undefined {
  return forwardedFor || req.ip;
}

@ApiTags('Prices')
@ApiBearerAuth()
@Controller('prices')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post()
  @Permissions('price.create')
  @ApiOperation({ summary: 'Create a new price record' })
  create(
    @Req() req: Request & { user: { sub: string; permissions: string[] } },
    @Body() dto: CreatePriceDto,
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<ProductPrice> {
    return this.priceService.create(
      dto,
      req.user.sub,
      organizationId,
      getIp(req, forwardedFor),
    );
  }

  @Get()
  @Permissions('price.read')
  @ApiOperation({ summary: 'List all price records (paginated, filterable)' })
  findAll(
    @Query() query: ListPricesDto,
  ): Promise<PaginatedResult<ProductPrice>> {
    return this.priceService.findAll(query);
  }

  @Get(':id')
  @Permissions('price.read')
  @ApiOperation({ summary: 'Get a price record by ID' })
  findById(@Param('id') id: string): Promise<ProductPrice> {
    return this.priceService.findById(id);
  }

  @Patch(':id')
  @Permissions('price.edit')
  @ApiOperation({ summary: 'Update a price record' })
  update(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string; permissions: string[] } },
    @Body() dto: UpdatePriceDto,
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<ProductPrice> {
    return this.priceService.update(
      id,
      dto,
      req.user.sub,
      organizationId,
      getIp(req, forwardedFor),
    );
  }

  @Delete(':id')
  @Permissions('price.delete')
  @ApiOperation({ summary: 'Soft delete a price record' })
  delete(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string; permissions: string[] } },
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<void> {
    return this.priceService.delete(
      id,
      req.user.sub,
      organizationId,
      getIp(req, forwardedFor),
    );
  }

  @Get('product/:productId/active')
  @Permissions('price.read')
  @ApiOperation({ summary: 'Get active price for a product' })
  getActivePrice(
    @Param('productId') productId: string,
  ): Promise<ProductPrice | null> {
    return this.priceService.getActivePrice(productId);
  }
}
