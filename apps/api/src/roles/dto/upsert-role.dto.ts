import { createRoleSchema, updateRoleSchema } from '@dms/validations';
import type { z } from 'zod/v4';

export type CreateRoleDto = z.infer<typeof createRoleSchema>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
