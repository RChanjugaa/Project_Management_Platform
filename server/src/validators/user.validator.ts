import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    password: z.string().min(8),
    systemRole: z.enum(["ADMIN", "USER"]),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE")
  })
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    name: z.string().trim().min(2).optional(),
    email: z.string().trim().email().optional(),
    password: z.string().min(8).optional(),
    systemRole: z.enum(["ADMIN", "USER"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional()
  })
});

export const updateProfileSchema = z.object({ body: z.object({ name: z.string().trim().min(2).optional(), avatarUrl: z.string().url().nullable().optional() }) });
export const changePasswordSchema = z.object({ body: z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8) }) });

export const userIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() })
});
