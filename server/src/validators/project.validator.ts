import { z } from "zod";

const dateString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date.");

const projectBody = z.object({
    name: z.string().trim().min(2),
    projectCode: z.string().trim().min(2).max(20).optional(),
    description: z.string().trim().min(5),
    status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]).default("PLANNING"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
    startDate: dateString,
    endDate: dateString
  }).refine((data) => new Date(data.endDate) >= new Date(data.startDate), { message: "End date must be on or after start date.", path: ["endDate"] });

export const createProjectSchema = z.object({
  body: projectBody
});

export const updateProjectSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({ name: z.string().trim().min(2).optional(), projectCode: z.string().trim().min(2).max(20).optional(), description: z.string().trim().min(5).optional(), status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]).optional(), priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(), startDate: dateString.optional(), endDate: dateString.optional() })
});

export const projectIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() })
});

export const addProjectMemberSchema = z.object({ params: z.object({ id: z.coerce.number().int().positive() }), body: z.object({ userId: z.coerce.number().int().positive(), projectRole: z.enum(["PROJECT_LEADER", "TEAM_MEMBER"]) }) });
export const updateProjectMemberSchema = z.object({ params: z.object({ id: z.coerce.number().int().positive(), userId: z.coerce.number().int().positive() }), body: z.object({ projectRole: z.enum(["PROJECT_LEADER", "TEAM_MEMBER"]) }) });
export const projectMemberIdSchema = z.object({ params: z.object({ id: z.coerce.number().int().positive(), userId: z.coerce.number().int().positive() }) });
