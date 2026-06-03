import { z } from "zod/v4";
export declare const loginSchema: z.ZodObject<{
    organizationCode: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strict>;
export declare const signupSchema: z.ZodObject<{
    organizationCode: z.ZodString;
    email: z.ZodEmail;
    fullName: z.ZodString;
    password: z.ZodString;
}, z.core.$strict>;
export declare const forgotPasswordSchema: z.ZodObject<{
    organizationCode: z.ZodString;
    email: z.ZodEmail;
}, z.core.$strict>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, z.core.$strict>;
export declare const adminResetPasswordSchema: z.ZodObject<{
    password: z.ZodString;
}, z.core.$strict>;
//# sourceMappingURL=auth.d.ts.map