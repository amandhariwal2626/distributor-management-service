import { loginSchema } from '@dms/validations';
import type { z } from 'zod/v4';

export type LoginDto = z.infer<typeof loginSchema>;
