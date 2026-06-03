import { z } from "zod/v4";

export const createRoleSchema = z.strictObject({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

export const updateRoleSchema = z.strictObject({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});
