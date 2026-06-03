"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendInviteSchema = exports.acceptInviteSchema = exports.createInviteSchema = void 0;
const v4_1 = require("zod/v4");
exports.createInviteSchema = v4_1.z.strictObject({
    email: v4_1.z.email(),
});
exports.acceptInviteSchema = v4_1.z.strictObject({
    token: v4_1.z.string().min(1),
    password: v4_1.z.string().min(8),
});
exports.resendInviteSchema = v4_1.z.strictObject({
    userId: v4_1.z.string().min(1),
});
//# sourceMappingURL=invites.js.map