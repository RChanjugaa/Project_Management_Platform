import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import type { JwtPayload } from "../utils/jwt.js";

export function isAdmin(user: JwtPayload) {
  return user.role === "ADMIN";
}

export function isManager(user: JwtPayload) {
  return user.role === "PROJECT_MANAGER";
}

export function isMember(user: JwtPayload) {
  return user.role === "TEAM_MEMBER";
}

export async function ensureCanManageProject(user: JwtPayload, projectId: number) {
  if (isAdmin(user)) return;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new AppError("Project not found.", 404);
  }

  if (isManager(user) && project.createdById === user.id) return;
  throw new AppError("You are not allowed to manage this project.", 403);
}

export async function ensureCanViewProject(user: JwtPayload, projectId: number) {
  if (isAdmin(user)) return;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true }
  });
  if (!project) {
    throw new AppError("Project not found.", 404);
  }

  if (isManager(user) && project.createdById === user.id) return;
  if (project.members.some((member) => member.userId === user.id)) return;
  throw new AppError("You are not allowed to view this project.", 403);
}

export async function ensureCanAccessTask(user: JwtPayload, taskId: number, manage = false) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { members: true } } }
  });
  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  if (isAdmin(user)) return task;
  if (isManager(user) && task.project.createdById === user.id) return task;
  if (!manage && task.assignedToId === user.id) return task;
  if (!manage && task.project.members.some((member) => member.userId === user.id)) return task;
  throw new AppError("You are not allowed to access this task.", 403);
}
