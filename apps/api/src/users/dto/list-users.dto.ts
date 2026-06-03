import { listUsersSchema } from '@dms/validations';
import type { z } from 'zod/v4';

export type ListUsersDto = z.infer<typeof listUsersSchema>;
