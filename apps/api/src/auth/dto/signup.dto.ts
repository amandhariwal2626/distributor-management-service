import { signupSchema } from '@dms/validations';
import type { z } from 'zod/v4';

export type SignupDto = z.infer<typeof signupSchema>;
