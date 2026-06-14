import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuditService', () => {
  let service: AuditService;
  const mockPrisma = {
    auditLog: {
      create: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockCompanyId = 'org-1';
  const mockActorId = 'user-123';
  const mockIpAddress = '127.0.0.1';

  const mockAuditLog = {
    id: 'audit-1',
    companyId: mockCompanyId,
    entityType: 'ProductMaster',
    entityId: 'entity-1',
    action: 'PRODUCT_CREATED',
    field: null,
    oldValue: null,
    newValue: '{"name":"Test Product"}',
    reason: null,
    actorId: mockActorId,
    ipAddress: mockIpAddress,
    userAgent: null,
    createdAt: new Date(),
    actor: {
      id: mockActorId,
      email: 'test@example.com',
      profile: { fullName: 'Test User' },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── log ─────────────────────────────────────────────────────────

  describe('log', () => {
    it('should create a single audit log entry', async () => {
      mockPrisma.auditLog.create.mockResolvedValue(mockAuditLog);

      const entry = {
        companyId: mockCompanyId,
        entityType: 'ProductMaster',
        entityId: 'entity-1',
        action: 'PRODUCT_CREATED',
        newValue: '{"name":"Test Product"}',
        actorId: mockActorId,
        ipAddress: mockIpAddress,
      };

      await service.log(entry);

      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
        data: {
          companyId: mockCompanyId,
          entityType: 'ProductMaster',
          entityId: 'entity-1',
          action: 'PRODUCT_CREATED',
          field: null,
          oldValue: null,
          newValue: '{"name":"Test Product"}',
          reason: null,
          actorId: mockActorId,
          ipAddress: mockIpAddress,
          userAgent: null,
        },
      });
    });

    it('should handle optional fields', async () => {
      mockPrisma.auditLog.create.mockResolvedValue(mockAuditLog);

      await service.log({
        companyId: mockCompanyId,
        entityType: 'WorkflowInstance',
        entityId: 'wf-1',
        action: 'WORKFLOW_APPROVED',
        reason: 'Approved by manager',
        actorId: mockActorId,
      });

      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          reason: 'Approved by manager',
          ipAddress: null,
          userAgent: null,
          field: null,
          oldValue: null,
          newValue: null,
        }),
      });
    });
  });

  // ── logMany ─────────────────────────────────────────────────────

  describe('logMany', () => {
    it('should create multiple audit log entries', async () => {
      mockPrisma.auditLog.createMany.mockResolvedValue({ count: 2 });

      const entries = [
        {
          companyId: mockCompanyId,
          entityType: 'ProductMaster',
          entityId: 'entity-1',
          action: 'PRODUCT_UPDATED',
          field: 'name',
          oldValue: 'Old Name',
          newValue: 'New Name',
          actorId: mockActorId,
        },
        {
          companyId: mockCompanyId,
          entityType: 'ProductMaster',
          entityId: 'entity-1',
          action: 'PRODUCT_UPDATED',
          field: 'price',
          oldValue: '100',
          newValue: '200',
          actorId: mockActorId,
        },
      ];

      await service.logMany(entries);

      expect(mockPrisma.auditLog.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ field: 'name' }),
          expect.objectContaining({ field: 'price' }),
        ]),
      });
    });

    it('should not call createMany when entries array is empty', async () => {
      await service.logMany([]);

      expect(mockPrisma.auditLog.createMany).not.toHaveBeenCalled();
    });
  });

  // ── logChanges ──────────────────────────────────────────────────

  describe('logChanges', () => {
    it('should create audit entries for each changed field', async () => {
      mockPrisma.auditLog.createMany.mockResolvedValue({ count: 2 });

      const changes = [
        { field: 'name', oldValue: 'Old Name', newValue: 'New Name' },
        { field: 'price', oldValue: 100, newValue: 200 },
      ];

      await service.logChanges(
        mockCompanyId,
        'ProductMaster',
        'entity-1',
        'PRODUCT_UPDATED',
        changes,
        { actorId: mockActorId, ipAddress: mockIpAddress },
      );

      expect(mockPrisma.auditLog.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            companyId: mockCompanyId,
            entityType: 'ProductMaster',
            entityId: 'entity-1',
            action: 'PRODUCT_UPDATED',
            field: 'name',
            oldValue: 'Old Name',
            newValue: 'New Name',
            actorId: mockActorId,
            ipAddress: mockIpAddress,
          }),
          expect.objectContaining({
            field: 'price',
            oldValue: '100',
            newValue: '200',
          }),
        ],
      });
    });

    it('should not create entries when changes array is empty', async () => {
      await service.logChanges(
        mockCompanyId,
        'ProductMaster',
        'entity-1',
        'PRODUCT_UPDATED',
        [],
        { actorId: mockActorId },
      );

      expect(mockPrisma.auditLog.createMany).not.toHaveBeenCalled();
    });

    it('should handle null oldValue and newValue', async () => {
      mockPrisma.auditLog.createMany.mockResolvedValue({ count: 1 });

      await service.logChanges(
        mockCompanyId,
        'ProductMaster',
        'entity-1',
        'PRODUCT_UPDATED',
        [{ field: 'description', oldValue: null, newValue: 'New description' }],
        { actorId: mockActorId },
      );

      expect(mockPrisma.auditLog.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            field: 'description',
            oldValue: null,
            newValue: 'New description',
          }),
        ],
      });
    });

    it('should convert values to strings', async () => {
      mockPrisma.auditLog.createMany.mockResolvedValue({ count: 1 });

      await service.logChanges(
        mockCompanyId,
        'ProductMaster',
        'entity-1',
        'PRODUCT_STATUS_CHANGED',
        [{ field: 'status', oldValue: 'DRAFT', newValue: 'ACTIVE' }],
        { actorId: mockActorId, reason: 'Status update' },
      );

      expect(mockPrisma.auditLog.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            reason: 'Status update',
            oldValue: 'DRAFT',
            newValue: 'ACTIVE',
          }),
        ],
      });
    });
  });

  // ── findAll ─────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return paginated audit logs with actor include', async () => {
      mockPrisma.$transaction.mockResolvedValue([[mockAuditLog], 1]);

      const result = await service.findAll(mockCompanyId, {
        page: 1,
        limit: 20,
      });

      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
      expect(result.data[0].actorId).toBeDefined();
    });

    it('should filter by entityType', async () => {
      mockPrisma.$transaction.mockResolvedValue([[mockAuditLog], 1]);

      await service.findAll(mockCompanyId, {
        page: 1,
        limit: 20,
        entityType: 'ProductMaster',
      });

      const findManyArgs = mockPrisma.$transaction.mock.calls[0][0];
      expect(findManyArgs.where.entityType).toBe('ProductMaster');
    });

    it('should filter by entityId', async () => {
      mockPrisma.$transaction.mockResolvedValue([[mockAuditLog], 1]);

      await service.findAll(mockCompanyId, {
        page: 1,
        limit: 20,
        entityId: 'entity-1',
      });

      const findManyArgs = mockPrisma.$transaction.mock.calls[0][0];
      expect(findManyArgs.where.entityId).toBe('entity-1');
    });

    it('should filter by action', async () => {
      mockPrisma.$transaction.mockResolvedValue([[mockAuditLog], 1]);

      await service.findAll(mockCompanyId, {
        page: 1,
        limit: 20,
        action: 'PRODUCT_CREATED',
      });

      const findManyArgs = mockPrisma.$transaction.mock.calls[0][0];
      expect(findManyArgs.where.action).toBe('PRODUCT_CREATED');
    });

    it('should filter by actorId', async () => {
      mockPrisma.$transaction.mockResolvedValue([[mockAuditLog], 1]);

      await service.findAll(mockCompanyId, {
        page: 1,
        limit: 20,
        actorId: mockActorId,
      });

      const findManyArgs = mockPrisma.$transaction.mock.calls[0][0];
      expect(findManyArgs.where.actorId).toBe(mockActorId);
    });

    it('should filter by date range', async () => {
      mockPrisma.$transaction.mockResolvedValue([[mockAuditLog], 1]);

      await service.findAll(mockCompanyId, {
        page: 1,
        limit: 20,
        fromDate: '2025-01-01',
        toDate: '2025-12-31',
      });

      const findManyArgs = mockPrisma.$transaction.mock.calls[0][0];
      expect(findManyArgs.where.createdAt).toBeDefined();
      expect(findManyArgs.where.createdAt.gte).toBeDefined();
      expect(findManyArgs.where.createdAt.lte).toBeDefined();
    });

    it('should apply custom page and limit', async () => {
      mockPrisma.$transaction.mockResolvedValue([[mockAuditLog], 50]);

      const result = await service.findAll(mockCompanyId, {
        page: 2,
        limit: 10,
      });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(5);
    });

    it('should order by createdAt desc', async () => {
      mockPrisma.$transaction.mockResolvedValue([[mockAuditLog], 1]);

      await service.findAll(mockCompanyId, { page: 1, limit: 20 });

      const findManyArgs = mockPrisma.$transaction.mock.calls[0][0];
      expect(findManyArgs.orderBy).toEqual({ createdAt: 'desc' });
    });
  });

  // ── findByEntity ────────────────────────────────────────────────

  describe('findByEntity', () => {
    it('should return audit logs for a specific entity', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([mockAuditLog]);

      const result = await service.findByEntity(
        mockCompanyId,
        'ProductMaster',
        'entity-1',
      );

      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith({
        where: {
          companyId: mockCompanyId,
          entityType: 'ProductMaster',
          entityId: 'entity-1',
        },
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              email: true,
              profile: { select: { fullName: true } },
            },
          },
        },
      });
      expect(result).toEqual([mockAuditLog]);
    });

    it('should return empty array when no logs found', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([]);

      const result = await service.findByEntity(
        mockCompanyId,
        'NonExistent',
        'nonexistent',
      );

      expect(result).toEqual([]);
    });
  });
});
