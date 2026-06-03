"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const v4_1 = require("zod/v4");
const common_1 = require("./common");
const genderEnum = v4_1.z.enum(["MALE", "FEMALE", "OTHER"]);
const userStatusEnum = v4_1.z.enum(["ACTIVE", "INACTIVE", "LOCKED", "SUSPENDED"]);
const baseAddressFields = {
    addressLine1: v4_1.z.string().max(255).optional(),
    addressLine2: v4_1.z.string().max(255).optional(),
    addressLine3: v4_1.z.string().max(255).optional(),
    country: v4_1.z.string().max(100).optional(),
    state: v4_1.z.string().max(100).optional(),
    district: v4_1.z.string().max(100).optional(),
    city: v4_1.z.string().max(100).optional(),
    pincode: v4_1.z.string().max(10).optional(),
};
exports.createUserSchema = v4_1.z.strictObject({
    userCode: v4_1.z.string().max(50).optional(),
    employeeCode: v4_1.z.string().max(50).optional(),
    firstName: v4_1.z.string().min(1).max(50),
    middleName: v4_1.z.string().max(50).optional(),
    lastName: v4_1.z.string().min(1).max(50),
    displayName: v4_1.z.string().max(100).optional(),
    email: v4_1.z.email(),
    username: v4_1.z
        .string()
        .regex(/^[a-zA-Z0-9_]+$/)
        .max(50)
        .optional(),
    password: v4_1.z.string().min(8).optional(),
    gender: genderEnum.optional(),
    dob: v4_1.z.string().datetime().optional(),
    mobile: v4_1.z.string().max(15).optional(),
    alternateMobile: v4_1.z.string().max(15).optional(),
    emergencyContact: v4_1.z.string().max(100).optional(),
    ...baseAddressFields,
    roleIds: v4_1.z.array(v4_1.z.uuid()),
    reportingManagerId: v4_1.z.uuid().optional(),
    zone: v4_1.z.string().max(100).optional(),
    region: v4_1.z.string().max(100).optional(),
    area: v4_1.z.string().max(100).optional(),
    territory: v4_1.z.string().max(100).optional(),
    distributorId: v4_1.z.uuid().optional(),
    forcePasswordChange: v4_1.z.boolean().optional(),
    passwordExpiryDays: v4_1.z.number().int().optional(),
    twoFactorAuth: v4_1.z.boolean().optional(),
    permissionOverrides: v4_1.z.array(v4_1.z.string()).optional(),
});
exports.updateUserSchema = v4_1.z.strictObject({
    userCode: v4_1.z.string().max(50).optional(),
    employeeCode: v4_1.z.string().max(50).optional(),
    firstName: v4_1.z.string().min(1).max(50).optional(),
    middleName: v4_1.z.string().max(50).optional(),
    lastName: v4_1.z.string().min(1).max(50).optional(),
    displayName: v4_1.z.string().max(100).optional(),
    email: v4_1.z.email().optional(),
    username: v4_1.z
        .string()
        .regex(/^[a-zA-Z0-9_]+$/)
        .max(50)
        .optional(),
    gender: genderEnum.optional(),
    dob: v4_1.z.string().datetime().optional(),
    mobile: v4_1.z.string().max(15).optional(),
    alternateMobile: v4_1.z.string().max(15).optional(),
    emergencyContact: v4_1.z.string().max(100).optional(),
    ...baseAddressFields,
    roleIds: v4_1.z.array(v4_1.z.uuid()).optional(),
    reportingManagerId: v4_1.z.uuid().nullable().optional(),
    zone: v4_1.z.string().max(100).optional(),
    region: v4_1.z.string().max(100).optional(),
    area: v4_1.z.string().max(100).optional(),
    territory: v4_1.z.string().max(100).optional(),
    distributorId: v4_1.z.uuid().nullable().optional(),
    forcePasswordChange: v4_1.z.boolean().optional(),
    passwordExpiryDays: v4_1.z.number().int().optional(),
    twoFactorAuth: v4_1.z.boolean().optional(),
    permissionOverrides: v4_1.z.array(v4_1.z.string()).optional(),
});
const sortByEnum = v4_1.z.enum([
    "fullName",
    "email",
    "createdAt",
    "firstName",
    "lastName",
    "userCode",
    "status",
    "lastLoginAt",
]);
const sortOrderEnum = v4_1.z.enum(["asc", "desc"]);
exports.listUsersSchema = common_1.paginationSchema.extend({
    search: v4_1.z.string().optional(),
    roleId: v4_1.z.string().optional(),
    status: userStatusEnum.optional(),
    sortBy: sortByEnum.default("createdAt"),
    sortOrder: sortOrderEnum.default("desc"),
});
//# sourceMappingURL=users.js.map