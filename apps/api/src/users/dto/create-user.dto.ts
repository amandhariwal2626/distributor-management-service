import { createUserSchema, acceptInviteSchema } from '@dms/validations';
import type { z } from 'zod/v4';

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type AcceptInviteDto = z.infer<typeof acceptInviteSchema>;
