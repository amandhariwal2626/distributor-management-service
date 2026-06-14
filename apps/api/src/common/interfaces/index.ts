export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  search?: string;
  searchFields?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path?: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: string[];
  timestamp: string;
  path?: string;
}

export interface UserContext {
  userId: string;
  organizationId: string;
  email: string;
  roles: string[];
  permissions: string[];
  sessionId: string;
}

export interface AuditEntry {
  entityType: string;
  entityId: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  actorId?: string;
  ipAddress?: string;
}

export interface FileUploadResult {
  filePath: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  thumbnailUrl?: string;
}

export interface BulkOperationResult {
  successCount: number;
  failureCount: number;
  errors: Array<{ row: number; message: string }>;
}
