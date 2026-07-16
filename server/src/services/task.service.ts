import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import type { JwtPayload } from "../utils/jwt.js";
import { ensureCanAccessTask, ensureCanManageProject, ensureCanManageTask, ensureCanUpdateTaskProgress, isAdmin } from "./rbac.service.js";
import { recordActivity } from "./activity.service.js";
import { notify } from "./notification.service.js";

const includeTask = {
  project: true,
  createdBy: { select: { id: true, name: true, email: true, systemRole: true, status: true } },
  assignedTo: { select: { id: true, name: true, email: true, systemRole: true, status: true } },
  comments: { include: { user: { select: { id: true, name: true, email: true, systemRole: true, status: true } } }, orderBy: { createdAt: "desc" as const } }
};

export async function listTasks(user: JwtPayload) {
  const where = isAdmin(user) ? {} : { project: { members: { some: { userId: user.id } } } };

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

  const task = await prisma.task.create({
    data: {
      ...input,
      assignedToId: input.assignedToId ?? null,
      createdById: user.id,
      dueDate: new Date(input.dueDate),
      completedAt: input.status === "COMPLETED" ? new Date() : null
    },
    include: includeTask
  });
  await recordActivity(user.id, "TASK_CREATED", "TASK", task.id, { projectId: task.projectId, assignedToId: task.assignedToId });
  const projectMembers = await prisma.projectMember.findMany({ where: { projectId: task.projectId }, select: { userId: true } });
  await Promise.all(projectMembers.filter((member) => member.userId !== user.id).map((member) => {
    if (member.userId === task.assignedToId) return notify(member.userId, "Task assigned to you", `${task.title} was assigned to you.`, "TASK_ASSIGNED", "TASK", task.id);
    return notify(member.userId, "New project task", `${task.title} was added to ${task.project.name}.`, "TASK_UPDATED", "TASK", task.id);
  }));
  return task;
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
  const existing = await ensureCanManageTask(user, id);
  if (input.assignedToId) {
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: existing.projectId, userId: input.assignedToId } }
    });
    if (!member) throw new AppError("Assigned user must be a project member.", 400);
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      completedAt: input.status === "COMPLETED" ? new Date() : input.status ? null : undefined
    },
    include: includeTask
  });
  await recordActivity(user.id, "TASK_UPDATED", "TASK", id, { assignedToId: task.assignedToId, status: task.status, progress: task.progress });
  if (input.assignedToId) await notify(input.assignedToId, "Task assigned", task.title, "TASK_ASSIGNED", "TASK", task.id);
  return task;
}

export async function updateTaskProgress(user: JwtPayload, id: number, input: { status?: "TO_DO" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED"; progress: number }) {
  await ensureCanUpdateTaskProgress(user, id);
  const status = input.progress === 100 ? "COMPLETED" : input.status;
  const progress = status === "COMPLETED" ? 100 : input.progress;
  const task = await prisma.task.update({
    where: { id },
    data: {
      status,
      progress,
      completedAt: status === "COMPLETED" ? new Date() : null
    },
    include: includeTask
  });
  await recordActivity(user.id, "TASK_PROGRESS_UPDATED", "TASK", id, { status: task.status, progress: task.progress });
  if (task.assignedToId && task.assignedToId !== user.id) await notify(task.assignedToId, "Task updated", task.title, "TASK_UPDATED", "TASK", task.id);
  return task;
}

export async function deleteTask(user: JwtPayload, id: number) {
  await ensureCanManageTask(user, id);
  await prisma.task.delete({ where: { id } });
}

export async function createComment(user: JwtPayload, taskId: number, content: string) {
  const task = await ensureCanAccessTask(user, taskId);
  const comment = await prisma.taskComment.create({
    data: { taskId, userId: user.id, content },
    include: { user: { select: { id: true, name: true, email: true, systemRole: true, status: true } } }
  });
  if (task.assignedToId && task.assignedToId !== user.id) await notify(task.assignedToId, "New task comment", content, "COMMENT_ADDED", "TASK", taskId);
  return comment;
}

export async function getTask(user: JwtPayload, id: number) {
  await ensureCanAccessTask(user, id);
  return prisma.task.findUniqueOrThrow({ where: { id }, include: includeTask });
}
