import { z } from "zod/v4";
import { paginationSchema } from "./common";

const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
const userStatusEnum = z.enum(["ACTIVE", "INACTIVE", "LOCKED", "SUSPENDED"]);

const baseAddressFields = {
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  addressLine3: z.string().max(255).optional(),
  country: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  pincode: z.string().max(10).optional(),
} as const;

export const createUserSchema = z.strictObject({
  userCode: z.string().max(50).optional(),
  employeeCode: z.string().max(50).optional(),
  firstName: z.string().min(1).max(50),
  middleName: z.string().max(50).optional(),
  lastName: z.string().min(1).max(50),
  displayName: z.string().max(100).optional(),
  email: z.email(),
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .max(50)
    .optional(),
  password: z.string().min(8).optional(),
  gender: genderEnum.optional(),
  dob: z.string().datetime().optional(),
  mobile: z.string().max(15).optional(),
  alternateMobile: z.string().max(15).optional(),
  emergencyContact: z.string().max(100).optional(),
  ...baseAddressFields,
  roleIds: z.array(z.uuid()),
  reportingManagerId: z.uuid().optional(),
  zone: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  area: z.string().max(100).optional(),
  territory: z.string().max(100).optional(),
  distributorId: z.uuid().optional(),
  forcePasswordChange: z.boolean().optional(),
  passwordExpiryDays: z.number().int().optional(),
  twoFactorAuth: z.boolean().optional(),
  permissionOverrides: z.array(z.string()).optional(),
});

export const updateUserSchema = z.strictObject({
  userCode: z.string().max(50).optional(),
  employeeCode: z.string().max(50).optional(),
  firstName: z.string().min(1).max(50).optional(),
  middleName: z.string().max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  displayName: z.string().max(100).optional(),
  email: z.email().optional(),
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .max(50)
    .optional(),
  gender: genderEnum.optional(),
  dob: z.string().datetime().optional(),
  mobile: z.string().max(15).optional(),
  alternateMobile: z.string().max(15).optional(),
  emergencyContact: z.string().max(100).optional(),
  ...baseAddressFields,
  roleIds: z.array(z.uuid()).optional(),
  reportingManagerId: z.uuid().nullable().optional(),
  zone: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  area: z.string().max(100).optional(),
  territory: z.string().max(100).optional(),
  distributorId: z.uuid().nullable().optional(),
  forcePasswordChange: z.boolean().optional(),
  passwordExpiryDays: z.number().int().optional(),
  twoFactorAuth: z.boolean().optional(),
  permissionOverrides: z.array(z.string()).optional(),
});

const sortByEnum = z.enum([
  "fullName",
  "email",
  "createdAt",
  "firstName",
  "lastName",
  "userCode",
  "status",
  "lastLoginAt",
]);
const sortOrderEnum = z.enum(["asc", "desc"]);

export const listUsersSchema = paginationSchema.extend({
  search: z.string().optional(),
  roleId: z.string().optional(),
  status: userStatusEnum.optional(),
  sortBy: sortByEnum.default("createdAt"),
  sortOrder: sortOrderEnum.default("desc"),
});
