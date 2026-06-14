import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface RoleSeed {
  name: string;
  description: string;
  level: number;
  isSystem: boolean;
  permissionCodes: string[];
}

const ROLES: RoleSeed[] = [
  {
    name: 'Admin',
    description: 'System administrator with full access',
    level: 1,
    isSystem: true,
    permissionCodes: [
      'users.read', 'users.create', 'users.update', 'users.delete',
      'users.reset_password', 'users.lock', 'users.unlock',
      'roles.read', 'roles.create', 'roles.update', 'roles.delete',
      'roles.assign', 'roles.manage',
      'hierarchy.view', 'hierarchy.export',
      'hierarchy.read', 'hierarchy.create',
      'audit.read', 'audit.export',
      'audit.view',
      'documents.read', 'documents.create', 'documents.update', 'documents.delete', 'documents.share',
      'folders.read', 'folders.create', 'folders.update', 'folders.delete',
      'approvals.read', 'approvals.approve', 'approvals.reject',
      'orders.read', 'orders.create',
      'inventory.read', 'inventory.manage',
      'payments.read', 'payments.manage',
      'reports.read', 'reports.export',
      'report.read', 'report.export',
      'settings.read', 'settings.manage', 'settings.owner',
      'product.read', 'product.create', 'product.edit', 'product.delete', 'product.approve',
      'price.read', 'price.create', 'price.edit', 'price.approve',
      'upload.read', 'upload.create', 'upload.publish',
      'workflow.read', 'workflow.create', 'workflow.approve',
      'attribute.read', 'attribute.create',
      'document.read', 'document.create', 'document.delete',
    ],
  },
  {
    name: 'National Sales Head',
    description: 'National Sales Head',
    level: 2,
    isSystem: true,
    permissionCodes: [
      'users.read',
      'hierarchy.view', 'hierarchy.export',
      'hierarchy.read',
      'reports.read', 'reports.export',
      'report.read', 'report.export',
      'product.read',
      'price.read',
    ],
  },
  {
    name: 'Zonal Sales Manager',
    description: 'Zonal Sales Manager',
    level: 3,
    isSystem: true,
    permissionCodes: [
      'users.read',
      'hierarchy.view', 'hierarchy.export',
      'hierarchy.read',
      'reports.read', 'reports.export',
      'report.read', 'report.export',
      'product.read',
      'price.read',
    ],
  },
  {
    name: 'Regional Sales Manager',
    description: 'Regional Sales Manager',
    level: 4,
    isSystem: true,
    permissionCodes: [
      'users.read',
      'hierarchy.view', 'hierarchy.export',
      'hierarchy.read',
      'reports.read', 'reports.export',
      'report.read', 'report.export',
      'product.read',
      'price.read',
    ],
  },
  {
    name: 'Area Sales Manager',
    description: 'Area Sales Manager',
    level: 5,
    isSystem: true,
    permissionCodes: [
      'users.read',
      'hierarchy.view', 'hierarchy.export',
      'hierarchy.read',
      'reports.read', 'reports.export',
      'report.read', 'report.export',
      'product.read',
      'price.read',
    ],
  },
  {
    name: 'Territory Sales Officer',
    description: 'Territory Sales Officer',
    level: 6,
    isSystem: true,
    permissionCodes: [
      'users.read',
      'hierarchy.view',
      'hierarchy.read',
      'product.read',
      'price.read',
    ],
  },
  {
    name: 'Distributor',
    description: 'Distributor - can manage own team',
    level: 7,
    isSystem: true,
    permissionCodes: [
      'users.read',
      'users.create',
      'users.update',
      'users.reset_password',
      'hierarchy.view',
      'hierarchy.read',
      'product.read',
      'price.read',
      'upload.read',
      'upload.create',
    ],
  },
  {
    name: 'Salesman',
    description: 'Salesman',
    level: 8,
    isSystem: true,
    permissionCodes: [
      'orders.read', 'orders.create',
      'inventory.read',
    ],
  },
  {
    name: 'Accountant',
    description: 'Accountant',
    level: 9,
    isSystem: true,
    permissionCodes: [
      'payments.read', 'payments.manage',
      'reports.read', 'reports.export',
    ],
  },
  {
    name: 'Warehouse User',
    description: 'Warehouse User',
    level: 10,
    isSystem: true,
    permissionCodes: [
      'inventory.read', 'inventory.manage',
      'orders.read',
    ],
  },
  {
    name: 'Delivery Boy',
    description: 'Delivery Boy',
    level: 11,
    isSystem: true,
    permissionCodes: [
      'orders.read',
      'orders.update',
    ],
  },
];

async function main() {
  const organization = await prisma.organization.upsert({
    where: { code: 'default' },
    create: { code: 'default', name: 'Default Organization' },
    update: {},
  });

  const allPermissionCodes = [
    ...new Set(ROLES.flatMap((r) => r.permissionCodes)),
  ].sort();

  for (const code of allPermissionCodes) {
    await prisma.permission.upsert({
      where: { organizationId_code: { organizationId: organization.id, code } },
      create: { organizationId: organization.id, code, name: code },
      update: {},
    });
  }

  const allPermissions = await prisma.permission.findMany({
    where: { organizationId: organization.id },
  });

  const permMap = new Map(allPermissions.map((p) => [p.code, p]));

  for (const roleSeed of ROLES) {
    const role = await prisma.role.upsert({
      where: { organizationId_name: { organizationId: organization.id, name: roleSeed.name } },
      create: {
        organizationId: organization.id,
        name: roleSeed.name,
        description: roleSeed.description,
        level: roleSeed.level,
        isSystem: roleSeed.isSystem,
      },
      update: {
        description: roleSeed.description,
        level: roleSeed.level,
      },
    });

    for (const code of roleSeed.permissionCodes) {
      const permission = permMap.get(code);
      if (!permission) continue;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: permission.id },
        },
        create: { roleId: role.id, permissionId: permission.id },
        update: {},
      });
    }
  }

  const passwordHash = await bcrypt.hash('Admin@12345', 12);

  interface UserSeed {
    email: string;
    firstName: string;
    lastName: string;
    roleName: string;
    managerEmail?: string;
    distributorEmail?: string;
  }

  const USERS: UserSeed[] = [
    { email: 'admin@example.com', firstName: 'System', lastName: 'Admin', roleName: 'Admin' },
    { email: 'nsh@example.com', firstName: 'Rajesh', lastName: 'Verma', roleName: 'National Sales Head', managerEmail: 'admin@example.com' },
    { email: 'zsm@example.com', firstName: 'Amit', lastName: 'Sharma', roleName: 'Zonal Sales Manager', managerEmail: 'nsh@example.com' },
    { email: 'rsm@example.com', firstName: 'Vikram', lastName: 'Singh', roleName: 'Regional Sales Manager', managerEmail: 'zsm@example.com' },
    { email: 'asm@example.com', firstName: 'Suresh', lastName: 'Patel', roleName: 'Area Sales Manager', managerEmail: 'rsm@example.com' },
    { email: 'tso@example.com', firstName: 'Ravi', lastName: 'Kumar', roleName: 'Territory Sales Officer', managerEmail: 'asm@example.com' },
    { email: 'distributor@example.com', firstName: 'Mohan', lastName: 'Gupta', roleName: 'Distributor', managerEmail: 'tso@example.com' },
    { email: 'salesman@example.com', firstName: 'Sunil', lastName: 'Yadav', roleName: 'Salesman', managerEmail: 'distributor@example.com', distributorEmail: 'distributor@example.com' },
    { email: 'accountant@example.com', firstName: 'Prakash', lastName: 'Joshi', roleName: 'Accountant', managerEmail: 'distributor@example.com', distributorEmail: 'distributor@example.com' },
    { email: 'warehouse@example.com', firstName: 'Dinesh', lastName: 'Chauhan', roleName: 'Warehouse User', managerEmail: 'distributor@example.com', distributorEmail: 'distributor@example.com' },
    { email: 'delivery@example.com', firstName: 'Karan', lastName: 'Singh', roleName: 'Delivery Boy', managerEmail: 'distributor@example.com', distributorEmail: 'distributor@example.com' },
  ];

  const createdUsers = new Map<string, string>();

  for (const u of USERS) {
    const user = await prisma.user.upsert({
      where: { organizationId_email: { organizationId: organization.id, email: u.email } },
      create: {
        organizationId: organization.id,
        email: u.email,
        username: u.email.split('@')[0],
        passwordHash,
        status: 'ACTIVE',
        profile: {
          create: {
            firstName: u.firstName,
            lastName: u.lastName,
            fullName: `${u.firstName} ${u.lastName}`,
          },
        },
      },
      update: {},
    });
    createdUsers.set(u.email, user.id);
  }

  for (const u of USERS) {
    const userId = createdUsers.get(u.email)!;
    const managerId = u.managerEmail ? createdUsers.get(u.managerEmail) : undefined;
    const distributorId = u.distributorEmail ? createdUsers.get(u.distributorEmail) : undefined;

    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(managerId ? { reportingManagerId: managerId } : {}),
        ...(distributorId ? { distributorId } : {}),
      },
    });

    const role = await prisma.role.findUnique({
      where: { organizationId_name: { organizationId: organization.id, name: u.roleName } },
    });

    if (role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId, roleId: role.id } },
        create: { userId, roleId: role.id },
        update: {},
      });
    }
  }

  // ── Product Master Seed Data ──────────────────────────────────

  const categoryData = [
    { categoryCode: 'CAT-FG', categoryName: 'Food Grains', description: 'Rice, wheat, and other grains' },
    { categoryCode: 'CAT-BEV', categoryName: 'Beverages', description: 'Soft drinks, juices, and other beverages' },
    { categoryCode: 'CAT-SNC', categoryName: 'Snacks & Confectionery', description: 'Biscuits, chips, candies' },
    { categoryCode: 'CAT-DRY', categoryName: 'Dairy & Chilled', description: 'Milk, yogurt, cheese' },
    { categoryCode: 'CAT-PHC', categoryName: 'Personal & Home Care', description: 'Soaps, detergents, toiletries' },
  ];

  interface SeedCategory {
    id: string;
    categoryCode: string;
    categoryName: string;
  }

  const createdCategories: SeedCategory[] = [];

  for (const cat of categoryData) {
    const record = await prisma.productCategory.upsert({
      where: { companyId_categoryCode: { companyId: organization.id, categoryCode: cat.categoryCode } },
      create: { companyId: organization.id, ...cat },
      update: {},
    });
    createdCategories.push({ id: record.id, categoryCode: record.categoryCode, categoryName: record.categoryName });
  }

  function findCategory(code: string): SeedCategory {
    const c = createdCategories.find((c) => c.categoryCode === code);
    if (!c) throw new Error(`Category not found: ${code}`);
    return c;
  }

  const subCategoryData = [
    { subCategoryCode: 'SCT-RICE', subCategoryName: 'Rice', description: 'All varieties of rice', categoryCode: 'CAT-FG' },
    { subCategoryCode: 'SCT-WHEAT', subCategoryName: 'Wheat & Atta', description: 'Wheat flour products', categoryCode: 'CAT-FG' },
    { subCategoryCode: 'SCT-OIL', subCategoryName: 'Cooking Oils', description: 'Edible oils', categoryCode: 'CAT-FG' },
    { subCategoryCode: 'SCT-CARB', subCategoryName: 'Carbonated Drinks', description: 'Soft drinks', categoryCode: 'CAT-BEV' },
    { subCategoryCode: 'SCT-JUICE', subCategoryName: 'Juices', description: 'Fruit juices', categoryCode: 'CAT-BEV' },
    { subCategoryCode: 'SCT-BISCUIT', subCategoryName: 'Biscuits', description: 'Biscuits and cookies', categoryCode: 'CAT-SNC' },
    { subCategoryCode: 'SCT-CHIPS', subCategoryName: 'Chips', description: 'Potato chips and extruded snacks', categoryCode: 'CAT-SNC' },
    { subCategoryCode: 'SCT-MILK', subCategoryName: 'Milk', description: 'Fresh and packaged milk', categoryCode: 'CAT-DRY' },
    { subCategoryCode: 'SCT-SOAP', subCategoryName: 'Soaps', description: 'Bath and hand soaps', categoryCode: 'CAT-PHC' },
  ];

  interface SeedSubCategory {
    id: string;
    subCategoryCode: string;
    subCategoryName: string;
  }

  const createdSubCategories: SeedSubCategory[] = [];

  for (const sc of subCategoryData) {
    const categoryId = findCategory(sc.categoryCode).id;
    const record = await prisma.productSubCategory.upsert({
      where: { companyId_subCategoryCode: { companyId: organization.id, subCategoryCode: sc.subCategoryCode } },
      create: { companyId: organization.id, categoryId, subCategoryCode: sc.subCategoryCode, subCategoryName: sc.subCategoryName, description: sc.description },
      update: {},
    });
    createdSubCategories.push({ id: record.id, subCategoryCode: record.subCategoryCode, subCategoryName: record.subCategoryName });
  }

  const brandData = [
    { brandCode: 'BRD-PH', brandName: 'Premium Harvest', description: 'Premium quality food products' },
    { brandCode: 'BRD-NF', brandName: 'Nature\'s Fresh', description: 'Natural and organic products' },
    { brandCode: 'BRD-CF', brandName: 'Cool Fizz', description: 'Refreshing beverages' },
    { brandCode: 'BRD-CB', brandName: 'Crunchy Bites', description: 'Delicious snacks' },
    { brandCode: 'BRD-DF', brandName: 'Daily Fresh', description: 'Daily household essentials' },
  ];

  interface SeedBrand {
    id: string;
    brandCode: string;
    brandName: string;
  }

  const createdBrands: SeedBrand[] = [];

  for (const b of brandData) {
    const record = await prisma.brand.upsert({
      where: { companyId_brandCode: { companyId: organization.id, brandCode: b.brandCode } },
      create: { companyId: organization.id, ...b },
      update: {},
    });
    createdBrands.push({ id: record.id, brandCode: record.brandCode, brandName: record.brandName });
  }

  const manufacturerData = [
    { manufacturerCode: 'MFR-ABC', manufacturerName: 'ABC Foods Ltd', gstNumber: '27AABCA1234B1Z1', contactPerson: 'Rajesh Mehta', email: 'rajesh@abcfoods.in', phone: '9876543210', address: 'Mumbai, Maharashtra' },
    { manufacturerCode: 'MFR-XYZ', manufacturerName: 'XYZ Beverages Pvt Ltd', gstNumber: '27XYZB5678C1Z1', contactPerson: 'Priya Sharma', email: 'priya@xyzbeverages.in', phone: '9876543211', address: 'Pune, Maharashtra' },
    { manufacturerCode: 'MFR-FDI', manufacturerName: 'Fresh Dairy Industries', gstNumber: '27FRSC9012D1Z1', contactPerson: 'Amit Singh', email: 'amit@freshdairy.in', phone: '9876543212', address: 'Nagpur, Maharashtra' },
  ];

  interface SeedManufacturer {
    id: string;
    manufacturerCode: string;
    manufacturerName: string;
  }

  const createdManufacturers: SeedManufacturer[] = [];

  for (const m of manufacturerData) {
    const record = await prisma.manufacturer.upsert({
      where: { companyId_manufacturerCode: { companyId: organization.id, manufacturerCode: m.manufacturerCode } },
      create: { companyId: organization.id, ...m },
      update: {},
    });
    createdManufacturers.push({ id: record.id, manufacturerCode: record.manufacturerCode, manufacturerName: record.manufacturerName });
  }

  const uomData = [
    { uomCode: 'UOM-KG', uomName: 'Kilogram', description: 'Weight in kilograms' },
    { uomCode: 'UOM-GM', uomName: 'Gram', description: 'Weight in grams' },
    { uomCode: 'UOM-LTR', uomName: 'Litre', description: 'Volume in litres' },
    { uomCode: 'UOM-ML', uomName: 'Millilitre', description: 'Volume in millilitres' },
    { uomCode: 'UOM-PCS', uomName: 'Piece', description: 'Individual piece/unit' },
    { uomCode: 'UOM-BOX', uomName: 'Box', description: 'Box of items' },
    { uomCode: 'UOM-DZ', uomName: 'Dozen', description: '12 pieces' },
    { uomCode: 'UOM-PK', uomName: 'Pack', description: 'Pack of items' },
  ];

  interface SeedUom {
    id: string;
    uomCode: string;
    uomName: string;
  }

  const createdUoms: SeedUom[] = [];

  for (const u of uomData) {
    const record = await prisma.uom.upsert({
      where: { companyId_uomCode: { companyId: organization.id, uomCode: u.uomCode } },
      create: { companyId: organization.id, ...u },
      update: {},
    });
    createdUoms.push({ id: record.id, uomCode: record.uomCode, uomName: record.uomName });
  }

  const adminUser = await prisma.user.findUnique({
    where: { organizationId_email: { organizationId: organization.id, email: 'admin@example.com' } },
  });

  if (adminUser) {
    const productSeedData = [
      {
        productCode: 'PROD-001',
        productName: 'Premium Basmati Rice 5kg',
        shortName: 'Basmati Rice 5kg',
        description: 'Premium quality basmati rice 5kg pack',
        categoryCode: 'CAT-FG',
        subCategoryCode: 'SCT-RICE',
        brandCode: 'BRD-PH',
        manufacturerCode: 'MFR-ABC',
        uomCode: 'UOM-KG',
        barcode: '8901234567890',
        hsnCode: '10063020',
        skuType: 'FINISHED_GOOD' as const,
        shelfLifeDays: 365,
        reorderLevel: 50,
      },
      {
        productCode: 'PROD-002',
        productName: 'Cold Pressed Coconut Oil 1L',
        shortName: 'Coconut Oil 1L',
        description: 'Pure cold pressed coconut oil 1 litre bottle',
        categoryCode: 'CAT-FG',
        subCategoryCode: 'SCT-OIL',
        brandCode: 'BRD-NF',
        manufacturerCode: 'MFR-ABC',
        uomCode: 'UOM-LTR',
        barcode: '8901234567891',
        hsnCode: '15131100',
        skuType: 'FINISHED_GOOD' as const,
        shelfLifeDays: 730,
        reorderLevel: 30,
      },
    ];

    for (const p of productSeedData) {
      const category = createdCategories.find((c) => c.categoryCode === p.categoryCode);
      const subCategory = createdSubCategories.find((sc) => sc.subCategoryCode === p.subCategoryCode);
      const brand = createdBrands.find((b) => b.brandCode === p.brandCode);
      const manufacturer = createdManufacturers.find((m) => m.manufacturerCode === p.manufacturerCode);
      const uom = createdUoms.find((u) => u.uomCode === p.uomCode);

      await prisma.product.upsert({
        where: { companyId_productCode: { companyId: organization.id, productCode: p.productCode } },
        create: {
          companyId: organization.id,
          productCode: p.productCode,
          productName: p.productName,
          shortName: p.shortName,
          description: p.description,
          categoryId: category?.id,
          subCategoryId: subCategory?.id,
          brandId: brand?.id,
          manufacturerId: manufacturer?.id,
          uomId: uom!.id,
          barcode: p.barcode,
          hsnCode: p.hsnCode,
          skuType: p.skuType,
          shelfLifeDays: p.shelfLifeDays,
          reorderLevel: p.reorderLevel,
          status: 'ACTIVE',
          createdBy: adminUser.id,
        },
        update: {},
      });
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
