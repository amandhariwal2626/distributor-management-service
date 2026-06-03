import { resetPasswordSchema } from '@dms/validations';
import type { z } from 'zod/v4';

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
