import { z } from 'zod/v4';
import { paginationSchema } from './common';

export const listAuditLogsSchema = paginationSchema.extend({
  action: z.string().optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  actorId: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
