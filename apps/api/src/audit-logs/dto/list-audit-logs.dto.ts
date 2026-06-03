import { listAuditLogsSchema } from '@dms/validations';
import type { z } from 'zod/v4';

export type ListAuditLogsDto = z.infer<typeof listAuditLogsSchema>;
