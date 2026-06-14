export interface AuditLogEntry {
  entityType: string;
  entityId: string;
  action: string;
  field?: string;
  oldValue?: unknown;
  newValue?: unknown;
  reason?: string;
  actorId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditChangeRecord {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}
