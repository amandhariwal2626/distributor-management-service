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
import { HierarchyService } from './hierarchy.service';
import {
  CreateBrandDto,
  CreateBusinessUnitDto,
  CreateDivisionDto,
  CreateManufacturerDto,
  CreateProductCategoryDto,
  CreateProductSubCategoryDto,
  CreateSubBrandDto,
  CreateUomDto,
  UpdateBrandDto,
  UpdateBusinessUnitDto,
  UpdateDivisionDto,
  UpdateManufacturerDto,
  UpdateProductCategoryDto,
  UpdateProductSubCategoryDto,
  UpdateSubBrandDto,
  UpdateUomDto,
} from './dto';

@ApiTags('Product Hierarchy')
@ApiBearerAuth()
@Controller('hierarchy')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class HierarchyController {
  constructor(private readonly hierarchyService: HierarchyService) {}

  // ── Categories ────────────────────────────────────────────────

  @Post('categories')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Create a product category' })
  createCategory(
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: CreateProductCategoryDto,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.hierarchyService.createCategory(
      req.user.sub,
      organizationId,
      dto,
    );
  }

  @Get('categories')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'List all product categories' })
  getCategories() {
    return this.hierarchyService.getCategories();
  }

  @Get('categories/:id')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'Get a product category by ID' })
  getCategory(@Param('id') id: string) {
    return this.hierarchyService.getCategory(id);
  }

  @Get('categories/:id/sub-categories')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'Get sub-categories by category ID' })
  getSubCategoriesByCategoryId(@Param('id') id: string) {
    return this.hierarchyService.getSubCategories(id);
  }

  @Patch('categories/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Update a product category' })
  updateCategory(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: UpdateProductCategoryDto,
  ) {
    return this.hierarchyService.updateCategory(id, req.user.sub, dto);
  }

  @Delete('categories/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Soft-delete a product category' })
  deleteCategory(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.hierarchyService.deleteCategory(id, req.user.sub);
  }

  // ── Sub Categories ────────────────────────────────────────────

  @Post('subcategories')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Create a product sub-category' })
  createSubCategory(
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: CreateProductSubCategoryDto,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.hierarchyService.createSubCategory(
      req.user.sub,
      organizationId,
      dto,
    );
  }

  @Get('subcategories')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'List sub-categories (optionally by category)' })
  getSubCategories(@Query('categoryId') categoryId?: string) {
    return this.hierarchyService.getSubCategories(categoryId);
  }

  @Get('subcategories/:id')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'Get a sub-category by ID' })
  getSubCategory(@Param('id') id: string) {
    return this.hierarchyService.getSubCategory(id);
  }

  @Patch('subcategories/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Update a product sub-category' })
  updateSubCategory(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: UpdateProductSubCategoryDto,
  ) {
    return this.hierarchyService.updateSubCategory(id, req.user.sub, dto);
  }

  @Delete('subcategories/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Soft-delete a product sub-category' })
  deleteSubCategory(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.hierarchyService.deleteSubCategory(id, req.user.sub);
  }

  // ── Brands ────────────────────────────────────────────────────

  @Post('brands')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Create a brand' })
  createBrand(
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: CreateBrandDto,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.hierarchyService.createBrand(req.user.sub, organizationId, dto);
  }

  @Get('brands')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'List all brands' })
  getBrands() {
    return this.hierarchyService.getBrands();
  }

  @Get('brands/:id')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'Get a brand by ID' })
  getBrand(@Param('id') id: string) {
    return this.hierarchyService.getBrand(id);
  }

  @Get('brands/:id/sub-brands')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'Get sub-brands by brand ID' })
  getSubBrandsByBrandId(@Param('id') id: string) {
    return this.hierarchyService.getSubBrands(id);
  }

  @Patch('brands/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Update a brand' })
  updateBrand(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: UpdateBrandDto,
  ) {
    return this.hierarchyService.updateBrand(id, req.user.sub, dto);
  }

  @Delete('brands/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Soft-delete a brand' })
  deleteBrand(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.hierarchyService.deleteBrand(id, req.user.sub);
  }

  // ── Manufacturers ─────────────────────────────────────────────

  @Post('manufacturers')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Create a manufacturer' })
  createManufacturer(
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: CreateManufacturerDto,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.hierarchyService.createManufacturer(
      req.user.sub,
      organizationId,
      dto,
    );
  }

  @Get('manufacturers')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'List all manufacturers' })
  getManufacturers() {
    return this.hierarchyService.getManufacturers();
  }

  @Get('manufacturers/:id')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'Get a manufacturer by ID' })
  getManufacturer(@Param('id') id: string) {
    return this.hierarchyService.getManufacturer(id);
  }

  @Patch('manufacturers/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Update a manufacturer' })
  updateManufacturer(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: UpdateManufacturerDto,
  ) {
    return this.hierarchyService.updateManufacturer(id, req.user.sub, dto);
  }

  @Delete('manufacturers/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Soft-delete a manufacturer' })
  deleteManufacturer(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.hierarchyService.deleteManufacturer(id, req.user.sub);
  }

  // ── UOMs ──────────────────────────────────────────────────────

  @Post('uoms')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Create a UOM' })
  createUom(
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: CreateUomDto,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.hierarchyService.createUom(req.user.sub, organizationId, dto);
  }

  @Get('uoms')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'List all UOMs' })
  getUoms() {
    return this.hierarchyService.getUoms();
  }

  @Get('uoms/:id')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'Get a UOM by ID' })
  getUom(@Param('id') id: string) {
    return this.hierarchyService.getUom(id);
  }

  @Patch('uoms/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Update a UOM' })
  updateUom(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: UpdateUomDto,
  ) {
    return this.hierarchyService.updateUom(id, req.user.sub, dto);
  }

  @Delete('uoms/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Soft-delete a UOM' })
  deleteUom(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.hierarchyService.deleteUom(id, req.user.sub);
  }

  // ── Business Units ─────────────────────────────────────────────

  @Post('business-units')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Create a business unit' })
  createBusinessUnit(
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: CreateBusinessUnitDto,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.hierarchyService.createBusinessUnit(req.user.sub, organizationId, dto);
  }

  @Get('business-units')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'List all business units' })
  getBusinessUnits() {
    return this.hierarchyService.getBusinessUnits();
  }

  @Get('business-units/:id')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'Get a business unit by ID' })
  getBusinessUnit(@Param('id') id: string) {
    return this.hierarchyService.getBusinessUnit(id);
  }

  @Patch('business-units/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Update a business unit' })
  updateBusinessUnit(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: UpdateBusinessUnitDto,
  ) {
    return this.hierarchyService.updateBusinessUnit(id, req.user.sub, dto);
  }

  @Delete('business-units/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Soft-delete a business unit' })
  deleteBusinessUnit(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.hierarchyService.deleteBusinessUnit(id, req.user.sub);
  }

  // ── Divisions ──────────────────────────────────────────────────

  @Post('divisions')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Create a division' })
  createDivision(
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: CreateDivisionDto,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.hierarchyService.createDivision(req.user.sub, organizationId, dto);
  }

  @Get('divisions')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'List divisions (optionally by business unit)' })
  getDivisions(@Query('businessUnitId') businessUnitId?: string) {
    return this.hierarchyService.getDivisions(businessUnitId);
  }

  @Get('divisions/:id')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'Get a division by ID' })
  getDivision(@Param('id') id: string) {
    return this.hierarchyService.getDivision(id);
  }

  @Patch('divisions/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Update a division' })
  updateDivision(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: UpdateDivisionDto,
  ) {
    return this.hierarchyService.updateDivision(id, req.user.sub, dto);
  }

  @Delete('divisions/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Soft-delete a division' })
  deleteDivision(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.hierarchyService.deleteDivision(id, req.user.sub);
  }

  // ── Sub-Brands ─────────────────────────────────────────────────

  @Post('sub-brands')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Create a sub-brand' })
  createSubBrand(
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: CreateSubBrandDto,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.hierarchyService.createSubBrand(req.user.sub, organizationId, dto);
  }

  @Get('sub-brands')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'List sub-brands (optionally by brand)' })
  getSubBrands(@Query('brandId') brandId?: string) {
    return this.hierarchyService.getSubBrands(brandId);
  }

  @Get('sub-brands/:id')
  @Permissions('hierarchy.view')
  @ApiOperation({ summary: 'Get a sub-brand by ID' })
  getSubBrand(@Param('id') id: string) {
    return this.hierarchyService.getSubBrand(id);
  }

  @Patch('sub-brands/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Update a sub-brand' })
  updateSubBrand(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
    @Body() dto: UpdateSubBrandDto,
  ) {
    return this.hierarchyService.updateSubBrand(id, req.user.sub, dto);
  }

  @Delete('sub-brands/:id')
  @Permissions('product.create')
  @ApiOperation({ summary: 'Soft-delete a sub-brand' })
  deleteSubBrand(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.hierarchyService.deleteSubBrand(id, req.user.sub);
  }
}
