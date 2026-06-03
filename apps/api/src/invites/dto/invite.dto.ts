import {
  createInviteSchema,
  acceptInviteSchema,
  resendInviteSchema,
} from '@dms/validations';
import type { z } from 'zod/v4';

export type CreateInviteDto = z.infer<typeof createInviteSchema>;
export type AcceptInviteDto = z.infer<typeof acceptInviteSchema>;
export type ResendInviteDto = z.infer<typeof resendInviteSchema>;
