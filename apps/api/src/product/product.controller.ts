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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';

function getIp(req: Request, forwardedFor?: string): string | undefined {
  return forwardedFor || req.ip;
}

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Permissions('product.create')
  @ApiOperation({ summary: 'Create a new product' })
  async create(
    @Req() req: Request & { user: { sub: string; email: string } },
    @Body() body: CreateProductDto,
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ) {
    return this.productService.create(
      body,
      req.user.sub,
      organizationId,
      getIp(req, forwardedFor),
    );
  }

  @Get()
  @Permissions('product.read')
  @ApiOperation({ summary: 'List all products with pagination and filters' })
  async findAll(@Query() query: ListProductsDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @Permissions('product.read')
  @ApiOperation({ summary: 'Get product by ID' })
  async findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Patch(':id')
  @Permissions('product.edit')
  @ApiOperation({ summary: 'Update a product' })
  async update(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() body: UpdateProductDto,
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ) {
    return this.productService.update(
      id,
      body,
      req.user.sub,
      organizationId,
      getIp(req, forwardedFor),
    );
  }

  @Delete(':id')
  @Permissions('product.delete')
  @ApiOperation({ summary: 'Soft-delete a product' })
  async delete(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<void> {
    return this.productService.delete(
      id,
      req.user.sub,
      organizationId,
      getIp(req, forwardedFor),
    );
  }

  @Patch(':id/activate')
  @Permissions('product.approve')
  @ApiOperation({ summary: 'Activate a product' })
  async activate(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ) {
    return this.productService.activate(
      id,
      req.user.sub,
      organizationId,
      getIp(req, forwardedFor),
    );
  }

  @Patch(':id/deactivate')
  @Permissions('product.approve')
  @ApiOperation({ summary: 'Deactivate a product' })
  async deactivate(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ) {
    return this.productService.deactivate(
      id,
      req.user.sub,
      organizationId,
      getIp(req, forwardedFor),
    );
  }
}
