import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    password: z.string().min(8),
    roleId: z.coerce.number().int().positive(),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE")
  })
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    name: z.string().trim().min(2).optional(),
    email: z.string().trim().email().optional(),
    password: z.string().min(8).optional(),
    roleId: z.coerce.number().int().positive().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional()
  })
});

export const userIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() })
});
