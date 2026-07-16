import { prisma } from "../config/prisma.js";

export function recordActivity(userId: number | null, action: string, entityType: string, entityId?: number | null, details?: object) {
  return prisma.activityLog.create({ data: { userId, action, entityType, entityId, details } });
}

export async function listActivityLogs(page: number, pageSize: number) {
  const [items, total] = await Promise.all([
    prisma.activityLog.findMany({ skip: (page - 1) * pageSize, take: pageSize, include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.activityLog.count()
  ]);
  return { items, page, pageSize, total, pages: Math.ceil(total / pageSize) };
}
