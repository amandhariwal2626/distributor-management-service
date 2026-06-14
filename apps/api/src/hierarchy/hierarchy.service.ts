import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class HierarchyService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Product Category ──────────────────────────────────────────

  async createCategory(
    userId: string,
    organizationId: string,
    dto: CreateProductCategoryDto,
  ) {
    await this.ensureUniqueCode('productCategory', dto.categoryCode);
    return this.prisma.productCategory.create({
      data: {
        companyId: organizationId,
        categoryCode: dto.categoryCode,
        categoryName: dto.categoryName,
        description: dto.description,
        status: dto.status ?? true,
        createdBy: userId,
      },
    });
  }

  async getCategories() {
    return this.prisma.productCategory.findMany({
      where: { deletedAt: null },
      orderBy: { categoryName: 'asc' },
      include: { _count: { select: { subCategories: true } } },
    });
  }

  async getCategory(id: string) {
    const entity = await this.findCategoryOrFail(id);
    return entity;
  }

  async updateCategory(
    id: string,
    userId: string,
    dto: UpdateProductCategoryDto,
  ) {
    const existing = await this.findCategoryOrFail(id);
    if (dto.categoryCode && dto.categoryCode !== existing.categoryCode) {
      await this.ensureUniqueCode('productCategory', dto.categoryCode, id);
    }
    return this.prisma.productCategory.update({
      where: { id },
      data: { ...dto, updatedBy: userId },
    });
  }

  async deleteCategory(id: string, userId: string) {
    await this.findCategoryOrFail(id);
    return this.prisma.productCategory.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  private async findCategoryOrFail(id: string) {
    const entity = await this.prisma.productCategory.findFirst({
      where: { id, deletedAt: null },
    });
    if (!entity) {
      throw new NotFoundException(
        `Product category not found. The specified ID (${id}) does not exist or has been removed.`,
      );
    }
    return entity;
  }

  // ── Product Sub Category ──────────────────────────────────────

  async createSubCategory(
    userId: string,
    organizationId: string,
    dto: CreateProductSubCategoryDto,
  ) {
    await this.ensureUniqueCode('productSubCategory', dto.subCategoryCode);
    await this.findCategoryOrFail(dto.categoryId);
    return this.prisma.productSubCategory.create({
      data: {
        companyId: organizationId,
        categoryId: dto.categoryId,
        subCategoryCode: dto.subCategoryCode,
        subCategoryName: dto.subCategoryName,
        description: dto.description,
        status: dto.status ?? true,
        createdBy: userId,
      },
    });
  }

  async getSubCategories(categoryId?: string) {
    const where: any = { deletedAt: null };
    if (categoryId) where.categoryId = categoryId;
    return this.prisma.productSubCategory.findMany({
      where,
      orderBy: { subCategoryName: 'asc' },
    });
  }

  async getSubCategory(id: string) {
    const entity = await this.findSubCategoryOrFail(id);
    return entity;
  }

  async updateSubCategory(
    id: string,
    userId: string,
    dto: UpdateProductSubCategoryDto,
  ) {
    const existing = await this.findSubCategoryOrFail(id);
    if (
      dto.subCategoryCode &&
      dto.subCategoryCode !== existing.subCategoryCode
    ) {
      await this.ensureUniqueCode(
        'productSubCategory',
        dto.subCategoryCode,
        id,
      );
    }
    if (dto.categoryId) {
      await this.findCategoryOrFail(dto.categoryId);
    }
    return this.prisma.productSubCategory.update({
      where: { id },
      data: { ...dto, updatedBy: userId },
    });
  }

  async deleteSubCategory(id: string, userId: string) {
    await this.findSubCategoryOrFail(id);
    return this.prisma.productSubCategory.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  private async findSubCategoryOrFail(id: string) {
    const entity = await this.prisma.productSubCategory.findFirst({
      where: { id, deletedAt: null },
    });
    if (!entity) {
      throw new NotFoundException(
        `Product sub-category not found. The specified ID (${id}) does not exist or has been removed.`,
      );
    }
    return entity;
  }

  // ── Brand ─────────────────────────────────────────────────────

  async createBrand(
    userId: string,
    organizationId: string,
    dto: CreateBrandDto,
  ) {
    await this.ensureUniqueCode('brand', dto.brandCode);
    return this.prisma.brand.create({
      data: {
        companyId: organizationId,
        brandCode: dto.brandCode,
        brandName: dto.brandName,
        description: dto.description,
        status: dto.status ?? true,
        createdBy: userId,
      },
    });
  }

  async getBrands() {
    return this.prisma.brand.findMany({
      where: { deletedAt: null },
      orderBy: { brandName: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  }

  async getBrand(id: string) {
    const entity = await this.findBrandOrFail(id);
    return entity;
  }

  async updateBrand(id: string, userId: string, dto: UpdateBrandDto) {
    const existing = await this.findBrandOrFail(id);
    if (dto.brandCode && dto.brandCode !== existing.brandCode) {
      await this.ensureUniqueCode('brand', dto.brandCode, id);
    }
    return this.prisma.brand.update({
      where: { id },
      data: { ...dto, updatedBy: userId },
    });
  }

  async deleteBrand(id: string, userId: string) {
    await this.findBrandOrFail(id);
    return this.prisma.brand.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  private async findBrandOrFail(id: string) {
    const entity = await this.prisma.brand.findFirst({
      where: { id, deletedAt: null },
    });
    if (!entity) {
      throw new NotFoundException(
        `Brand not found. The specified ID (${id}) does not exist or has been removed.`,
      );
    }
    return entity;
  }

  // ── Manufacturer ──────────────────────────────────────────────

  async createManufacturer(
    userId: string,
    organizationId: string,
    dto: CreateManufacturerDto,
  ) {
    await this.ensureUniqueCode('manufacturer', dto.manufacturerCode);
    return this.prisma.manufacturer.create({
      data: {
        companyId: organizationId,
        manufacturerCode: dto.manufacturerCode,
        manufacturerName: dto.manufacturerName,
        gstNumber: dto.gstNumber,
        contactPerson: dto.contactPerson,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        status: dto.status ?? true,
        createdBy: userId,
      },
    });
  }

  async getManufacturers() {
    return this.prisma.manufacturer.findMany({
      where: { deletedAt: null },
      orderBy: { manufacturerName: 'asc' },
    });
  }

  async getManufacturer(id: string) {
    const entity = await this.findManufacturerOrFail(id);
    return entity;
  }

  async updateManufacturer(
    id: string,
    userId: string,
    dto: UpdateManufacturerDto,
  ) {
    const existing = await this.findManufacturerOrFail(id);
    if (
      dto.manufacturerCode &&
      dto.manufacturerCode !== existing.manufacturerCode
    ) {
      await this.ensureUniqueCode('manufacturer', dto.manufacturerCode, id);
    }
    return this.prisma.manufacturer.update({
      where: { id },
      data: { ...dto, updatedBy: userId },
    });
  }

  async deleteManufacturer(id: string, userId: string) {
    await this.findManufacturerOrFail(id);
    return this.prisma.manufacturer.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  private async findManufacturerOrFail(id: string) {
    const entity = await this.prisma.manufacturer.findFirst({
      where: { id, deletedAt: null },
    });
    if (!entity) {
      throw new NotFoundException(
        `Manufacturer not found. The specified ID (${id}) does not exist or has been removed.`,
      );
    }
    return entity;
  }

  // ── UOM ───────────────────────────────────────────────────────

  async createUom(userId: string, organizationId: string, dto: CreateUomDto) {
    await this.ensureUniqueCode('uom', dto.uomCode);
    return this.prisma.uom.create({
      data: {
        companyId: organizationId,
        uomCode: dto.uomCode,
        uomName: dto.uomName,
        description: dto.description,
        createdBy: userId,
      },
    });
  }

  async getUoms() {
    return this.prisma.uom.findMany({
      where: { deletedAt: null },
      orderBy: { uomName: 'asc' },
    });
  }

  async getUom(id: string) {
    const entity = await this.findUomOrFail(id);
    return entity;
  }

  async updateUom(id: string, userId: string, dto: UpdateUomDto) {
    const existing = await this.findUomOrFail(id);
    if (dto.uomCode && dto.uomCode !== existing.uomCode) {
      await this.ensureUniqueCode('uom', dto.uomCode, id);
    }
    return this.prisma.uom.update({
      where: { id },
      data: { ...dto, updatedBy: userId },
    });
  }

  async deleteUom(id: string, userId: string) {
    await this.findUomOrFail(id);
    return this.prisma.uom.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  private async findUomOrFail(id: string) {
    const entity = await this.prisma.uom.findFirst({
      where: { id, deletedAt: null },
    });
    if (!entity) {
      throw new NotFoundException(
        `UOM not found. The specified ID (${id}) does not exist or has been removed.`,
      );
    }
    return entity;
  }

  // ── Business Units ────────────────────────────────────────────

  async createBusinessUnit(userId: string, organizationId: string, dto: CreateBusinessUnitDto) {
    await this.ensureUniqueCode('businessUnit', dto.code);
    return this.prisma.businessUnit.create({
      data: {
        companyId: organizationId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        status: dto.status ?? true,
        createdBy: userId,
      },
    });
  }

  async getBusinessUnits() {
    return this.prisma.businessUnit.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async getBusinessUnit(id: string) {
    const entity = await this.findBusinessUnitOrFail(id);
    return entity;
  }

  async updateBusinessUnit(id: string, userId: string, dto: UpdateBusinessUnitDto) {
    const existing = await this.findBusinessUnitOrFail(id);
    if (dto.code && dto.code !== existing.code) {
      await this.ensureUniqueCode('businessUnit', dto.code, id);
    }
    return this.prisma.businessUnit.update({
      where: { id },
      data: { ...dto, updatedBy: userId },
    });
  }

  async deleteBusinessUnit(id: string, userId: string) {
    await this.findBusinessUnitOrFail(id);
    return this.prisma.businessUnit.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  private async findBusinessUnitOrFail(id: string) {
    const entity = await this.prisma.businessUnit.findFirst({
      where: { id, deletedAt: null },
    });
    if (!entity) {
      throw new NotFoundException(`Business unit not found. The specified ID (${id}) does not exist or has been removed.`);
    }
    return entity;
  }

  // ── Divisions ─────────────────────────────────────────────────

  async createDivision(userId: string, organizationId: string, dto: CreateDivisionDto) {
    await this.ensureUniqueCode('division', dto.code);
    await this.findBusinessUnitOrFail(dto.businessUnitId);
    return this.prisma.division.create({
      data: {
        companyId: organizationId,
        businessUnitId: dto.businessUnitId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        status: dto.status ?? true,
        createdBy: userId,
      },
    });
  }

  async getDivisions(businessUnitId?: string) {
    const where: any = { deletedAt: null };
    if (businessUnitId) where.businessUnitId = businessUnitId;
    return this.prisma.division.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async getDivision(id: string) {
    const entity = await this.findDivisionOrFail(id);
    return entity;
  }

  async updateDivision(id: string, userId: string, dto: UpdateDivisionDto) {
    const existing = await this.findDivisionOrFail(id);
    if (dto.code && dto.code !== existing.code) {
      await this.ensureUniqueCode('division', dto.code, id);
    }
    if (dto.businessUnitId) {
      await this.findBusinessUnitOrFail(dto.businessUnitId);
    }
    return this.prisma.division.update({
      where: { id },
      data: { ...dto, updatedBy: userId },
    });
  }

  async deleteDivision(id: string, userId: string) {
    await this.findDivisionOrFail(id);
    return this.prisma.division.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  private async findDivisionOrFail(id: string) {
    const entity = await this.prisma.division.findFirst({
      where: { id, deletedAt: null },
    });
    if (!entity) {
      throw new NotFoundException(`Division not found. The specified ID (${id}) does not exist or has been removed.`);
    }
    return entity;
  }

  // ── Sub-Brands ────────────────────────────────────────────────

  async createSubBrand(userId: string, organizationId: string, dto: CreateSubBrandDto) {
    await this.ensureUniqueCode('subBrand', dto.code);
    await this.findBrandOrFail(dto.brandId);
    return this.prisma.subBrand.create({
      data: {
        companyId: organizationId,
        brandId: dto.brandId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        status: dto.status ?? true,
        createdBy: userId,
      },
    });
  }

  async getSubBrands(brandId?: string) {
    const where: any = { deletedAt: null };
    if (brandId) where.brandId = brandId;
    return this.prisma.subBrand.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async getSubBrand(id: string) {
    const entity = await this.findSubBrandOrFail(id);
    return entity;
  }

  async updateSubBrand(id: string, userId: string, dto: UpdateSubBrandDto) {
    const existing = await this.findSubBrandOrFail(id);
    if (dto.code && dto.code !== existing.code) {
      await this.ensureUniqueCode('subBrand', dto.code, id);
    }
    if (dto.brandId) {
      await this.findBrandOrFail(dto.brandId);
    }
    return this.prisma.subBrand.update({
      where: { id },
      data: { ...dto, updatedBy: userId },
    });
  }

  async deleteSubBrand(id: string, userId: string) {
    await this.findSubBrandOrFail(id);
    return this.prisma.subBrand.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  private async findSubBrandOrFail(id: string) {
    const entity = await this.prisma.subBrand.findFirst({
      where: { id, deletedAt: null },
    });
    if (!entity) {
      throw new NotFoundException(`Sub-brand not found. The specified ID (${id}) does not exist or has been removed.`);
    }
    return entity;
  }

  // ── Helpers ───────────────────────────────────────────────────

  private async ensureUniqueCode(
    model: string,
    code: string,
    excludeId?: string,
  ) {
    const where: any = { code, deletedAt: null };
    if (excludeId) where.id = { not: excludeId };

    const fieldMap: Record<string, string> = {
      productCategory: 'categoryCode',
      productSubCategory: 'subCategoryCode',
      brand: 'brandCode',
      manufacturer: 'manufacturerCode',
      uom: 'uomCode',
      businessUnit: 'code',
      division: 'code',
      subBrand: 'code',
    };

    const queryField = fieldMap[model];

    let existing: any;
    switch (model) {
      case 'productCategory':
        existing = await this.prisma.productCategory.findFirst({
          where: {
            [queryField]: code,
            deletedAt: null,
            id: excludeId ? { not: excludeId } : undefined,
          },
        });
        break;
      case 'productSubCategory':
        existing = await this.prisma.productSubCategory.findFirst({
          where: {
            [queryField]: code,
            deletedAt: null,
            id: excludeId ? { not: excludeId } : undefined,
          },
        });
        break;
      case 'brand':
        existing = await this.prisma.brand.findFirst({
          where: {
            [queryField]: code,
            deletedAt: null,
            id: excludeId ? { not: excludeId } : undefined,
          },
        });
        break;
      case 'manufacturer':
        existing = await this.prisma.manufacturer.findFirst({
          where: {
            [queryField]: code,
            deletedAt: null,
            id: excludeId ? { not: excludeId } : undefined,
          },
        });
        break;
      case 'uom':
        existing = await this.prisma.uom.findFirst({
          where: {
            [queryField]: code,
            deletedAt: null,
            id: excludeId ? { not: excludeId } : undefined,
          },
        });
        break;
      case 'businessUnit':
        existing = await this.prisma.businessUnit.findFirst({
          where: {
            [queryField]: code,
            deletedAt: null,
            id: excludeId ? { not: excludeId } : undefined,
          },
        });
        break;
      case 'division':
        existing = await this.prisma.division.findFirst({
          where: {
            [queryField]: code,
            deletedAt: null,
            id: excludeId ? { not: excludeId } : undefined,
          },
        });
        break;
      case 'subBrand':
        existing = await this.prisma.subBrand.findFirst({
          where: {
            [queryField]: code,
            deletedAt: null,
            id: excludeId ? { not: excludeId } : undefined,
          },
        });
        break;
    }

    if (existing) {
      throw new ConflictException(
        `Code '${code}' already exists. Please use a different code.`,
      );
    }
  }
}
