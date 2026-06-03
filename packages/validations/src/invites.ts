import { z } from "zod/v4";

export const createInviteSchema = z.strictObject({
  email: z.email(),
});

export const acceptInviteSchema = z.strictObject({
  token: z.string().min(1),
  password: z.string().min(8),
});

export const resendInviteSchema = z.strictObject({
  userId: z.string().min(1),
});
