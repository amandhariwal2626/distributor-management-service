import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeographyService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Countries ──────────────────────────────────────────────────

  async getCountries(organizationId: string) {
    return this.prisma.country.findMany({
      where: { companyId: organizationId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async createCountry(
    organizationId: string,
    data: { code: string; name: string; isoCode?: string; currency?: string },
    userId: string,
  ) {
    const existing = await this.prisma.country.findUnique({
      where: { companyId_code: { companyId: organizationId, code: data.code } },
    });
    if (existing)
      throw new ConflictException(
        `Country with code '${data.code}' already exists`,
      );
    return this.prisma.country.create({
      data: { companyId: organizationId, ...data, createdBy: userId },
    });
  }

  async updateCountry(
    organizationId: string,
    id: string,
    data: { name?: string; isoCode?: string; currency?: string },
    userId: string,
  ) {
    const record = await this.prisma.country.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record)
      throw new NotFoundException(`Country with id '${id}' not found`);
    return this.prisma.country.update({
      where: { id },
      data: { ...data, updatedBy: userId },
    });
  }

  async deleteCountry(organizationId: string, id: string, userId: string) {
    const record = await this.prisma.country.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record)
      throw new NotFoundException(`Country with id '${id}' not found`);
    return this.prisma.country.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  // ── States ─────────────────────────────────────────────────────

  async getStates(organizationId: string, countryId?: string) {
    const where: any = { companyId: organizationId, deletedAt: null };
    if (countryId) where.countryId = countryId;
    return this.prisma.state.findMany({ where, orderBy: { name: 'asc' } });
  }

  async createState(
    organizationId: string,
    data: { countryId: string; code: string; name: string; gstCode?: string },
    userId: string,
  ) {
    await this.ensureEntityExists('country', organizationId, data.countryId);
    const existing = await this.prisma.state.findUnique({
      where: { companyId_code: { companyId: organizationId, code: data.code } },
    });
    if (existing)
      throw new ConflictException(
        `State with code '${data.code}' already exists`,
      );
    return this.prisma.state.create({
      data: { companyId: organizationId, ...data, createdBy: userId },
    });
  }

  async updateState(
    organizationId: string,
    id: string,
    data: { name?: string; gstCode?: string },
    userId: string,
  ) {
    const record = await this.prisma.state.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record) throw new NotFoundException(`State with id '${id}' not found`);
    return this.prisma.state.update({
      where: { id },
      data: { ...data, updatedBy: userId },
    });
  }

  async deleteState(organizationId: string, id: string, userId: string) {
    const record = await this.prisma.state.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record) throw new NotFoundException(`State with id '${id}' not found`);
    return this.prisma.state.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  // ── Zones ──────────────────────────────────────────────────────

  async getZones(organizationId: string, stateId?: string) {
    const where: any = { companyId: organizationId, deletedAt: null };
    if (stateId) where.stateId = stateId;
    return this.prisma.zone.findMany({ where, orderBy: { name: 'asc' } });
  }

  async createZone(
    organizationId: string,
    data: { stateId: string; code: string; name: string },
    userId: string,
  ) {
    await this.ensureEntityExists('state', organizationId, data.stateId);
    const existing = await this.prisma.zone.findUnique({
      where: { companyId_code: { companyId: organizationId, code: data.code } },
    });
    if (existing)
      throw new ConflictException(
        `Zone with code '${data.code}' already exists`,
      );
    return this.prisma.zone.create({
      data: { companyId: organizationId, ...data, createdBy: userId },
    });
  }

  async updateZone(
    organizationId: string,
    id: string,
    data: { name?: string },
    userId: string,
  ) {
    const record = await this.prisma.zone.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record) throw new NotFoundException(`Zone with id '${id}' not found`);
    return this.prisma.zone.update({
      where: { id },
      data: { ...data, updatedBy: userId },
    });
  }

  async deleteZone(organizationId: string, id: string, userId: string) {
    const record = await this.prisma.zone.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record) throw new NotFoundException(`Zone with id '${id}' not found`);
    return this.prisma.zone.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  // ── Regions ────────────────────────────────────────────────────

  async getRegions(organizationId: string, zoneId?: string) {
    const where: any = { companyId: organizationId, deletedAt: null };
    if (zoneId) where.zoneId = zoneId;
    return this.prisma.region.findMany({ where, orderBy: { name: 'asc' } });
  }

  async createRegion(
    organizationId: string,
    data: { zoneId: string; code: string; name: string },
    userId: string,
  ) {
    await this.ensureEntityExists('zone', organizationId, data.zoneId);
    const existing = await this.prisma.region.findUnique({
      where: { companyId_code: { companyId: organizationId, code: data.code } },
    });
    if (existing)
      throw new ConflictException(
        `Region with code '${data.code}' already exists`,
      );
    return this.prisma.region.create({
      data: { companyId: organizationId, ...data, createdBy: userId },
    });
  }

  async updateRegion(
    organizationId: string,
    id: string,
    data: { name?: string },
    userId: string,
  ) {
    const record = await this.prisma.region.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record)
      throw new NotFoundException(`Region with id '${id}' not found`);
    return this.prisma.region.update({
      where: { id },
      data: { ...data, updatedBy: userId },
    });
  }

  async deleteRegion(organizationId: string, id: string, userId: string) {
    const record = await this.prisma.region.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record)
      throw new NotFoundException(`Region with id '${id}' not found`);
    return this.prisma.region.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  // ── Depots ─────────────────────────────────────────────────────

  async getDepots(organizationId: string, regionId?: string) {
    const where: any = { companyId: organizationId, deletedAt: null };
    if (regionId) where.regionId = regionId;
    return this.prisma.depot.findMany({ where, orderBy: { name: 'asc' } });
  }

  async createDepot(
    organizationId: string,
    data: {
      regionId: string;
      code: string;
      name: string;
      address?: string;
      city?: string;
      pincode?: string;
    },
    userId: string,
  ) {
    await this.ensureEntityExists('region', organizationId, data.regionId);
    const existing = await this.prisma.depot.findUnique({
      where: { companyId_code: { companyId: organizationId, code: data.code } },
    });
    if (existing)
      throw new ConflictException(
        `Depot with code '${data.code}' already exists`,
      );
    return this.prisma.depot.create({
      data: { companyId: organizationId, ...data, createdBy: userId },
    });
  }

  async updateDepot(
    organizationId: string,
    id: string,
    data: { name?: string; address?: string; city?: string; pincode?: string },
    userId: string,
  ) {
    const record = await this.prisma.depot.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record) throw new NotFoundException(`Depot with id '${id}' not found`);
    return this.prisma.depot.update({
      where: { id },
      data: { ...data, updatedBy: userId },
    });
  }

  async deleteDepot(organizationId: string, id: string, userId: string) {
    const record = await this.prisma.depot.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record) throw new NotFoundException(`Depot with id '${id}' not found`);
    return this.prisma.depot.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  // ── Geography Tree ─────────────────────────────────────────────

  async getTree(organizationId: string) {
    const countries = await this.prisma.country.findMany({
      where: { companyId: organizationId, deletedAt: null },
      orderBy: { name: 'asc' },
      include: {
        states: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' },
          include: {
            zones: {
              where: { deletedAt: null },
              orderBy: { name: 'asc' },
              include: {
                regions: {
                  where: { deletedAt: null },
                  orderBy: { name: 'asc' },
                  include: {
                    depots: {
                      where: { deletedAt: null },
                      orderBy: { name: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return countries.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      children: c.states.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        children: s.zones.map((z) => ({
          id: z.id,
          name: z.name,
          code: z.code,
          children: z.regions.map((r) => ({
            id: r.id,
            name: r.name,
            code: r.code,
            children: r.depots.map((d) => ({
              id: d.id,
              name: d.name,
              code: d.code,
            })),
          })),
        })),
      })),
    }));
  }

  // ── Product Geography Mappings ─────────────────────────────────

  async createMapping(
    organizationId: string,
    data: {
      productId: string;
      countryId?: string;
      stateId?: string;
      zoneId?: string;
      regionId?: string;
      depotId?: string;
      availabilityStatus?: string;
      launchDate?: string;
    },
    userId: string,
  ) {
    const product = await this.prisma.product.findFirst({
      where: { id: data.productId, companyId: organizationId, deletedAt: null },
    });
    if (!product)
      throw new NotFoundException(
        `Product with id '${data.productId}' not found`,
      );
    return this.prisma.productGeographyMapping.create({
      data: {
        companyId: organizationId,
        productId: data.productId,
        countryId: data.countryId,
        stateId: data.stateId,
        zoneId: data.zoneId,
        regionId: data.regionId,
        depotId: data.depotId,
        availabilityStatus: data.availabilityStatus ?? 'AVAILABLE',
        launchDate: data.launchDate ? new Date(data.launchDate) : undefined,
        createdBy: userId,
      },
    });
  }

  async updateMapping(
    organizationId: string,
    id: string,
    data: { availabilityStatus?: string; launchDate?: string },
    userId: string,
  ) {
    const record = await this.prisma.productGeographyMapping.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record)
      throw new NotFoundException(`Mapping with id '${id}' not found`);
    return this.prisma.productGeographyMapping.update({
      where: { id },
      data: {
        ...data,
        launchDate: data.launchDate ? new Date(data.launchDate) : undefined,
        updatedBy: userId,
      },
    });
  }

  async deleteMapping(organizationId: string, id: string, userId: string) {
    const record = await this.prisma.productGeographyMapping.findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record)
      throw new NotFoundException(`Mapping with id '${id}' not found`);
    return this.prisma.productGeographyMapping.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }

  async getProductMappings(organizationId: string, productId: string) {
    return this.prisma.productGeographyMapping.findMany({
      where: { companyId: organizationId, productId, deletedAt: null },
      include: {
        country: true,
        state: true,
        zone: true,
        region: true,
        depot: true,
      },
    });
  }

  async getAvailableProducts(
    organizationId: string,
    filters: {
      stateId?: string;
      zoneId?: string;
      regionId?: string;
      depotId?: string;
    },
  ) {
    const where: any = {
      companyId: organizationId,
      deletedAt: null,
      availabilityStatus: 'AVAILABLE',
    };
    if (filters.stateId) where.stateId = filters.stateId;
    if (filters.zoneId) where.zoneId = filters.zoneId;
    if (filters.regionId) where.regionId = filters.regionId;
    if (filters.depotId) where.depotId = filters.depotId;
    return this.prisma.productGeographyMapping.findMany({
      where,
      include: { product: true },
    });
  }

  async activateLaunched(organizationId: string, userId: string) {
    const result = await this.prisma.productGeographyMapping.updateMany({
      where: {
        companyId: organizationId,
        deletedAt: null,
        launchDate: { lte: new Date() },
        availabilityStatus: 'PENDING',
      },
      data: { availabilityStatus: 'AVAILABLE', updatedBy: userId },
    });
    return { updated: result.count };
  }

  // ── Helpers ────────────────────────────────────────────────────

  private async ensureEntityExists(
    model: string,
    organizationId: string,
    id: string,
  ) {
    const record = await (this.prisma as any)[model].findFirst({
      where: { id, companyId: organizationId, deletedAt: null },
    });
    if (!record)
      throw new NotFoundException(
        `${model.charAt(0).toUpperCase() + model.slice(1)} with id '${id}' not found`,
      );
  }
}
