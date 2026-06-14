import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PASSWORD = 'Admin@12345';

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

async function main() {
  // ── 1. ORGANIZATIONS ────────────────────────────────────────────

  const orgsData = [
    { code: 'default', name: 'Default Organization' },
    { code: 'alpha-dist', name: 'Alpha Distributors' },
    { code: 'beta-trading', name: 'Beta Trading Co.' },
    { code: 'gamma-supply', name: 'Gamma Supply Chain' },
    { code: 'delta-enterprise', name: 'Delta Enterprises' },
    { code: 'epsilon-wholesale', name: 'Epsilon Wholesale' },
    { code: 'zeta-retail', name: 'Zeta Retail Group' },
    { code: 'eta-logistics', name: 'Eta Logistics' },
    { code: 'theta-ventures', name: 'Theta Ventures' },
    { code: 'iota-traders', name: 'Iota Traders Inc.' },
  ];

  const orgIds: string[] = [];
  for (const org of orgsData) {
    const record = await prisma.organization.upsert({
      where: { code: org.code },
      create: org,
      update: {},
    });
    orgIds.push(record.id);
  }

  const organizationId = orgIds[0];

  // ── 2. PERMISSIONS ──────────────────────────────────────────────

  const allPermissionCodes = [...new Set(ROLES.flatMap((r) => r.permissionCodes))].sort();

  for (const code of allPermissionCodes) {
    await prisma.permission.upsert({
      where: { organizationId_code: { organizationId, code } },
      create: { organizationId, code, name: code },
      update: {},
    });
  }

  const allPermissions = await prisma.permission.findMany({
    where: { organizationId },
  });

  const permMap = new Map(allPermissions.map((p) => [p.code, p]));

  // ── 3. ROLES & ROLE PERMISSIONS ────────────────────────────────

  for (const roleSeed of ROLES) {
    const role = await prisma.role.upsert({
      where: { organizationId_name: { organizationId, name: roleSeed.name } },
      create: {
        organizationId,
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
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        create: { roleId: role.id, permissionId: permission.id },
        update: {},
      });
    }
  }

  // ── 4. USERS, PROFILES & ROLES ──────────────────────────────────

  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  const createdUsers = new Map<string, string>();

  for (const u of USERS) {
    const user = await prisma.user.upsert({
      where: { organizationId_email: { organizationId, email: u.email } },
      create: {
        organizationId,
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
      where: { organizationId_name: { organizationId, name: u.roleName } },
    });

    if (role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId, roleId: role.id } },
        create: { userId, roleId: role.id },
        update: {},
      });
    }
  }

  const adminId = createdUsers.get('admin@example.com')!;
  const nshId = createdUsers.get('nsh@example.com')!;
  const zsmId = createdUsers.get('zsm@example.com')!;
  const rsmId = createdUsers.get('rsm@example.com')!;
  const asmId = createdUsers.get('asm@example.com')!;
  const tsoId = createdUsers.get('tso@example.com')!;
  const distributorId = createdUsers.get('distributor@example.com')!;
  const salesmanId = createdUsers.get('salesman@example.com')!;
  const accountantId = createdUsers.get('accountant@example.com')!;
  const warehouseId = createdUsers.get('warehouse@example.com')!;
  const deliveryId = createdUsers.get('delivery@example.com')!;

  const allUserIds = [adminId, nshId, zsmId, rsmId, asmId, tsoId, distributorId, salesmanId, accountantId, warehouseId, deliveryId];

  // ── 5. SESSIONS (10) ────────────────────────────────────────────

  await prisma.session.deleteMany({ where: { organizationId } });

  const sessionData = [
    { userId: adminId, refreshTokenHash: 'rt_hash_admin_001', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120', ipAddress: '192.168.1.10', status: 'ACTIVE' as const, expiresAt: new Date(Date.now() + 86400000) },
    { userId: nshId, refreshTokenHash: 'rt_hash_nsh_001', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605', ipAddress: '192.168.1.20', status: 'ACTIVE' as const, expiresAt: new Date(Date.now() + 86400000) },
    { userId: zsmId, refreshTokenHash: 'rt_hash_zsm_001', userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Firefox/121', ipAddress: '10.0.0.30', status: 'ACTIVE' as const, expiresAt: new Date(Date.now() + 86400000) },
    { userId: rsmId, refreshTokenHash: 'rt_hash_rsm_001', userAgent: 'PostmanRuntime/7.36.0', ipAddress: '10.0.0.40', status: 'ACTIVE' as const, expiresAt: new Date(Date.now() + 86400000) },
    { userId: asmId, refreshTokenHash: 'rt_hash_asm_001', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2) Mobile/15E148', ipAddress: '172.16.0.50', status: 'ACTIVE' as const, expiresAt: new Date(Date.now() + 86400000) },
    { userId: tsoId, refreshTokenHash: 'rt_hash_tso_001', userAgent: 'Mozilla/5.0 (Android 14) Chrome/120 Mobile', ipAddress: '172.16.0.60', status: 'ACTIVE' as const, expiresAt: new Date(Date.now() + 86400000) },
    { userId: distributorId, refreshTokenHash: 'rt_hash_dist_001', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120', ipAddress: '192.168.2.70', status: 'ACTIVE' as const, expiresAt: new Date(Date.now() + 86400000) },
    { userId: salesmanId, refreshTokenHash: 'rt_hash_slm_001', userAgent: 'Mozilla/5.0 (Android 13) Chrome/119 Mobile', ipAddress: '192.168.2.80', status: 'REVOKED' as const, expiresAt: new Date(Date.now() - 86400000) },
    { userId: accountantId, refreshTokenHash: 'rt_hash_acc_001', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120', ipAddress: '192.168.2.90', status: 'EXPIRED' as const, expiresAt: new Date(Date.now() - 86400000) },
    { userId: warehouseId, refreshTokenHash: 'rt_hash_wh_001', userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120', ipAddress: '10.0.1.100', status: 'ACTIVE' as const, expiresAt: new Date(Date.now() + 86400000) },
  ];

  for (const s of sessionData) {
    await prisma.session.create({
      data: { organizationId, ...s },
    });
  }

  // ── 6. PASSWORD RESET TOKENS (10) ───────────────────────────────

  await prisma.passwordResetToken.deleteMany({ where: { userId: { in: allUserIds } } });

  for (let i = 0; i < 10; i++) {
    const userId = allUserIds[i % allUserIds.length];
    await prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash: `pwd_reset_token_hash_${i + 1}`,
        expiresAt: new Date(Date.now() + 3600000),
        usedAt: i < 3 ? new Date() : null,
      },
    });
  }

  // ── 7. REVOKED TOKENS (10) ─────────────────────────────────────

  await prisma.revokedToken.deleteMany({ where: { userId: { in: allUserIds } } });

  for (let i = 0; i < 10; i++) {
    const userId = allUserIds[i % allUserIds.length];
    await prisma.revokedToken.create({
      data: {
        userId,
        tokenJti: `jti_${i + 1}_${Date.now()}`,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });
  }

  // ── 8. INVITE TOKENS (10) ───────────────────────────────────────

  await prisma.inviteToken.deleteMany({ where: { organizationId } });

  const inviteEmails = [
    'newuser1@example.com', 'newuser2@example.com', 'newuser3@example.com',
    'newuser4@example.com', 'newuser5@example.com', 'newuser6@example.com',
    'newuser7@example.com', 'newuser8@example.com', 'newuser9@example.com',
    'newuser10@example.com',
  ];

  for (let i = 0; i < 10; i++) {
    await prisma.inviteToken.create({
      data: {
        organizationId,
        userId: allUserIds[i % allUserIds.length],
        tokenHash: `invite_token_hash_${i + 1}`,
        invitedEmail: inviteEmails[i],
        inviteSentBy: adminId,
        expiresAt: new Date(Date.now() + 7 * 86400000),
        acceptedAt: i < 2 ? new Date() : null,
      },
    });
  }

  // ── 9. USER PERMISSIONS (10) ────────────────────────────────────

  const permCodes = ['users.read', 'hierarchy.view', 'product.read', 'price.read', 'reports.read', 'audit.read', 'orders.read', 'inventory.read', 'payments.read', 'settings.read'];

  for (let i = 0; i < 10; i++) {
    const userId = allUserIds[i % allUserIds.length];
    const permCode = permCodes[i % permCodes.length];
    const permission = permMap.get(permCode);
    if (!permission) continue;

    await prisma.userPermission.upsert({
      where: { userId_permissionId: { userId, permissionId: permission.id } },
      create: { userId, permissionId: permission.id, granted: i % 3 !== 0 },
      update: {},
    });
  }

  // ── 10. USER AUDIT LOGS (10) ────────────────────────────────────

  await prisma.userAuditLog.deleteMany({ where: { organizationId } });

  const auditActions = ['LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'PROFILE_UPDATE', 'ROLE_ASSIGNED', 'USER_CREATED', 'USER_LOCKED', 'USER_UNLOCKED', 'USER_DEACTIVATED', 'SETTINGS_CHANGED'];
  const entityTypes = ['User', 'Role', 'Session', 'Profile', 'Organization'];

  for (let i = 0; i < 10; i++) {
    await prisma.userAuditLog.create({
      data: {
        organizationId,
        actorId: allUserIds[i % allUserIds.length],
        action: auditActions[i],
        entityType: entityTypes[i % entityTypes.length],
        entityId: allUserIds[(i + 1) % allUserIds.length],
        newValue: { note: `Audit log entry ${i + 1}` },
        ipAddress: `10.0.0.${i + 1}`,
      },
    });
  }

  // ── 11. AUDIT LOGS (10) ─────────────────────────────────────────

  await prisma.auditLog.deleteMany({ where: { companyId: organizationId } });

  const auditEntityTypes = ['Product', 'Category', 'Brand', 'User', 'Role', 'Price', 'Order', 'Distributor', 'Inventory', 'Payment'];

  for (let i = 0; i < 10; i++) {
    await prisma.auditLog.create({
      data: {
        companyId: organizationId,
        entityType: auditEntityTypes[i],
        entityId: `entity_${i + 1}`,
        action: i % 2 === 0 ? 'CREATE' : 'UPDATE',
        field: i % 2 === 0 ? null : 'status',
        oldValue: i % 2 === 0 ? null : 'INACTIVE',
        newValue: i % 2 === 0 ? 'Entity created' : 'ACTIVE',
        actorId: allUserIds[i % allUserIds.length],
        ipAddress: `10.0.0.${i + 10}`,
        userAgent: 'SeedScript/1.0',
      },
    });
  }

  // ── 12. SECURITY EVENTS (10) ────────────────────────────────────

  await prisma.securityEvent.deleteMany({ where: { companyId: organizationId } });

  const eventTypes = ['UNAUTHORIZED_ACCESS', 'RATE_LIMIT_EXCEEDED', 'INVALID_TOKEN', 'LOGIN_FAILURE', 'PERMISSION_DENIED', 'FILE_UPLOAD_ABUSE', 'SUSPICIOUS_ACTIVITY', 'BRUTE_FORCE_ATTEMPT', 'MFA_FAILURE', 'SESSION_HIJACK_ATTEMPT'];
  const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  for (let i = 0; i < 10; i++) {
    await prisma.securityEvent.create({
      data: {
        companyId: organizationId,
        eventType: eventTypes[i],
        severity: severities[i % severities.length],
        actorId: allUserIds[i % allUserIds.length],
        ipAddress: `192.168.99.${i + 1}`,
        resource: `/api/${auditEntityTypes[i].toLowerCase()}`,
        details: { reason: `Security event ${i + 1}`, triggeredBy: 'automated_seed' },
      },
    });
  }

  // ── 13. DISTRIBUTOR MASTERS (10) ────────────────────────────────

  const distributorMastersData = [
    { code: 'DIST-MUM-001', name: 'Mumbai Wholesale Distributors', gstNumber: '27AABCU1234D1Z1', address: 'Andheri East, Mumbai', city: 'Mumbai', state: 'Maharashtra', pincode: '400093', contactPerson: 'Rajesh Patil', contactNumber: '9876543210', email: 'mumbai@example.com' },
    { code: 'DIST-DEL-001', name: 'Delhi Trading Co.', gstNumber: '07DEFG5678H1Z1', address: 'Karol Bagh, New Delhi', city: 'Delhi', state: 'Delhi', pincode: '110005', contactPerson: 'Vijay Singh', contactNumber: '9876543211', email: 'delhi@example.com' },
    { code: 'DIST-BLR-001', name: 'Bangalore Supply Solutions', gstNumber: '29HIJK9012L1Z1', address: 'Whitefield, Bangalore', city: 'Bangalore', state: 'Karnataka', pincode: '560066', contactPerson: 'Suresh Reddy', contactNumber: '9876543212', email: 'blr@example.com' },
    { code: 'DIST-CHE-001', name: 'Chennai Distributors Pvt Ltd', gstNumber: '33MNOP3456Q1Z1', address: 'T Nagar, Chennai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017', contactPerson: 'Karthik Rajan', contactNumber: '9876543213', email: 'chennai@example.com' },
    { code: 'DIST-KOL-001', name: 'Kolkata Wholesale Mart', gstNumber: '19QRST7890U1Z1', address: 'Park Street, Kolkata', city: 'Kolkata', state: 'West Bengal', pincode: '700016', contactPerson: 'Arun Das', contactNumber: '9876543214', email: 'kolkata@example.com' },
    { code: 'DIST-HYD-001', name: 'Hyderabad Traders Union', gstNumber: '36VWXY1234Z1Z1', address: 'Banjara Hills, Hyderabad', city: 'Hyderabad', state: 'Telangana', pincode: '500034', contactPerson: 'Srinivas Rao', contactNumber: '9876543215', email: 'hyd@example.com' },
    { code: 'DIST-AHM-001', name: 'Ahmedabad Distributors', gstNumber: '24ABCD5678E1Z1', address: 'Navrangpura, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009', contactPerson: 'Nikhil Shah', contactNumber: '9876543216', email: 'ahm@example.com' },
    { code: 'DIST-PUN-001', name: 'Pune Supply Chain Ltd', gstNumber: '27FGHI9012J1Z1', address: 'Hinjewadi, Pune', city: 'Pune', state: 'Maharashtra', pincode: '411057', contactPerson: 'Amey Kulkarni', contactNumber: '9876543217', email: 'pune@example.com' },
    { code: 'DIST-LKO-001', name: 'Lucknow Trading House', gstNumber: '09KLMN3456P1Z1', address: 'Hazratganj, Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', contactPerson: 'Ravi Shukla', contactNumber: '9876543218', email: 'lko@example.com' },
    { code: 'DIST-JAI-001', name: 'Jaipur Distributors', gstNumber: '08QRST7890V1Z1', address: 'MI Road, Jaipur', city: 'Jaipur', state: 'Rajasthan', pincode: '302001', contactPerson: 'Manoj Gupta', contactNumber: '9876543219', email: 'jai@example.com' },
  ];

  for (const dm of distributorMastersData) {
    await prisma.distributorMaster.upsert({
      where: { companyId_code: { companyId: organizationId, code: dm.code } },
      create: { companyId: organizationId, ...dm },
      update: {},
    });
  }

  // ════════════════════════════════════════════════════════════════
  // PRODUCT MASTER MODULE — V2 SEED DATA
  // ════════════════════════════════════════════════════════════════

  // ── 14. PRODUCT CATEGORIES (10) ─────────────────────────────────

  const categoryData = [
    { categoryCode: 'CAT-FG', categoryName: 'Food Grains', description: 'Rice, wheat, and other grains' },
    { categoryCode: 'CAT-BEV', categoryName: 'Beverages', description: 'Soft drinks, juices, and other beverages' },
    { categoryCode: 'CAT-SNC', categoryName: 'Snacks & Confectionery', description: 'Biscuits, chips, candies' },
    { categoryCode: 'CAT-DRY', categoryName: 'Dairy & Chilled', description: 'Milk, yogurt, cheese' },
    { categoryCode: 'CAT-PHC', categoryName: 'Personal & Home Care', description: 'Soaps, detergents, toiletries' },
    { categoryCode: 'CAT-CON', categoryName: 'Condiments & Sauces', description: 'Ketchup, sauces, pickles' },
    { categoryCode: 'CAT-SPI', categoryName: 'Spices & Masalas', description: 'Ground spices, whole spices, blends' },
    { categoryCode: 'CAT-FRO', categoryName: 'Frozen Foods', description: 'Frozen vegetables, ready-to-eat meals' },
    { categoryCode: 'CAT-HYB', categoryName: 'Hygiene & Baby Care', description: 'Diapers, wipes, sanitizers' },
    { categoryCode: 'CAT-OTC', categoryName: 'Health & Wellness', description: 'Vitamins, supplements, OTC medicines' },
  ];

  const createdCategories: { id: string; categoryCode: string }[] = [];

  for (const cat of categoryData) {
    const record = await prisma.productCategory.upsert({
      where: { companyId_categoryCode: { companyId: organizationId, categoryCode: cat.categoryCode } },
      create: { companyId: organizationId, ...cat },
      update: {},
    });
    createdCategories.push({ id: record.id, categoryCode: record.categoryCode });
  }

  function findCategory(code: string) {
    const c = createdCategories.find((c) => c.categoryCode === code);
    if (!c) throw new Error(`Category not found: ${code}`);
    return c;
  }

  // ── 15. PRODUCT SUB-CATEGORIES (10) ─────────────────────────────

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
    { subCategoryCode: 'SCT-DET', subCategoryName: 'Detergents', description: 'Laundry and dishwashing detergents', categoryCode: 'CAT-PHC' },
  ];

  const createdSubCategories: { id: string; subCategoryCode: string }[] = [];

  for (const sc of subCategoryData) {
    const categoryId = findCategory(sc.categoryCode).id;
    const record = await prisma.productSubCategory.upsert({
      where: { companyId_subCategoryCode: { companyId: organizationId, subCategoryCode: sc.subCategoryCode } },
      create: { companyId: organizationId, categoryId, subCategoryCode: sc.subCategoryCode, subCategoryName: sc.subCategoryName, description: sc.description },
      update: {},
    });
    createdSubCategories.push({ id: record.id, subCategoryCode: record.subCategoryCode });
  }

  function findSubCategory(code: string) {
    return createdSubCategories.find((sc) => sc.subCategoryCode === code);
  }

  // ── 16. BRANDS (10) ─────────────────────────────────────────────

  const brandData = [
    { brandCode: 'BRD-PH', brandName: 'Premium Harvest', description: 'Premium quality food products' },
    { brandCode: 'BRD-NF', brandName: "Nature's Fresh", description: 'Natural and organic products' },
    { brandCode: 'BRD-CF', brandName: 'Cool Fizz', description: 'Refreshing beverages' },
    { brandCode: 'BRD-CB', brandName: 'Crunchy Bites', description: 'Delicious snacks' },
    { brandCode: 'BRD-DF', brandName: 'Daily Fresh', description: 'Daily household essentials' },
    { brandCode: 'BRD-SP', brandName: 'Spice Paradise', description: 'Premium spice blends' },
    { brandCode: 'BRD-GF', brandName: 'Green Farms', description: 'Farm-fresh produce range' },
    { brandCode: 'BRD-FZ', brandName: 'Freeze Zone', description: 'Frozen food specialties' },
    { brandCode: 'BRD-BB', brandName: 'Baby Bliss', description: 'Baby care products' },
    { brandCode: 'BRD-WL', brandName: 'Wellness Life', description: 'Health supplements and vitamins' },
  ];

  const createdBrands: { id: string; brandCode: string }[] = [];

  for (const b of brandData) {
    const record = await prisma.brand.upsert({
      where: { companyId_brandCode: { companyId: organizationId, brandCode: b.brandCode } },
      create: { companyId: organizationId, ...b },
      update: {},
    });
    createdBrands.push({ id: record.id, brandCode: record.brandCode });
  }

  function findBrand(code: string) {
    return createdBrands.find((b) => b.brandCode === code);
  }

  // ── 17. MANUFACTURERS (10) ──────────────────────────────────────

  const manufacturerData = [
    { manufacturerCode: 'MFR-ABC', manufacturerName: 'ABC Foods Ltd', gstNumber: '27AABCA1234B1Z1', contactPerson: 'Rajesh Mehta', email: 'rajesh@abcfoods.in', phone: '9876543210', address: 'Mumbai, Maharashtra' },
    { manufacturerCode: 'MFR-XYZ', manufacturerName: 'XYZ Beverages Pvt Ltd', gstNumber: '27XYZB5678C1Z1', contactPerson: 'Priya Sharma', email: 'priya@xyzbeverages.in', phone: '9876543211', address: 'Pune, Maharashtra' },
    { manufacturerCode: 'MFR-FDI', manufacturerName: 'Fresh Dairy Industries', gstNumber: '27FRSC9012D1Z1', contactPerson: 'Amit Singh', email: 'amit@freshdairy.in', phone: '9876543212', address: 'Nagpur, Maharashtra' },
    { manufacturerCode: 'MFR-SP', manufacturerName: 'Spice Paradise Ltd', gstNumber: '27SPCE1234E1Z1', contactPerson: 'Meera Nair', email: 'meera@spiceparadise.in', phone: '9876543220', address: 'Kochi, Kerala' },
    { manufacturerCode: 'MFR-GF', manufacturerName: 'Green Farms Agro', gstNumber: '27GRFA5678F1Z1', contactPerson: 'Harish Patil', email: 'harish@greenfarms.in', phone: '9876543221', address: 'Nashik, Maharashtra' },
    { manufacturerCode: 'MFR-FZ', manufacturerName: 'Freeze Zone Foods', gstNumber: '27FRZN9012G1Z1', contactPerson: 'Anita Desai', email: 'anita@freezezone.in', phone: '9876543222', address: 'Gurgaon, Haryana' },
    { manufacturerCode: 'MFR-BB', manufacturerName: 'Baby Bliss Pvt Ltd', gstNumber: '27BABY3456H1Z1', contactPerson: 'Sunetra Gupta', email: 'sunetra@babybliss.in', phone: '9876543223', address: 'Bengaluru, Karnataka' },
    { manufacturerCode: 'MFR-WL', manufacturerName: 'Wellness Life Pharma', gstNumber: '27WELL7890I1Z1', contactPerson: 'Dr. Karan Shah', email: 'karan@wellnesslife.in', phone: '9876543224', address: 'Hyderabad, Telangana' },
    { manufacturerCode: 'MFR-GL', manufacturerName: 'Global Logistics Trading Co', gstNumber: '27GLBL1234J1Z1', contactPerson: 'Vivek Oberoi', email: 'vivek@globallogistics.in', phone: '9876543225', address: 'Chennai, Tamil Nadu' },
    { manufacturerCode: 'MFR-SS', manufacturerName: 'Sunshine Essentials Ltd', gstNumber: '27SUNS5678K1Z1', contactPerson: 'Divya Sharma', email: 'divya@sunshine.in', phone: '9876543226', address: 'Ahmedabad, Gujarat' },
  ];

  const createdManufacturers: { id: string; manufacturerCode: string }[] = [];

  for (const m of manufacturerData) {
    const record = await prisma.manufacturer.upsert({
      where: { companyId_manufacturerCode: { companyId: organizationId, manufacturerCode: m.manufacturerCode } },
      create: { companyId: organizationId, ...m },
      update: {},
    });
    createdManufacturers.push({ id: record.id, manufacturerCode: record.manufacturerCode });
  }

  function findManufacturer(code: string) {
    return createdManufacturers.find((m) => m.manufacturerCode === code);
  }

  // ── 18. UOMs (10) ───────────────────────────────────────────────

  const uomData = [
    { uomCode: 'UOM-KG', uomName: 'Kilogram', description: 'Weight in kilograms' },
    { uomCode: 'UOM-GM', uomName: 'Gram', description: 'Weight in grams' },
    { uomCode: 'UOM-LTR', uomName: 'Litre', description: 'Volume in litres' },
    { uomCode: 'UOM-ML', uomName: 'Millilitre', description: 'Volume in millilitres' },
    { uomCode: 'UOM-PCS', uomName: 'Piece', description: 'Individual piece/unit' },
    { uomCode: 'UOM-BOX', uomName: 'Box', description: 'Box of items' },
    { uomCode: 'UOM-DZ', uomName: 'Dozen', description: '12 pieces' },
    { uomCode: 'UOM-PK', uomName: 'Pack', description: 'Pack of items' },
    { uomCode: 'UOM-LB', uomName: 'Pound', description: 'Weight in pounds' },
    { uomCode: 'UOM-TN', uomName: 'Tonne', description: 'Metric tonne (1000 kg)' },
  ];

  const createdUoms: { id: string; uomCode: string }[] = [];

  for (const u of uomData) {
    const record = await prisma.uom.upsert({
      where: { companyId_uomCode: { companyId: organizationId, uomCode: u.uomCode } },
      create: { companyId: organizationId, ...u },
      update: {},
    });
    createdUoms.push({ id: record.id, uomCode: record.uomCode });
  }

  function findUom(code: string) {
    return createdUoms.find((u) => u.uomCode === code);
  }

  // ── 19. TAX GROUPS (10) ─────────────────────────────────────────

  const taxGroupData = [
    { taxCode: 'GST-5', taxName: 'GST 5%', cgst: 2.5, sgst: 2.5, igst: 5.0, cess: 0 },
    { taxCode: 'GST-12', taxName: 'GST 12%', cgst: 6.0, sgst: 6.0, igst: 12.0, cess: 0 },
    { taxCode: 'GST-18', taxName: 'GST 18%', cgst: 9.0, sgst: 9.0, igst: 18.0, cess: 0 },
    { taxCode: 'GST-28', taxName: 'GST 28%', cgst: 14.0, sgst: 14.0, igst: 28.0, cess: 0 },
    { taxCode: 'GST-0', taxName: 'GST Exempt', cgst: 0, sgst: 0, igst: 0, cess: 0 },
    { taxCode: 'GST-3', taxName: 'GST 3%', cgst: 1.5, sgst: 1.5, igst: 3.0, cess: 0 },
    { taxCode: 'GST-2.5', taxName: 'GST 2.5%', cgst: 1.25, sgst: 1.25, igst: 2.5, cess: 0 },
    { taxCode: 'GST-6', taxName: 'GST 6%', cgst: 3.0, sgst: 3.0, igst: 6.0, cess: 2 },
    { taxCode: 'GST-20', taxName: 'GST 20%', cgst: 10.0, sgst: 10.0, igst: 20.0, cess: 5 },
    { taxCode: 'GST-30', taxName: 'GST 30%', cgst: 15.0, sgst: 15.0, igst: 30.0, cess: 10 },
  ];

  const createdTaxGroups: { id: string; taxCode: string }[] = [];

  for (const tg of taxGroupData) {
    const record = await prisma.taxGroup.upsert({
      where: { companyId_taxCode: { companyId: organizationId, taxCode: tg.taxCode } },
      create: { companyId: organizationId, ...tg },
      update: {},
    });
    createdTaxGroups.push({ id: record.id, taxCode: record.taxCode });
  }

  function findTaxGroup(code: string) {
    return createdTaxGroups.find((t) => t.taxCode === code);
  }

  // ── 20. PRODUCTS (10) ───────────────────────────────────────────

  const productData = [
    {
      productCode: 'PROD-001', productName: 'Premium Basmati Rice 5kg', shortName: 'Basmati Rice 5kg',
      description: 'Premium quality basmati rice 5kg pack',
      categoryCode: 'CAT-FG', subCategoryCode: 'SCT-RICE', brandCode: 'BRD-PH', manufacturerCode: 'MFR-ABC',
      uomCode: 'UOM-KG', barcode: '8901234567890', hsnCode: '10063020', skuType: 'FINISHED_GOOD' as const,
      shelfLifeDays: 365, reorderLevel: 50,
    },
    {
      productCode: 'PROD-002', productName: 'Cold Pressed Coconut Oil 1L', shortName: 'Coconut Oil 1L',
      description: 'Pure cold pressed coconut oil 1 litre bottle',
      categoryCode: 'CAT-FG', subCategoryCode: 'SCT-OIL', brandCode: 'BRD-NF', manufacturerCode: 'MFR-ABC',
      uomCode: 'UOM-LTR', barcode: '8901234567891', hsnCode: '15131100', skuType: 'FINISHED_GOOD' as const,
      shelfLifeDays: 730, reorderLevel: 30,
    },
    {
      productCode: 'PROD-003', productName: 'Whole Wheat Atta 10kg', shortName: 'Wheat Atta 10kg',
      description: 'Stone-ground whole wheat flour 10kg bag',
      categoryCode: 'CAT-FG', subCategoryCode: 'SCT-WHEAT', brandCode: 'BRD-PH', manufacturerCode: 'MFR-ABC',
      uomCode: 'UOM-KG', barcode: '8901234567892', hsnCode: '11010000', skuType: 'FINISHED_GOOD' as const,
      shelfLifeDays: 180, reorderLevel: 40,
    },
    {
      productCode: 'PROD-004', productName: 'Classic Cola 2L', shortName: 'Cola 2L',
      description: 'Refreshing carbonated cola drink 2 litre bottle',
      categoryCode: 'CAT-BEV', subCategoryCode: 'SCT-CARB', brandCode: 'BRD-CF', manufacturerCode: 'MFR-XYZ',
      uomCode: 'UOM-LTR', barcode: '8901234567893', hsnCode: '22021000', skuType: 'FINISHED_GOOD' as const,
      shelfLifeDays: 365, reorderLevel: 100,
    },
    {
      productCode: 'PROD-005', productName: 'Mixed Fruit Juice 1L', shortName: 'Fruit Juice 1L',
      description: 'Mixed fruit juice blend 1 litre carton',
      categoryCode: 'CAT-BEV', subCategoryCode: 'SCT-JUICE', brandCode: 'BRD-NF', manufacturerCode: 'MFR-XYZ',
      uomCode: 'UOM-LTR', barcode: '8901234567894', hsnCode: '20099000', skuType: 'FINISHED_GOOD' as const,
      shelfLifeDays: 270, reorderLevel: 60,
    },
    {
      productCode: 'PROD-006', productName: 'Digestive Biscuits 400g', shortName: 'Digestive Biscuits 400g',
      description: 'High-fibre digestive biscuits 400g pack',
      categoryCode: 'CAT-SNC', subCategoryCode: 'SCT-BISCUIT', brandCode: 'BRD-CB', manufacturerCode: 'MFR-ABC',
      uomCode: 'UOM-GM', barcode: '8901234567895', hsnCode: '19053100', skuType: 'FINISHED_GOOD' as const,
      shelfLifeDays: 240, reorderLevel: 80,
    },
    {
      productCode: 'PROD-007', productName: 'Potato Chips 150g', shortName: 'Potato Chips 150g',
      description: 'Crispy salted potato chips 150g pack',
      categoryCode: 'CAT-SNC', subCategoryCode: 'SCT-CHIPS', brandCode: 'BRD-CB', manufacturerCode: 'MFR-ABC',
      uomCode: 'UOM-GM', barcode: '8901234567896', hsnCode: '20052000', skuType: 'FINISHED_GOOD' as const,
      shelfLifeDays: 120, reorderLevel: 120,
    },
    {
      productCode: 'PROD-008', productName: 'Toned Milk 1L', shortName: 'Milk 1L',
      description: 'Fresh toned milk 1 litre pouch',
      categoryCode: 'CAT-DRY', subCategoryCode: 'SCT-MILK', brandCode: 'BRD-DF', manufacturerCode: 'MFR-FDI',
      uomCode: 'UOM-LTR', barcode: '8901234567897', hsnCode: '04012000', skuType: 'FINISHED_GOOD' as const,
      shelfLifeDays: 7, reorderLevel: 200,
    },
    {
      productCode: 'PROD-009', productName: 'Bath Soap 100g', shortName: 'Bath Soap 100g',
      description: 'Moisturizing bath soap 100g bar',
      categoryCode: 'CAT-PHC', subCategoryCode: 'SCT-SOAP', brandCode: 'BRD-DF', manufacturerCode: 'MFR-FDI',
      uomCode: 'UOM-GM', barcode: '8901234567898', hsnCode: '34011100', skuType: 'FINISHED_GOOD' as const,
      shelfLifeDays: 730, reorderLevel: 150,
    },
    {
      productCode: 'PROD-010', productName: 'Tomato Ketchup 500g', shortName: 'Ketchup 500g',
      description: 'Rich tomato ketchup 500g bottle',
      categoryCode: 'CAT-CON', subCategoryCode: null, brandCode: 'BRD-SP', manufacturerCode: 'MFR-SP',
      uomCode: 'UOM-GM', barcode: '8901234567899', hsnCode: '21032000', skuType: 'FINISHED_GOOD' as const,
      shelfLifeDays: 365, reorderLevel: 40,
    },
  ];

  const createdProducts: { id: string; productCode: string }[] = [];

  for (const p of productData) {
    const category = findCategory(p.categoryCode);
    const subCategory = p.subCategoryCode ? findSubCategory(p.subCategoryCode) : undefined;
    const brand = findBrand(p.brandCode);
    const manufacturer = findManufacturer(p.manufacturerCode);
    const uom = findUom(p.uomCode);

    const record = await prisma.product.upsert({
      where: { companyId_productCode: { companyId: organizationId, productCode: p.productCode } },
      create: {
        companyId: organizationId,
        productCode: p.productCode,
        productName: p.productName,
        shortName: p.shortName,
        description: p.description,
        categoryId: category.id,
        subCategoryId: subCategory?.id ?? null,
        brandId: brand?.id ?? null,
        manufacturerId: manufacturer?.id ?? null,
        uomId: uom!.id,
        barcode: p.barcode,
        hsnCode: p.hsnCode,
        skuType: p.skuType,
        shelfLifeDays: p.shelfLifeDays,
        reorderLevel: p.reorderLevel,
        status: 'ACTIVE',
        createdBy: adminId,
      },
      update: {},
    });
    createdProducts.push({ id: record.id, productCode: record.productCode });
  }

  function findProduct(code: string) {
    return createdProducts.find((p) => p.productCode === code);
  }

  // ── 21. PRODUCT UOM CONVERSIONS (10) ────────────────────────────

  const conversionData = [
    { productCode: 'PROD-001', fromUomCode: 'UOM-KG', toUomCode: 'UOM-GM', conversionFactor: 1000 },
    { productCode: 'PROD-001', fromUomCode: 'UOM-KG', toUomCode: 'UOM-PCS', conversionFactor: 1 },
    { productCode: 'PROD-002', fromUomCode: 'UOM-LTR', toUomCode: 'UOM-ML', conversionFactor: 1000 },
    { productCode: 'PROD-003', fromUomCode: 'UOM-KG', toUomCode: 'UOM-GM', conversionFactor: 1000 },
    { productCode: 'PROD-004', fromUomCode: 'UOM-LTR', toUomCode: 'UOM-ML', conversionFactor: 2000 },
    { productCode: 'PROD-005', fromUomCode: 'UOM-LTR', toUomCode: 'UOM-ML', conversionFactor: 1000 },
    { productCode: 'PROD-006', fromUomCode: 'UOM-GM', toUomCode: 'UOM-KG', conversionFactor: 0.001 },
    { productCode: 'PROD-007', fromUomCode: 'UOM-GM', toUomCode: 'UOM-KG', conversionFactor: 0.001 },
    { productCode: 'PROD-008', fromUomCode: 'UOM-LTR', toUomCode: 'UOM-ML', conversionFactor: 1000 },
    { productCode: 'PROD-009', fromUomCode: 'UOM-GM', toUomCode: 'UOM-PCS', conversionFactor: 1 },
  ];

  for (const c of conversionData) {
    const product = findProduct(c.productCode);
    const fromUom = findUom(c.fromUomCode);
    const toUom = findUom(c.toUomCode);
    if (!product || !fromUom || !toUom) continue;

    await prisma.productUomConversion.upsert({
      where: {
        companyId_productId_fromUomId_toUomId: {
          companyId: organizationId,
          productId: product.id,
          fromUomId: fromUom.id,
          toUomId: toUom.id,
        },
      },
      create: {
        companyId: organizationId,
        productId: product.id,
        fromUomId: fromUom.id,
        toUomId: toUom.id,
        conversionFactor: c.conversionFactor,
      },
      update: {},
    });
  }

  // ── 22. PRODUCT PRICES (10) ─────────────────────────────────────

  await prisma.productPrice.deleteMany({ where: { companyId: organizationId } });

  const priceData = [
    { productCode: 'PROD-001', mrp: 450.0, ptr: 400.0, pts: 380.0, distributorPrice: 360.0, effectiveFrom: new Date('2025-01-01') },
    { productCode: 'PROD-002', mrp: 280.0, ptr: 250.0, pts: 235.0, distributorPrice: 220.0, effectiveFrom: new Date('2025-01-01') },
    { productCode: 'PROD-003', mrp: 320.0, ptr: 290.0, pts: 275.0, distributorPrice: 260.0, effectiveFrom: new Date('2025-01-01') },
    { productCode: 'PROD-004', mrp: 85.0, ptr: 75.0, pts: 70.0, distributorPrice: 65.0, effectiveFrom: new Date('2025-01-01') },
    { productCode: 'PROD-005', mrp: 120.0, ptr: 108.0, pts: 102.0, distributorPrice: 96.0, effectiveFrom: new Date('2025-01-01') },
    { productCode: 'PROD-006', mrp: 95.0, ptr: 85.0, pts: 80.0, distributorPrice: 75.0, effectiveFrom: new Date('2025-01-01') },
    { productCode: 'PROD-007', mrp: 30.0, ptr: 27.0, pts: 25.0, distributorPrice: 23.0, effectiveFrom: new Date('2025-01-01') },
    { productCode: 'PROD-008', mrp: 60.0, ptr: 54.0, pts: 51.0, distributorPrice: 48.0, effectiveFrom: new Date('2025-01-01') },
    { productCode: 'PROD-009', mrp: 45.0, ptr: 40.0, pts: 38.0, distributorPrice: 36.0, effectiveFrom: new Date('2025-01-01') },
    { productCode: 'PROD-010', mrp: 75.0, ptr: 68.0, pts: 64.0, distributorPrice: 60.0, effectiveFrom: new Date('2025-01-01') },
  ];

  for (const p of priceData) {
    const product = findProduct(p.productCode);
    if (!product) continue;

    await prisma.productPrice.create({
      data: {
        companyId: organizationId,
        productId: product.id,
        mrp: p.mrp,
        ptr: p.ptr,
        pts: p.pts,
        distributorPrice: p.distributorPrice,
        effectiveFrom: p.effectiveFrom,
        createdBy: adminId,
      },
    });
  }

  // ── 23. PRODUCT IMAGES (10) ─────────────────────────────────────

  await prisma.productImage.deleteMany({ where: { companyId: organizationId } });

  for (let i = 0; i < 10; i++) {
    const productCode = `PROD-${String(i + 1).padStart(3, '0')}`;
    const product = findProduct(productCode);
    if (!product) continue;

    await prisma.productImage.create({
      data: {
        companyId: organizationId,
        productId: product.id,
        fileName: `${productCode.toLowerCase()}_main.jpg`,
        filePath: `/images/products/${productCode.toLowerCase()}_main.jpg`,
        isPrimary: true,
        createdBy: adminId,
      },
    });
  }

  // ── 24. PRODUCT DOCUMENTS (10) ──────────────────────────────────

  await prisma.prodDocument.deleteMany({ where: { companyId: organizationId } });

  const docTypes = ['COA', 'MSDS', 'SPEC_SHEET', 'NUTRITION_LABEL', 'CERTIFICATION', 'MANUFACTURING_LICENCE', 'GST_CERT', 'FSSAI_LICENCE', 'PACKAGING_SPEC', 'BATCH_RECORD'];

  for (let i = 0; i < 10; i++) {
    const productCode = `PROD-${String(i + 1).padStart(3, '0')}`;
    const product = findProduct(productCode);
    if (!product) continue;

    await prisma.prodDocument.create({
      data: {
        companyId: organizationId,
        productId: product.id,
        documentType: docTypes[i],
        fileName: `${productCode.toLowerCase()}_${docTypes[i].toLowerCase()}.pdf`,
        filePath: `/documents/products/${productCode.toLowerCase()}_${docTypes[i].toLowerCase()}.pdf`,
        createdBy: adminId,
      },
    });
  }

  // ── 25. ATTRIBUTE DEFINITIONS (10) ──────────────────────────────

  const attributeData = [
    { attributeCode: 'ATTR-FLAVOR', attributeName: 'Flavor', dataType: 'DROPDOWN' as const, mandatory: false },
    { attributeCode: 'ATTR-COLOR', attributeName: 'Color', dataType: 'DROPDOWN' as const, mandatory: false },
    { attributeCode: 'ATTR-SIZE', attributeName: 'Size', dataType: 'TEXT' as const, mandatory: false },
    { attributeCode: 'ATTR-WEIGHT', attributeName: 'Weight (g)', dataType: 'NUMBER' as const, mandatory: true },
    { attributeCode: 'ATTR-ORGANIC', attributeName: 'Organic Certified', dataType: 'BOOLEAN' as const, mandatory: false },
    { attributeCode: 'ATTR-MFG-DATE', attributeName: 'Manufacturing Date', dataType: 'DATE' as const, mandatory: true },
    { attributeCode: 'ATTR-EXP-DATE', attributeName: 'Expiry Date', dataType: 'DATE' as const, mandatory: true },
    { attributeCode: 'ATTR-BATCH', attributeName: 'Batch Number', dataType: 'TEXT' as const, mandatory: false },
    { attributeCode: 'ATTR-STOCK', attributeName: 'Stock Quantity', dataType: 'NUMBER' as const, mandatory: true },
    { attributeCode: 'ATTR-VARIANT', attributeName: 'Variant', dataType: 'DROPDOWN' as const, mandatory: false },
  ];

  const createdAttributes: { id: string; attributeCode: string }[] = [];

  for (const attr of attributeData) {
    const record = await prisma.attributeDefinition.upsert({
      where: { companyId_attributeCode: { companyId: organizationId, attributeCode: attr.attributeCode } },
      create: { companyId: organizationId, ...attr },
      update: {},
    });
    createdAttributes.push({ id: record.id, attributeCode: record.attributeCode });
  }

  // ── 26. PRODUCT ATTRIBUTE VALUES (10) ───────────────────────────

  const attrValueData = [
    { productCode: 'PROD-001', attributeCode: 'ATTR-WEIGHT', value: '5000' },
    { productCode: 'PROD-001', attributeCode: 'ATTR-ORGANIC', value: 'false' },
    { productCode: 'PROD-002', attributeCode: 'ATTR-WEIGHT', value: '1000' },
    { productCode: 'PROD-002', attributeCode: 'ATTR-ORGANIC', value: 'true' },
    { productCode: 'PROD-003', attributeCode: 'ATTR-WEIGHT', value: '10000' },
    { productCode: 'PROD-004', attributeCode: 'ATTR-FLAVOR', value: 'Cola' },
    { productCode: 'PROD-005', attributeCode: 'ATTR-FLAVOR', value: 'Mixed Fruit' },
    { productCode: 'PROD-006', attributeCode: 'ATTR-WEIGHT', value: '400' },
    { productCode: 'PROD-007', attributeCode: 'ATTR-FLAVOR', value: 'Salted' },
    { productCode: 'PROD-008', attributeCode: 'ATTR-WEIGHT', value: '1000' },
  ];

  for (const av of attrValueData) {
    const product = findProduct(av.productCode);
    const attrDef = createdAttributes.find((a) => a.attributeCode === av.attributeCode);
    if (!product || !attrDef) continue;

    await prisma.productAttributeValue.upsert({
      where: {
        companyId_productId_attributeId: {
          companyId: organizationId,
          productId: product.id,
          attributeId: attrDef.id,
        },
      },
      create: {
        companyId: organizationId,
        productId: product.id,
        attributeId: attrDef.id,
        value: av.value,
      },
      update: {},
    });
  }

  // ── 27. PRODUCT TAGS (10) ───────────────────────────────────────

  const tagNames = ['Bestseller', 'New Arrival', 'Organic', 'Seasonal', 'Discount Eligible', 'Premium', 'Eco-Friendly', 'Limited Edition', 'Bulk Pack', 'Sample'];

  const createdTags: { id: string; tagName: string }[] = [];

  for (const tagName of tagNames) {
    const record = await prisma.productTag.upsert({
      where: { companyId_tagName: { companyId: organizationId, tagName } },
      create: { companyId: organizationId, tagName },
      update: {},
    });
    createdTags.push({ id: record.id, tagName: record.tagName });
  }

  // ── 28. PRODUCT TAG MAPPINGS (10) ───────────────────────────────

  for (let i = 0; i < 10; i++) {
    const productCode = `PROD-${String((i % 10) + 1).padStart(3, '0')}`;
    const product = findProduct(productCode);
    const tag = createdTags[i];
    if (!product || !tag) continue;

    await prisma.productTagMapping.upsert({
      where: {
        companyId_productId_tagId: {
          companyId: organizationId,
          productId: product.id,
          tagId: tag.id,
        },
      },
      create: {
        companyId: organizationId,
        productId: product.id,
        tagId: tag.id,
      },
      update: {},
    });
  }

  // ── 29. PRODUCT WAREHOUSES (10) ─────────────────────────────────

  await prisma.productWarehouse.deleteMany({ where: { companyId: organizationId } });

  const warehouseIds = ['WH-MUM-01', 'WH-DEL-01', 'WH-BLR-01', 'WH-CHE-01', 'WH-KOL-01', 'WH-HYD-01', 'WH-AHM-01', 'WH-PUN-01', 'WH-LKO-01', 'WH-JAI-01'];

  for (let i = 0; i < 10; i++) {
    const productCode = `PROD-${String((i % 10) + 1).padStart(3, '0')}`;
    const product = findProduct(productCode);
    if (!product) continue;

    await prisma.productWarehouse.create({
      data: {
        companyId: organizationId,
        productId: product.id,
        warehouseId: warehouseIds[i],
        minStock: 10,
        maxStock: 500,
        reorderLevel: 50,
      },
    });
  }

  // ── 30. PRODUCT AUDIT LOGS (10) ─────────────────────────────────

  await prisma.productAuditLog.deleteMany({ where: { companyId: organizationId } });

  const auditLogTableNames = ['products', 'product_categories', 'brands', 'manufacturers', 'uoms', 'tax_groups', 'product_prices', 'product_images', 'attribute_definitions', 'product_tags'];

  for (let i = 0; i < 10; i++) {
    const productCode = `PROD-${String((i % 10) + 1).padStart(3, '0')}`;
    const product = findProduct(productCode);

    await prisma.productAuditLog.create({
      data: {
        companyId: organizationId,
        tableName: auditLogTableNames[i],
        recordId: product?.id ?? `record_${i + 1}`,
        action: i < 5 ? 'CREATE' : 'UPDATE',
        oldData: i >= 5 ? { status: 'DRAFT' } : undefined,
        newData: { status: 'ACTIVE', updatedBy: adminId, timestamp: new Date().toISOString() },
        changedBy: adminId,
      },
    });
  }

  // ── 31. PRODUCT APPROVALS (10) ──────────────────────────────────

  await prisma.productApproval.deleteMany({ where: { companyId: organizationId } });

  const approvalStatuses = ['APPROVED', 'PENDING', 'REJECTED', 'APPROVED', 'PENDING', 'APPROVED', 'PENDING', 'APPROVED', 'REJECTED', 'PENDING'] as const;

  for (let i = 0; i < 10; i++) {
    const productCode = `PROD-${String((i % 10) + 1).padStart(3, '0')}`;
    const product = findProduct(productCode);
    if (!product) continue;

    await prisma.productApproval.create({
      data: {
        companyId: organizationId,
        productId: product.id,
        workflowId: `WF-PROD-${i + 1}`,
        approvalStatus: approvalStatuses[i],
        approvedBy: adminId,
        approvedAt: approvalStatuses[i] === 'REJECTED' ? null : new Date(),
        remarks: approvalStatuses[i] === 'APPROVED' ? 'All checks passed' : approvalStatuses[i] === 'REJECTED' ? 'Documentation incomplete' : 'Pending quality review',
        createdBy: adminId,
      },
    });
  }

  // ── SUMMARY ─────────────────────────────────────────────────────
  const summary: Record<string, number> = {};
  for (const model of [
    'Organization', 'User', 'Role', 'Permission', 'UserRole', 'RolePermission',
    'Session', 'PasswordResetToken', 'RevokedToken', 'InviteToken',
    'UserPermission', 'UserAuditLog', 'AuditLog', 'SecurityEvent', 'DistributorMaster',
    'ProductCategory', 'ProductSubCategory', 'Brand', 'Manufacturer', 'Uom',
    'TaxGroup', 'Product', 'ProductUomConversion', 'ProductPrice', 'ProductImage',
    'ProdDocument', 'AttributeDefinition', 'ProductAttributeValue', 'ProductTag',
    'ProductTagMapping', 'ProductWarehouse', 'ProductAuditLog', 'ProductApproval',
  ]) {
    const count = await (prisma as any)[model[0].toLowerCase() + model.slice(1)].count();
    summary[model] = count;
  }

  // eslint-disable-next-line no-console
  console.table(summary);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
