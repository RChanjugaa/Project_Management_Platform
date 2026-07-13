import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/response.js";

export const adminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const [users, projects, tasks, completedTasks] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: "COMPLETED" } })
  ]);
  sendSuccess(res, "Administrator dashboard loaded.", { role: "ADMIN", statistics: { users, projects, tasks, completedTasks } });
});

export const managerDashboard = asyncHandler(async (req: Request, res: Response) => {
  const [projects, tasks, completedTasks] = await Promise.all([
    prisma.project.count({ where: { createdById: req.user!.id } }),
    prisma.task.count({ where: { project: { createdById: req.user!.id } } }),
    prisma.task.count({ where: { project: { createdById: req.user!.id }, status: "COMPLETED" } })
  ]);
  sendSuccess(res, "Project manager dashboard loaded.", { role: "PROJECT_MANAGER", statistics: { projects, tasks, completedTasks } });
});

export const memberDashboard = asyncHandler(async (req: Request, res: Response) => {
  const [projects, tasks, completedTasks] = await Promise.all([
    prisma.project.count({ where: { members: { some: { userId: req.user!.id } } } }),
    prisma.task.count({ where: { assignedToId: req.user!.id } }),
    prisma.task.count({ where: { assignedToId: req.user!.id, status: "COMPLETED" } })
  ]);
  sendSuccess(res, "Team member dashboard loaded.", { role: "TEAM_MEMBER", statistics: { projects, tasks, completedTasks } });
});
