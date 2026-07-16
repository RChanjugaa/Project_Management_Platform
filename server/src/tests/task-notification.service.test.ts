import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  ensureManageProject: vi.fn(), ensureManageTask: vi.fn(), ensureProgress: vi.fn(), ensureAccess: vi.fn(),
  member: vi.fn(), members: vi.fn(), taskCreate: vi.fn(), taskUpdate: vi.fn(), commentCreate: vi.fn(),
  notificationCreate: vi.fn(), notificationFindFirst: vi.fn(), notificationUpdate: vi.fn(), taskFindMany: vi.fn(),
  recordActivity: vi.fn(), notify: vi.fn()
}));
vi.mock("../config/prisma.js", () => ({ prisma: {
  projectMember: { findUnique: mocks.member, findMany: mocks.members }, task: { create: mocks.taskCreate, update: mocks.taskUpdate, findMany: mocks.taskFindMany },
  taskComment: { create: mocks.commentCreate }, notification: { create: mocks.notificationCreate, findFirst: mocks.notificationFindFirst, update: mocks.notificationUpdate, findMany: vi.fn() }
} }));
vi.mock("../services/rbac.service.js", () => ({
  ensureCanManageProject: mocks.ensureManageProject, ensureCanManageTask: mocks.ensureManageTask,
  ensureCanUpdateTaskProgress: mocks.ensureProgress, ensureCanAccessTask: mocks.ensureAccess, isAdmin: vi.fn()
}));
vi.mock("../services/activity.service.js", () => ({ recordActivity: mocks.recordActivity }));
vi.mock("../services/notification.service.js", async (original) => ({ ...(await original()), notify: mocks.notify }));

import { createComment, createTask, updateTaskProgress } from "../services/task.service.js";
import { markRead } from "../services/notification.service.js";

const user = { id: 2, email: "leader@test.dev", systemRole: "USER" as const, status: "ACTIVE" };
const task = { id: 8, projectId: 5, assignedToId: 3, title: "Test task", status: "TO_DO", progress: 0, project: { name: "Project" } };

beforeEach(() => vi.clearAllMocks());

describe("task service rules", () => {
  it("rejects assignment to a non-project member", async () => {
    mocks.ensureManageProject.mockResolvedValue({ id: 5 }); mocks.member.mockResolvedValue(null);
    await expect(createTask(user, { projectId: 5, assignedToId: 99, title: "Task", description: "Valid task", status: "TO_DO", priority: "HIGH", progress: 0, dueDate: "2026-08-01" })).rejects.toMatchObject({ statusCode: 400 });
  });
  it("allows an unassigned task", async () => {
    mocks.ensureManageProject.mockResolvedValue({ id: 5 }); mocks.taskCreate.mockResolvedValue({ ...task, assignedToId: null }); mocks.members.mockResolvedValue([]);
    await expect(createTask(user, { projectId: 5, assignedToId: null, title: "Task", description: "Valid task", status: "TO_DO", priority: "HIGH", progress: 0, dueDate: "2026-08-01" })).resolves.toMatchObject({ assignedToId: null });
  });
  it("automatically completes a task at 100 percent", async () => {
    mocks.ensureProgress.mockResolvedValue(task); mocks.taskUpdate.mockImplementation(async ({ data }) => ({ ...task, ...data }));
    const result = await updateTaskProgress(user, 8, { status: "IN_PROGRESS", progress: 100 });
    expect(result.status).toBe("COMPLETED"); expect(result.progress).toBe(100); expect(result.completedAt).toBeInstanceOf(Date);
  });
  it("forces completed status to 100 percent", async () => {
    mocks.ensureProgress.mockResolvedValue(task); mocks.taskUpdate.mockImplementation(async ({ data }) => ({ ...task, ...data }));
    const result = await updateTaskProgress(user, 8, { status: "COMPLETED", progress: 70 }); expect(result.progress).toBe(100);
  });
  it("allows an authorised participant to add a comment", async () => {
    mocks.ensureAccess.mockResolvedValue(task); mocks.commentCreate.mockResolvedValue({ id: 12, content: "Update", userId: user.id });
    await expect(createComment(user, 8, "Update")).resolves.toMatchObject({ id: 12 }); expect(mocks.notify).toHaveBeenCalledWith(3, "New task comment", "Update", "COMMENT_ADDED", "TASK", 8);
  });
});

describe("notification ownership", () => {
  it("marks only the current user's notification as read", async () => {
    mocks.notificationFindFirst.mockResolvedValue({ id: 4, userId: 2 }); mocks.notificationUpdate.mockResolvedValue({ id: 4, isRead: true });
    await expect(markRead(2, 4)).resolves.toMatchObject({ isRead: true }); expect(mocks.notificationFindFirst).toHaveBeenCalledWith({ where: { id: 4, userId: 2 } });
  });
  it("returns 404 for another user's notification", async () => { mocks.notificationFindFirst.mockResolvedValue(null); await expect(markRead(2, 99)).rejects.toMatchObject({ statusCode: 404 }); });
});
