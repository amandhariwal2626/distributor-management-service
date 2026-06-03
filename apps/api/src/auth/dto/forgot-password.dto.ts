import { forgotPasswordSchema } from '@dms/validations';
import type { z } from 'zod/v4';

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
