import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import type { JwtPayload } from "../utils/jwt.js";
import { ensureCanManageProject, isAdmin } from "./rbac.service.js";
import { recordActivity } from "./activity.service.js";
import { notify } from "./notification.service.js";

const includeProject = {
  createdBy: { select: { id: true, name: true, email: true, systemRole: true, status: true } },
  members: {
    include: { user: { select: { id: true, name: true, email: true, systemRole: true, status: true } } },
    orderBy: { assignedAt: "asc" as const }
  },
  tasks: true
};

export async function listProjects(user: JwtPayload) {
  return prisma.project.findMany({
    where: isAdmin(user) ? {} : { members: { some: { userId: user.id } } },
    include: includeProject,
    orderBy: { createdAt: "desc" }
  });
}

export async function getProject(user: JwtPayload, id: number) {
  if (!isAdmin(user)) {
    const member = await prisma.projectMember.findUnique({ where: { projectId_userId: { projectId: id, userId: user.id } } });
    if (!member) throw new AppError("You are not allowed to view this project.", 403);
  }
  const project = await prisma.project.findUnique({ where: { id }, include: includeProject });
  if (!project) throw new AppError("Project not found.", 404);
  return project;
}

type ProjectInput = {
  name: string; projectCode?: string; description: string;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"; startDate: string; endDate: string;
};

function dates(input: Partial<ProjectInput>) {
  if (input.startDate && input.endDate && new Date(input.endDate) < new Date(input.startDate)) {
    throw new AppError("End date must be on or after start date.", 400);
  }
}

export async function createProject(user: JwtPayload, input: ProjectInput) {
  dates(input);
  const projectCode = input.projectCode?.trim().toUpperCase() || `PRJ-${Date.now().toString(36).toUpperCase()}`;
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({ data: { ...input, projectCode, startDate: new Date(input.startDate), endDate: new Date(input.endDate), createdById: user.id } });
    await tx.projectMember.create({ data: { projectId: project.id, userId: user.id, projectRole: "PROJECT_LEADER" } });
    await tx.activityLog.create({ data: { userId: user.id, action: "PROJECT_CREATED", entityType: "PROJECT", entityId: project.id } });
    return tx.project.findUniqueOrThrow({ where: { id: project.id }, include: includeProject });
  });
}

export async function updateProject(user: JwtPayload, id: number, input: Partial<ProjectInput>) {
  await ensureCanManageProject(user, id);
  dates(input);
  const project = await prisma.project.update({ where: { id }, data: { ...input, startDate: input.startDate ? new Date(input.startDate) : undefined, endDate: input.endDate ? new Date(input.endDate) : undefined }, include: includeProject });
  await recordActivity(user.id, "PROJECT_UPDATED", "PROJECT", id);
  return project;
}

export async function deleteProject(user: JwtPayload, id: number) {
  await ensureCanManageProject(user, id);
  await prisma.project.delete({ where: { id } });
}

export async function addMember(user: JwtPayload, projectId: number, memberUserId: number, projectRole: "PROJECT_LEADER" | "TEAM_MEMBER") {
  await ensureCanManageProject(user, projectId);
  const target = await prisma.user.findUnique({ where: { id: memberUserId } });
  if (!target || target.status !== "ACTIVE") throw new AppError("User is invalid or inactive.", 400);
  const existing = await prisma.projectMember.findUnique({ where: { projectId_userId: { projectId, userId: memberUserId } } });
  if (existing) throw new AppError("This user is already a project member.", 409);
  await prisma.projectMember.create({ data: { projectId, userId: memberUserId, projectRole } });
  await Promise.all([recordActivity(user.id, "PROJECT_MEMBER_ADDED", "PROJECT", projectId, { memberUserId, projectRole }), notify(memberUserId, "Project membership assigned", `You were added as ${projectRole === "PROJECT_LEADER" ? "Project Manager" : "Team Member"}.`, "PROJECT_ASSIGNED", "PROJECT", projectId)]);
  return getProject(user, projectId);
}

export async function changeMemberRole(user: JwtPayload, projectId: number, memberUserId: number, projectRole: "PROJECT_LEADER" | "TEAM_MEMBER") {
  await ensureCanManageProject(user, projectId);
  return prisma.$transaction(async (tx) => {
    const membership = await tx.projectMember.findUnique({ where: { projectId_userId: { projectId, userId: memberUserId } } });
    if (!membership) throw new AppError("Project membership not found.", 404);
    if (membership.projectRole === "PROJECT_LEADER" && projectRole === "TEAM_MEMBER") {
      const leaders = await tx.projectMember.count({ where: { projectId, projectRole: "PROJECT_LEADER" } });
      if (leaders <= 1) throw new AppError("A project must retain at least one Project Leader.", 409);
    }
    await tx.projectMember.update({ where: { projectId_userId: { projectId, userId: memberUserId } }, data: { projectRole } });
    await tx.activityLog.create({ data: { userId: user.id, action: "PROJECT_ROLE_CHANGED", entityType: "PROJECT", entityId: projectId, details: { memberUserId, projectRole } } });
    await tx.notification.create({ data: { userId: memberUserId, title: "Project role changed", message: `Your project role is now ${projectRole}.`, type: "PROJECT_ASSIGNED", relatedEntityType: "PROJECT", relatedEntityId: projectId } });
    return tx.project.findUniqueOrThrow({ where: { id: projectId }, include: includeProject });
  });
}

export async function removeMember(user: JwtPayload, projectId: number, memberUserId: number) {
  await ensureCanManageProject(user, projectId);
  await prisma.$transaction(async (tx) => {
    const membership = await tx.projectMember.findUnique({ where: { projectId_userId: { projectId, userId: memberUserId } } });
    if (!membership) throw new AppError("Project membership not found.", 404);
    if (membership.projectRole === "PROJECT_LEADER") {
      const leaders = await tx.projectMember.count({ where: { projectId, projectRole: "PROJECT_LEADER" } });
      if (leaders <= 1) throw new AppError("The final Project Leader cannot be removed.", 409);
    }
    await tx.task.updateMany({ where: { projectId, assignedToId: memberUserId }, data: { assignedToId: null } });
    await tx.projectMember.delete({ where: { projectId_userId: { projectId, userId: memberUserId } } });
  });
}

export async function getWorkload(user: JwtPayload, projectId: number) {
  await ensureCanManageProject(user, projectId);
  const members = await prisma.projectMember.findMany({ where: { projectId }, include: { user: { select: { id: true, name: true, email: true } } } });
  const now = new Date();
  return Promise.all(members.map(async (member) => {
    const [assigned, completed, overdue] = await Promise.all([
      prisma.task.count({ where: { projectId, assignedToId: member.userId } }),
      prisma.task.count({ where: { projectId, assignedToId: member.userId, status: "COMPLETED" } }),
      prisma.task.count({ where: { projectId, assignedToId: member.userId, dueDate: { lt: now }, status: { not: "COMPLETED" } } })
    ]);
    return { user: member.user, projectRole: member.projectRole, assigned, completed, overdue, completionPercentage: assigned ? Math.round((completed / assigned) * 100) : 0 };
  }));
}
