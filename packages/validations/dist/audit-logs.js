"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAuditLogsSchema = void 0;
const v4_1 = require("zod/v4");
const common_1 = require("./common");
exports.listAuditLogsSchema = common_1.paginationSchema.extend({
    action: v4_1.z.string().optional(),
    entityType: v4_1.z.string().optional(),
    entityId: v4_1.z.string().optional(),
    actorId: v4_1.z.string().optional(),
    from: v4_1.z.string().datetime().optional(),
    to: v4_1.z.string().datetime().optional(),
});
//# sourceMappingURL=audit-logs.js.map