"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = void 0;
const v4_1 = require("zod/v4");
exports.paginationSchema = v4_1.z.strictObject({
    page: v4_1.z.coerce.number().int().min(1).default(1),
    limit: v4_1.z.coerce.number().int().min(1).max(100).default(10),
});
//# sourceMappingURL=common.js.map