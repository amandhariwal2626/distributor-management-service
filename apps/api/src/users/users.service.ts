import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-logs/audit-logs.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUsersDto } from './dto/list-users.dto';

const DISTRIBUTOR_TEAM_ROLES = [
  'Salesman',
  'Accountant',
  'Warehouse User',
  'Delivery Boy',
];

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  async findAll(organizationId: string, query: ListUsersDto) {
    const profileSortFields = [
      'fullName',
      'firstName',
      'lastName',
      'userCode',
    ] as const;
    const sortBy = (profileSortFields as readonly string[]).includes(
      query.sortBy,
    )
      ? 'createdAt'
      : query.sortBy;

    const where: Prisma.UserWhereInput = {
      organizationId,
      deletedAt: null,
      ...(query.search
        ? {
            OR: [
              {
                profile: {
                  fullName: { contains: query.search, mode: 'insensitive' },
                },
              },
              { email: { contains: query.search, mode: 'insensitive' } },
              {
                profile: {
                  userCode: { contains: query.search, mode: 'insensitive' },
                },
              },
              {
                profile: {
                  mobile: { contains: query.search, mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.roleId ? { roles: { some: { roleId: query.roleId } } } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [sortBy]: query.sortOrder },
        include: {
          roles: { include: { role: true } },
          profile: true,
          reportingManager: {
            select: {
              id: true,
              profile: { select: { fullName: true } },
              email: true,
            },
          },
          invitesReceived: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      pages: Math.ceil(total / query.limit),
    };
  }

  async findById(organizationId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId, deletedAt: null },
      include: {
        roles: { include: { role: true } },
        profile: true,
        reportingManager: {
          select: {
            id: true,
            profile: { select: { fullName: true } },
            email: true,
          },
        },
        subordinates: {
          where: { deletedAt: null },
          select: {
            id: true,
            profile: { select: { fullName: true } },
            email: true,
          },
        },
        permissionOverrides: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(
    organizationId: string,
    actorUserId: string,
    actorRoleNames: string[],
    data: CreateUserDto,
    ipAddress?: string,
  ) {
    const existing = await this.prisma.user.findUnique({
      where: { organizationId_email: { organizationId, email: data.email } },
    });
    if (existing) throw new ConflictException('Email already exists');

    if (data.userCode) {
      const codeExists = await this.prisma.user.findFirst({
        where: {
          organizationId,
          profile: { userCode: data.userCode },
        },
      });
      if (codeExists) throw new ConflictException('User code already exists');
    }

    if (data.username) {
      const usernameExists = await this.prisma.user.findUnique({
        where: {
          organizationId_username: { organizationId, username: data.username },
        },
      });
      if (usernameExists)
        throw new ConflictException('Username already exists');
    }

    await this.validateCreationRules(actorRoleNames, data.roleIds);

    if (data.reportingManagerId) {
      await this.validateReportingManager(
        organizationId,
        data.reportingManagerId,
        data.roleIds,
      );
    }

    if (data.distributorId) {
      await this.validateDistributor(organizationId, data.distributorId);
    }

    const passwordHash = data.password
      ? await bcrypt.hash(data.password, 12)
      : undefined;

    const fullName =
      data.displayName || `${data.firstName.trim()} ${data.lastName.trim()}`;

    const user = await this.prisma.user.create({
      data: {
        organizationId,
        username: data.username,
        email: data.email.toLowerCase(),
        passwordHash,
        forcePasswordChange: data.forcePasswordChange ?? true,
        passwordExpiryDays: data.passwordExpiryDays ?? 90,
        twoFactorAuth: data.twoFactorAuth ?? false,
        status: passwordHash ? 'ACTIVE' : 'INACTIVE',
        reportingManagerId: data.reportingManagerId,
        zone: data.zone,
        region: data.region,
        area: data.area,
        territory: data.territory,
        distributorId: data.distributorId,
        createdBy: actorUserId,
        profile: {
          create: {
            userCode: data.userCode,
            employeeCode: data.employeeCode,
            firstName: data.firstName.trim(),
            middleName: data.middleName?.trim(),
            lastName: data.lastName.trim(),
            displayName: data.displayName,
            fullName,
            gender: data.gender,
            dob: data.dob ? new Date(data.dob) : undefined,
            mobile: data.mobile,
            alternateMobile: data.alternateMobile,
            emergencyContact: data.emergencyContact,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            addressLine3: data.addressLine3,
            country: data.country,
            state: data.state,
            district: data.district,
            city: data.city,
            pincode: data.pincode,
          },
        },
        roles: {
          createMany: {
            data: data.roleIds.map((roleId) => ({
              roleId,
              createdBy: actorUserId,
            })),
            skipDuplicates: true,
          },
        },
      },
      include: {
        roles: { include: { role: true } },
        profile: true,
      },
    });

    await this.auditLog.create({
      organizationId,
      actorId: actorUserId,
      action: 'USER_CREATED',
      entityType: 'user',
      entityId: user.id,
      newValue: {
        id: user.id,
        email: user.email,
        roleIds: data.roleIds,
      },
      ipAddress,
    });

    return user;
  }

  async update(
    organizationId: string,
    id: string,
    actorUserId: string,
    actorRoleNames: string[],
    data: UpdateUserDto,
    ipAddress?: string,
  ) {
    const existing = await this.findById(organizationId, id);

    if (data.email && data.email !== existing.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { organizationId_email: { organizationId, email: data.email } },
      });
      if (emailExists) throw new ConflictException('Email already exists');
    }

    if (data.userCode && data.userCode !== existing.profile?.userCode) {
      const codeExists = await this.prisma.user.findFirst({
        where: {
          organizationId,
          profile: { userCode: data.userCode },
        },
      });
      if (codeExists) throw new ConflictException('User code already exists');
    }

    if (data.username && data.username !== existing.username) {
      const usernameExists = await this.prisma.user.findUnique({
        where: {
          organizationId_username: { organizationId, username: data.username },
        },
      });
      if (usernameExists)
        throw new ConflictException('Username already exists');
    }

    if (data.roleIds) {
      await this.validateCreationRules(actorRoleNames, data.roleIds);
    }

    if (data.reportingManagerId !== undefined) {
      if (data.reportingManagerId) {
        await this.validateReportingManager(
          organizationId,
          data.reportingManagerId,
          data.roleIds || existing.roles.map((r: any) => r.roleId),
        );
      }
    }

    if (data.distributorId !== undefined) {
      if (data.distributorId) {
        await this.validateDistributor(organizationId, data.distributorId);
      }
    }

    const fullName =
      data.firstName && data.lastName
        ? `${data.firstName.trim()} ${data.lastName.trim()}`
        : data.firstName
          ? `${data.firstName.trim()} ${existing.profile?.lastName}`
          : data.lastName
            ? `${existing.profile?.firstName} ${data.lastName.trim()}`
            : undefined;

    const profileFields = new Set([
      'userCode',
      'employeeCode',
      'firstName',
      'middleName',
      'lastName',
      'displayName',
      'gender',
      'dob',
      'mobile',
      'alternateMobile',
      'emergencyContact',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'country',
      'state',
      'district',
      'city',
      'pincode',
    ]);

    const oldValue: Record<string, unknown> = {};

    const updatableFields: (keyof UpdateUserDto)[] = [
      'userCode',
      'employeeCode',
      'firstName',
      'middleName',
      'lastName',
      'displayName',
      'email',
      'username',
      'gender',
      'dob',
      'mobile',
      'alternateMobile',
      'emergencyContact',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'country',
      'state',
      'district',
      'city',
      'pincode',
      'reportingManagerId',
      'zone',
      'region',
      'area',
      'territory',
      'distributorId',
      'forcePasswordChange',
      'passwordExpiryDays',
      'twoFactorAuth',
    ];

    for (const field of updatableFields) {
      if (data[field] !== undefined) {
        (oldValue as any)[field] = profileFields.has(field)
          ? (existing as any).profile?.[field]
          : (existing as any)[field];
      }
    }

    const result = await this.prisma.$transaction(async (tx) => {
      if (data.roleIds) {
        const previous = await tx.userRole.findMany({
          where: { userId: id },
          include: { role: true },
        });
        oldValue.roleIds = previous.map((r: any) => r.role.name);

        await tx.userRole.deleteMany({ where: { userId: id } });
        await tx.userRole.createMany({
          data: data.roleIds.map((roleId) => ({
            roleId,
            userId: id,
            createdBy: actorUserId,
          })),
          skipDuplicates: true,
        });
      }

      return tx.user.update({
        where: { id },
        data: {
          email: data.email?.toLowerCase(),
          username: data.username,
          forcePasswordChange: data.forcePasswordChange,
          passwordExpiryDays: data.passwordExpiryDays,
          twoFactorAuth: data.twoFactorAuth,
          reportingManagerId: data.reportingManagerId,
          zone: data.zone,
          region: data.region,
          area: data.area,
          territory: data.territory,
          distributorId: data.distributorId,
          updatedBy: actorUserId,
          profile: {
            upsert: {
              create: {
                userCode: data.userCode ?? null,
                employeeCode: data.employeeCode ?? null,
                firstName:
                  data.firstName?.trim() ?? existing.profile?.firstName ?? '',
                middleName:
                  data.middleName?.trim() ??
                  existing.profile?.middleName ??
                  null,
                lastName:
                  data.lastName?.trim() ?? existing.profile?.lastName ?? '',
                displayName: data.displayName ?? null,
                fullName: fullName ?? '',
                gender: data.gender ?? null,
                dob: data.dob ? new Date(data.dob) : null,
                mobile: data.mobile ?? null,
                alternateMobile: data.alternateMobile ?? null,
                emergencyContact: data.emergencyContact ?? null,
                addressLine1: data.addressLine1 ?? null,
                addressLine2: data.addressLine2 ?? null,
                addressLine3: data.addressLine3 ?? null,
                country: data.country ?? null,
                state: data.state ?? null,
                district: data.district ?? null,
                city: data.city ?? null,
                pincode: data.pincode ?? null,
              },
              update: {
                ...(data.userCode !== undefined
                  ? { userCode: data.userCode }
                  : {}),
                ...(data.employeeCode !== undefined
                  ? { employeeCode: data.employeeCode }
                  : {}),
                ...(data.firstName !== undefined
                  ? { firstName: data.firstName.trim() }
                  : {}),
                ...(data.middleName !== undefined
                  ? { middleName: data.middleName?.trim() }
                  : {}),
                ...(data.lastName !== undefined
                  ? { lastName: data.lastName.trim() }
                  : {}),
                ...(data.displayName !== undefined
                  ? { displayName: data.displayName }
                  : {}),
                ...(fullName ? { fullName } : {}),
                ...(data.gender !== undefined ? { gender: data.gender } : {}),
                ...(data.dob !== undefined ? { dob: new Date(data.dob) } : {}),
                ...(data.mobile !== undefined ? { mobile: data.mobile } : {}),
                ...(data.alternateMobile !== undefined
                  ? { alternateMobile: data.alternateMobile }
                  : {}),
                ...(data.emergencyContact !== undefined
                  ? { emergencyContact: data.emergencyContact }
                  : {}),
                ...(data.addressLine1 !== undefined
                  ? { addressLine1: data.addressLine1 }
                  : {}),
                ...(data.addressLine2 !== undefined
                  ? { addressLine2: data.addressLine2 }
                  : {}),
                ...(data.addressLine3 !== undefined
                  ? { addressLine3: data.addressLine3 }
                  : {}),
                ...(data.country !== undefined
                  ? { country: data.country }
                  : {}),
                ...(data.state !== undefined ? { state: data.state } : {}),
                ...(data.district !== undefined
                  ? { district: data.district }
                  : {}),
                ...(data.city !== undefined ? { city: data.city } : {}),
                ...(data.pincode !== undefined
                  ? { pincode: data.pincode }
                  : {}),
              },
            },
          },
        },
        include: {
          roles: { include: { role: true } },
          profile: true,
          reportingManager: {
            select: {
              id: true,
              profile: { select: { fullName: true } },
              email: true,
            },
          },
        },
      });
    });

    const newValue: Record<string, unknown> = {};
    for (const field of updatableFields) {
      if ((data as any)[field] !== undefined) {
        (newValue as any)[field] = profileFields.has(field)
          ? (result as any).profile?.[field]
          : (result as any)[field];
      }
    }
    if (data.roleIds) {
      newValue.roleIds = (result as any).roles.map((r: any) => r.role.name);
    }

    await this.auditLog.create({
      organizationId,
      actorId: actorUserId,
      action: 'USER_UPDATED',
      entityType: 'user',
      entityId: id,
      oldValue: Object.keys(oldValue).length > 0 ? oldValue : undefined,
      newValue: Object.keys(newValue).length > 0 ? newValue : undefined,
      ipAddress,
    });

    return result;
  }

  async delete(
    organizationId: string,
    id: string,
    actorUserId: string,
    ipAddress?: string,
  ) {
    await this.findById(organizationId, id);
    const result = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: actorUserId },
    });

    await this.auditLog.create({
      organizationId,
      actorId: actorUserId,
      action: 'USER_DELETED',
      entityType: 'user',
      entityId: id,
      newValue: { deletedAt: new Date() },
      ipAddress,
    });

    return result;
  }

  async lock(
    organizationId: string,
    id: string,
    actorUserId: string,
    ipAddress?: string,
  ) {
    const user = await this.findById(organizationId, id);
    if (user.status === 'LOCKED')
      throw new ConflictException('User is already locked');

    const result = await this.prisma.user.update({
      where: { id },
      data: { status: 'LOCKED', updatedBy: actorUserId },
    });

    await this.auditLog.create({
      organizationId,
      actorId: actorUserId,
      action: 'ACCOUNT_LOCKED',
      entityType: 'user',
      entityId: id,
      oldValue: { status: user.status },
      newValue: { status: 'LOCKED' },
      ipAddress,
    });

    return result;
  }

  async unlock(
    organizationId: string,
    id: string,
    actorUserId: string,
    ipAddress?: string,
  ) {
    const user = await this.findById(organizationId, id);
    if (user.status !== 'LOCKED')
      throw new ConflictException('User is not locked');

    const result = await this.prisma.user.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedBy: actorUserId,
      },
    });

    await this.auditLog.create({
      organizationId,
      actorId: actorUserId,
      action: 'ACCOUNT_UNLOCKED',
      entityType: 'user',
      entityId: id,
      oldValue: { status: user.status },
      newValue: { status: 'ACTIVE' },
      ipAddress,
    });

    return result;
  }

  async deactivate(
    organizationId: string,
    id: string,
    actorUserId: string,
    ipAddress?: string,
  ) {
    const user = await this.findById(organizationId, id);
    if (user.status === 'INACTIVE')
      throw new ConflictException('User is already inactive');

    const result = await this.prisma.user.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        deactivatedAt: new Date(),
        deactivatedBy: actorUserId,
        updatedBy: actorUserId,
      },
    });

    await this.auditLog.create({
      organizationId,
      actorId: actorUserId,
      action: 'STATUS_CHANGED',
      entityType: 'user',
      entityId: id,
      oldValue: { status: user.status },
      newValue: { status: 'INACTIVE' },
      ipAddress,
    });

    return result;
  }

  async reactivate(
    organizationId: string,
    id: string,
    actorUserId: string,
    ipAddress?: string,
  ) {
    const user = await this.findById(organizationId, id);
    if (user.status === 'ACTIVE')
      throw new ConflictException('User is already active');

    const result = await this.prisma.user.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        deactivatedAt: null,
        deactivatedBy: null,
        updatedBy: actorUserId,
      },
    });

    await this.auditLog.create({
      organizationId,
      actorId: actorUserId,
      action: 'STATUS_CHANGED',
      entityType: 'user',
      entityId: id,
      oldValue: { status: user.status },
      newValue: { status: 'ACTIVE' },
      ipAddress,
    });

    return result;
  }

  async suspend(
    organizationId: string,
    id: string,
    actorUserId: string,
    ipAddress?: string,
  ) {
    const user = await this.findById(organizationId, id);
    if (user.status === 'SUSPENDED')
      throw new ConflictException('User is already suspended');

    const result = await this.prisma.user.update({
      where: { id },
      data: { status: 'SUSPENDED', updatedBy: actorUserId },
    });

    await this.auditLog.create({
      organizationId,
      actorId: actorUserId,
      action: 'STATUS_CHANGED',
      entityType: 'user',
      entityId: id,
      oldValue: { status: user.status },
      newValue: { status: 'SUSPENDED' },
      ipAddress,
    });

    return result;
  }

  async adminResetPassword(
    organizationId: string,
    id: string,
    actorUserId: string,
    newPassword: string,
    ipAddress?: string,
  ) {
    const user = await this.findById(organizationId, id);
    const passwordHash = await bcrypt.hash(newPassword, 12);

    const result = await this.prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        forcePasswordChange: true,
        updatedBy: actorUserId,
      },
    });

    await this.auditLog.create({
      organizationId,
      actorId: actorUserId,
      action: 'PASSWORD_RESET',
      entityType: 'user',
      entityId: id,
      oldValue: { passwordUpdatedAt: user.updatedAt },
      newValue: { passwordUpdatedAt: result.updatedAt },
      ipAddress,
    });

    return result;
  }

  async getHierarchyTree(organizationId: string) {
    const users = await this.prisma.user.findMany({
      where: { organizationId, deletedAt: null },
      select: {
        id: true,
        email: true,
        reportingManagerId: true,
        status: true,
        profile: { select: { fullName: true } },
        roles: {
          include: {
            role: { select: { name: true, level: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const userMap = new Map(
      users.map((u) => [
        u.id,
        { ...u, fullName: u.profile?.fullName, children: [] as any[] },
      ]),
    );
    const roots: any[] = [];

    for (const user of userMap.values()) {
      if (user.reportingManagerId && userMap.has(user.reportingManagerId)) {
        userMap.get(user.reportingManagerId)!.children.push(user);
      } else {
        roots.push(user);
      }
    }

    return roots;
  }

  async getCreateOptions(organizationId: string) {
    const roles = await this.prisma.role.findMany({
      where: { organizationId, deletedAt: null },
      orderBy: { level: 'asc' },
    });

    const managers = await this.prisma.user.findMany({
      where: { organizationId, deletedAt: null, status: 'ACTIVE' },
      select: {
        id: true,
        profile: { select: { fullName: true } },
        email: true,
      },
    });

    return { roles, managers };
  }

  private async validateCreationRules(
    actorRoleNames: string[],
    targetRoleIds: string[],
  ) {
    const isAdmin = actorRoleNames.includes('Admin');
    const isDistributor = actorRoleNames.includes('Distributor');

    if (isAdmin) return;

    if (isDistributor) {
      const targetRoles = await this.prisma.role.findMany({
        where: { id: { in: targetRoleIds } },
      });
      const targetRoleNames = targetRoles.map((r) => r.name);
      const invalidRoles = targetRoleNames.filter(
        (name) => !DISTRIBUTOR_TEAM_ROLES.includes(name),
      );
      if (invalidRoles.length > 0) {
        throw new ForbiddenException(
          `Distributor can only create: ${DISTRIBUTOR_TEAM_ROLES.join(', ')}. Invalid: ${invalidRoles.join(', ')}`,
        );
      }
      return;
    }

    throw new ForbiddenException('You do not have permission to create users');
  }

  private async validateReportingManager(
    organizationId: string,
    managerId: string,
    targetRoleIds: string[],
  ) {
    const manager = await this.prisma.user.findFirst({
      where: { id: managerId, organizationId, deletedAt: null },
      include: { roles: { include: { role: true } } },
    });
    if (!manager) throw new NotFoundException('Reporting manager not found');

    const targetRoles = await this.prisma.role.findMany({
      where: { id: { in: targetRoleIds } },
    });

    const managerLevel = Math.min(
      ...manager.roles.map((r: any) => r.role.level),
    );
    const targetLevel = Math.min(...targetRoles.map((r) => r.level));

    if (managerLevel >= targetLevel) {
      throw new ForbiddenException(
        'Reporting manager must be at a higher level in the hierarchy',
      );
    }
  }

  private async validateDistributor(
    organizationId: string,
    distributorId: string,
  ) {
    const distributor = await this.prisma.user.findFirst({
      where: { id: distributorId, organizationId, deletedAt: null },
      include: { roles: { include: { role: true } } },
    });
    if (!distributor) throw new NotFoundException('Distributor not found');

    const isDistributor = distributor.roles.some(
      (r: any) => r.role.name === 'Distributor',
    );
    if (!isDistributor) {
      throw new ForbiddenException(
        'Distributor mapping must point to a user with Distributor role',
      );
    }
  }
}
