import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";

export function notify(userId: number, title: string, message: string, type: "PROJECT_ASSIGNED" | "TASK_ASSIGNED" | "TASK_UPDATED" | "TASK_DUE_SOON" | "COMMENT_ADDED" | "SYSTEM", relatedEntityType?: string, relatedEntityId?: number) {
  return prisma.notification.create({ data: { userId, title, message, type, relatedEntityType, relatedEntityId } });
}
async function createDueSoonNotifications(userId: number) {
  const now = new Date();
  const deadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const tasks = await prisma.task.findMany({
    where: { assignedToId: userId, status: { not: "COMPLETED" }, dueDate: { gte: now, lte: deadline } },
    select: { id: true, title: true, dueDate: true, project: { select: { name: true } } }
  });

  for (const task of tasks) {
    const existing = await prisma.notification.findFirst({
      where: { userId, type: "TASK_DUE_SOON", relatedEntityType: "TASK", relatedEntityId: task.id }
    });
    if (!existing) {
      await prisma.notification.create({
        data: {
          userId,
          title: "Task deadline approaching",
          message: `${task.title} in ${task.project.name} is due ${task.dueDate.toLocaleDateString()}.`,
          type: "TASK_DUE_SOON",
          relatedEntityType: "TASK",
          relatedEntityId: task.id
        }
      });
    }
  }
}

export async function listNotifications(userId: number) {
  await createDueSoonNotifications(userId);
  return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 100 });
}
export async function markRead(userId: number, id: number) {
  const item = await prisma.notification.findFirst({ where: { id, userId } });
  if (!item) throw new AppError("Notification not found.", 404);
  return prisma.notification.update({ where: { id }, data: { isRead: true, readAt: new Date() } });
}
