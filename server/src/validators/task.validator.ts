import { z } from "zod";

const dateString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date.");

export const createTaskSchema = z.object({
  body: z.object({
    projectId: z.coerce.number().int().positive(),
    assignedToId: z.coerce.number().int().positive().optional().nullable(),
    title: z.string().trim().min(2),
    description: z.string().trim().min(5),
    status: z.enum(["TO_DO", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED"]).default("TO_DO"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
    progress: z.coerce.number().int().min(0).max(100).default(0),
    dueDate: dateString
  })
});

export const updateTaskSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: createTaskSchema.shape.body.omit({ projectId: true }).partial()
});

export const taskIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() })
});

export const updateTaskProgressSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    status: z.enum(["TO_DO", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED"]).optional(),
    progress: z.coerce.number().int().min(0).max(100)
  })
});

export const createTaskCommentSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    content: z.string().trim().min(2)
  })
});
