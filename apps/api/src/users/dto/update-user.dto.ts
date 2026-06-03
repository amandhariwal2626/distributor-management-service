import { updateUserSchema } from '@dms/validations';
import type { z } from 'zod/v4';

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
