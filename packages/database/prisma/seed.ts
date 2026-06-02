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
      'audit.read', 'audit.export',
      'documents.read', 'documents.create', 'documents.update', 'documents.delete', 'documents.share',
      'folders.read', 'folders.create', 'folders.update', 'folders.delete',
      'approvals.read', 'approvals.approve', 'approvals.reject',
      'orders.read', 'orders.create',
      'inventory.read', 'inventory.manage',
      'payments.read', 'payments.manage',
      'reports.read', 'reports.export',
      'settings.read', 'settings.manage', 'settings.owner',
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
      'reports.read', 'reports.export',
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
      'reports.read', 'reports.export',
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
      'reports.read', 'reports.export',
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
      'reports.read', 'reports.export',
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
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
