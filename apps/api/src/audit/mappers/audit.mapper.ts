import { AuditLog } from '@prisma/client';
import { AuditLogEntry } from '../interfaces/audit.interface';

export class AuditMapper {
  static toEntry(auditLog: AuditLog): AuditLogEntry {
    return {
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      action: auditLog.action,
      field: auditLog.field ?? undefined,
      oldValue: auditLog.oldValue ?? undefined,
      newValue: auditLog.newValue ?? undefined,
      reason: auditLog.reason ?? undefined,
      actorId: auditLog.actorId ?? undefined,
      ipAddress: auditLog.ipAddress ?? undefined,
      userAgent: auditLog.userAgent ?? undefined,
    };
  }

  static toEntries(auditLogs: AuditLog[]): AuditLogEntry[] {
    return auditLogs.map((log) => AuditMapper.toEntry(log));
  }

  static fromEntry(
    entry: AuditLogEntry,
    companyId: string,
  ): AuditLogEntry & { companyId: string } {
    return {
      ...entry,
      companyId,
    };
  }
}
