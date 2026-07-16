import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ project: vi.fn(), membership: vi.fn(), task: vi.fn() }));
vi.mock("../config/prisma.js", () => ({ prisma: { project: { findUnique: mocks.project }, projectMember: { findUnique: mocks.membership }, task: { findUnique: mocks.task } } }));

import { ensureCanManageProject, ensureCanUpdateTaskProgress, ensureCanViewProject } from "../services/rbac.service.js";

const admin = { id: 1, email: "admin@test.dev", systemRole: "ADMIN" as const, status: "ACTIVE" };
const leader = { id: 2, email: "leader@test.dev", systemRole: "USER" as const, status: "ACTIVE" };
const member = { id: 3, email: "member@test.dev", systemRole: "USER" as const, status: "ACTIVE" };
const project = { id: 10 };
const task = { id: 20, projectId: 10, assignedToId: 3, project };

beforeEach(() => { vi.clearAllMocks(); mocks.project.mockResolvedValue(project); mocks.task.mockResolvedValue(task); });

describe("project RBAC", () => {
  it("allows an administrator to manage any project", async () => await expect(ensureCanManageProject(admin, 10)).resolves.toBe(project));
  it("allows a Project Leader to manage only their project", async () => { mocks.membership.mockResolvedValue({ projectRole: "PROJECT_LEADER" }); await expect(ensureCanManageProject(leader, 10)).resolves.toBe(project); });
  it("blocks a Team Member from leader operations", async () => { mocks.membership.mockResolvedValue({ projectRole: "TEAM_MEMBER" }); await expect(ensureCanManageProject(member, 10)).rejects.toMatchObject({ statusCode: 403 }); });
  it("blocks a non-member from viewing a project", async () => { mocks.membership.mockResolvedValue(null); await expect(ensureCanViewProject(member, 10)).rejects.toMatchObject({ statusCode: 403 }); });
  it("returns 404 when the project does not exist", async () => { mocks.project.mockResolvedValue(null); await expect(ensureCanViewProject(admin, 999)).rejects.toMatchObject({ statusCode: 404 }); });
});

describe("task progress RBAC", () => {
  it("allows the assigned Team Member to update progress", async () => { mocks.membership.mockResolvedValue({ projectRole: "TEAM_MEMBER" }); await expect(ensureCanUpdateTaskProgress(member, 20)).resolves.toBe(task); });
  it("allows a Project Leader to update project tasks", async () => { mocks.membership.mockResolvedValue({ projectRole: "PROJECT_LEADER" }); await expect(ensureCanUpdateTaskProgress(leader, 20)).resolves.toBe(task); });
  it("blocks a different Team Member from updating the task", async () => { mocks.membership.mockResolvedValue({ projectRole: "TEAM_MEMBER" }); await expect(ensureCanUpdateTaskProgress({ ...member, id: 4 }, 20)).rejects.toMatchObject({ statusCode: 403 }); });
  it("blocks a non-member before checking assignment", async () => { mocks.membership.mockResolvedValue(null); await expect(ensureCanUpdateTaskProgress({ ...member, id: 4 }, 20)).rejects.toMatchObject({ statusCode: 403 }); });
});
