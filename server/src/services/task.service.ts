import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import type { JwtPayload } from "../utils/jwt.js";
import { ensureCanAccessTask, ensureCanManageProject, ensureCanViewProject, isAdmin, isManager } from "./rbac.service.js";

const includeTask = {
  project: true,
  createdBy: { include: { role: true } },
  assignedTo: { include: { role: true } },
  comments: { include: { user: { include: { role: true } } }, orderBy: { createdAt: "desc" as const } }
};

export async function listTasks(user: JwtPayload) {
  const where = isAdmin(user)
    ? {}
    : isManager(user)
      ? { OR: [{ createdById: user.id }, { project: { createdById: user.id } }, { assignedToId: user.id }] }
      : { assignedToId: user.id };

  return prisma.task.findMany({
    where,
    include: includeTask,
    orderBy: { dueDate: "asc" }
  });
}

export async function createTask(user: JwtPayload, input: {
  projectId: number;
  assignedToId?: number | null;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  progress: number;
  dueDate: string;
}) {
  await ensureCanManageProject(user, input.projectId);

  if (input.assignedToId) {
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: input.projectId, userId: input.assignedToId } }
    });
    if (!member) throw new AppError("Assigned user must be a project member.", 400);
  }

  return prisma.task.create({
    data: {
      ...input,
      assignedToId: input.assignedToId ?? null,
      createdById: user.id,
      dueDate: new Date(input.dueDate),
      completedAt: input.status === "COMPLETED" ? new Date() : null
    },
    include: includeTask
  });
}

export async function updateTask(user: JwtPayload, id: number, input: Partial<{
  assignedToId: number | null;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  progress: number;
  dueDate: string;
}>) {
  const existing = await ensureCanAccessTask(user, id, true);
  if (input.assignedToId) {
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: existing.projectId, userId: input.assignedToId } }
    });
    if (!member) throw new AppError("Assigned user must be a project member.", 400);
  }

  return prisma.task.update({
    where: { id },
    data: {
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      completedAt: input.status === "COMPLETED" ? new Date() : input.status ? null : undefined
    },
    include: includeTask
  });
}

export async function updateTaskProgress(user: JwtPayload, id: number, input: { status?: "TO_DO" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED"; progress: number }) {
  await ensureCanAccessTask(user, id, false);
  return prisma.task.update({
    where: { id },
    data: {
      status: input.status,
      progress: input.progress,
      completedAt: input.status === "COMPLETED" || input.progress === 100 ? new Date() : null
    },
    include: includeTask
  });
}

export async function deleteTask(user: JwtPayload, id: number) {
  await ensureCanAccessTask(user, id, true);
  await prisma.task.delete({ where: { id } });
}

export async function createComment(user: JwtPayload, taskId: number, content: string) {
  const task = await ensureCanAccessTask(user, taskId, false);
  await ensureCanViewProject(user, task.projectId);
  return prisma.taskComment.create({
    data: { taskId, userId: user.id, content },
    include: { user: { include: { role: true } } }
  });
}
