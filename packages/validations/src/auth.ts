import { z } from "zod/v4";

export const loginSchema = z.strictObject({
  organizationCode: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export const signupSchema = z.strictObject({
  organizationCode: z.string().min(1),
  email: z.email(),
  fullName: z.string().min(1),
  password: z.string().min(8),
});

export const forgotPasswordSchema = z.strictObject({
  organizationCode: z.string().min(1),
  email: z.email(),
});

export const resetPasswordSchema = z.strictObject({
  token: z.string().min(1),
  password: z.string().min(8),
});

export const adminResetPasswordSchema = z.strictObject({
  password: z.string().min(8),
});
