"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleSchema = exports.createRoleSchema = void 0;
const v4_1 = require("zod/v4");
exports.createRoleSchema = v4_1.z.strictObject({
    name: v4_1.z.string().min(1),
    description: v4_1.z.string().optional(),
    permissions: v4_1.z.array(v4_1.z.string()),
});
exports.updateRoleSchema = v4_1.z.strictObject({
    name: v4_1.z.string().min(1).optional(),
    description: v4_1.z.string().optional(),
    permissions: v4_1.z.array(v4_1.z.string()).optional(),
});
//# sourceMappingURL=roles.js.map