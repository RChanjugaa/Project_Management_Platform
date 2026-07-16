import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import type { JwtPayload } from "../utils/jwt.js";

export const isAdmin = (user: JwtPayload) => user.systemRole === "ADMIN";

export async function getProjectMembership(userId: number, projectId: number) {
  return prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
    include: { user: true }
  });
}

export async function ensureCanViewProject(user: JwtPayload, projectId: number) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError("Project not found.", 404);
  if (isAdmin(user)) return project;
  if (await getProjectMembership(user.id, projectId)) return project;
  throw new AppError("You are not allowed to view this project.", 403);
}

export async function ensureCanManageProject(user: JwtPayload, projectId: number) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError("Project not found.", 404);
  if (isAdmin(user)) return project;
  const membership = await getProjectMembership(user.id, projectId);
  if (membership?.projectRole === "PROJECT_LEADER") return project;
  throw new AppError("Project Leader permission is required for this project.", 403);
}

export async function ensureCanAccessTask(user: JwtPayload, taskId: number) {
  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
  if (!task) throw new AppError("Task not found.", 404);
  if (isAdmin(user)) return task;
  if (await getProjectMembership(user.id, task.projectId)) return task;
  throw new AppError("You are not allowed to access this task.", 403);
}

export async function ensureCanManageTask(user: JwtPayload, taskId: number) {
  const task = await ensureCanAccessTask(user, taskId);
  if (isAdmin(user)) return task;
  const membership = await getProjectMembership(user.id, task.projectId);
  if (membership?.projectRole === "PROJECT_LEADER") return task;
  throw new AppError("Project Leader permission is required to manage this task.", 403);
}

export async function ensureCanUpdateTaskProgress(user: JwtPayload, taskId: number) {
  const task = await ensureCanAccessTask(user, taskId);
  if (isAdmin(user)) return task;
  const membership = await getProjectMembership(user.id, task.projectId);
  if (membership?.projectRole === "PROJECT_LEADER" || task.assignedToId === user.id) return task;
  throw new AppError("Only the assignee or a Project Leader can update this task.", 403);
}
