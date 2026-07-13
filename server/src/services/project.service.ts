import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import type { JwtPayload } from "../utils/jwt.js";
import { ensureCanManageProject, isAdmin, isManager } from "./rbac.service.js";

const includeProject = {
  createdBy: { include: { role: true } },
  members: { include: { user: { include: { role: true } } } },
  tasks: true
};

export async function listProjects(user: JwtPayload) {
  const where = isAdmin(user)
    ? {}
    : isManager(user)
      ? { OR: [{ createdById: user.id }, { members: { some: { userId: user.id } } }] }
      : { members: { some: { userId: user.id } } };

  return prisma.project.findMany({
    where,
    include: includeProject,
    orderBy: { createdAt: "desc" }
  });
}

export async function createProject(user: JwtPayload, input: {
  name: string;
  projectCode: string;
  description: string;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  startDate: string;
  endDate: string;
}) {
  if (!isAdmin(user) && !isManager(user)) {
    throw new AppError("Only administrators and project managers can create projects.", 403);
  }

  return prisma.project.create({
    data: {
      ...input,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      createdById: user.id
    },
    include: includeProject
  });
}

export async function updateProject(user: JwtPayload, id: number, input: Partial<{
  name: string;
  projectCode: string;
  description: string;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  startDate: string;
  endDate: string;
}>) {
  await ensureCanManageProject(user, id);
  return prisma.project.update({
    where: { id },
    data: {
      ...input,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined
    },
    include: includeProject
  });
}

export async function deleteProject(user: JwtPayload, id: number) {
  await ensureCanManageProject(user, id);
  await prisma.project.delete({ where: { id } });
}

export async function assignMembers(user: JwtPayload, projectId: number, userIds: number[]) {
  await ensureCanManageProject(user, projectId);

  const users = await prisma.user.findMany({ where: { id: { in: userIds }, status: "ACTIVE" } });
  if (users.length !== userIds.length) {
    throw new AppError("One or more selected users are invalid or inactive.", 400);
  }

  await prisma.projectMember.deleteMany({ where: { projectId } });
  await prisma.projectMember.createMany({
    data: userIds.map((userId) => ({ projectId, userId })),
    skipDuplicates: true
  });

  return prisma.project.findUniqueOrThrow({ where: { id: projectId }, include: includeProject });
}
