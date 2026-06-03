import { z } from "zod/v4";
export declare const createInviteSchema: z.ZodObject<{
    email: z.ZodEmail;
}, z.core.$strict>;
export declare const acceptInviteSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, z.core.$strict>;
export declare const resendInviteSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strict>;
//# sourceMappingURL=invites.d.ts.map