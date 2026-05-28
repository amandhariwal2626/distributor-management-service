import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { code: 'default' },
    create: { code: 'default', name: 'Default Tenant' },
    update: {},
  });

  const permissionCodes = [
    'users.read',
    'users.create',
    'users.update',
    'users.delete',
    'roles.manage',
    'inventory.read',
    'orders.manage',
  ];

  for (const code of permissionCodes) {
    await prisma.permission.upsert({
      where: { tenantId_code: { tenantId: tenant.id, code } },
      create: { tenantId: tenant.id, code, name: code },
      update: {},
    });
  }

  const adminRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Admin' } },
    create: { tenantId: tenant.id, name: 'Admin', description: 'System administrator', isSystem: true },
    update: {},
  });

  const permissions = await prisma.permission.findMany({ where: { tenantId: tenant.id } });
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id } },
      create: { roleId: adminRole.id, permissionId: permission.id },
      update: {},
    });
  }

  const passwordHash = await bcrypt.hash('Admin@12345', 12);
  const adminUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@example.com' } },
    create: {
      tenantId: tenant.id,
      email: 'admin@example.com',
      firstName: 'System',
      lastName: 'Admin',
      fullName: 'System Admin',
      passwordHash,
      isActive: true,
    },
    update: {},
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    create: { userId: adminUser.id, roleId: adminRole.id },
    update: {},
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
