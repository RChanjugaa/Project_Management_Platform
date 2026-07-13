import { z } from "zod";

const dateString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date.");

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    projectCode: z.string().trim().min(2).max(20),
    description: z.string().trim().min(5),
    status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]).default("PLANNING"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
    startDate: dateString,
    endDate: dateString
  })
});

export const updateProjectSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: createProjectSchema.shape.body.partial()
});

export const projectIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() })
});

export const assignProjectMembersSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    userIds: z.array(z.coerce.number().int().positive()).min(1)
  })
});
