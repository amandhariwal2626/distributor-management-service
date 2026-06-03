"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminResetPasswordSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.signupSchema = exports.loginSchema = void 0;
const v4_1 = require("zod/v4");
exports.loginSchema = v4_1.z.strictObject({
    organizationCode: v4_1.z.string().min(1),
    email: v4_1.z.email(),
    password: v4_1.z.string().min(8),
});
exports.signupSchema = v4_1.z.strictObject({
    organizationCode: v4_1.z.string().min(1),
    email: v4_1.z.email(),
    fullName: v4_1.z.string().min(1),
    password: v4_1.z.string().min(8),
});
exports.forgotPasswordSchema = v4_1.z.strictObject({
    organizationCode: v4_1.z.string().min(1),
    email: v4_1.z.email(),
});
exports.resetPasswordSchema = v4_1.z.strictObject({
    token: v4_1.z.string().min(1),
    password: v4_1.z.string().min(8),
});
exports.adminResetPasswordSchema = v4_1.z.strictObject({
    password: v4_1.z.string().min(8),
});
//# sourceMappingURL=auth.js.map