import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { authorizeSystemRoles } from "../middleware/authorize.js";
import { createProjectSchema, updateProjectMemberSchema } from "../validators/project.validator.js";
import { createTaskCommentSchema, createTaskSchema, updateTaskProgressSchema } from "../validators/task.validator.js";
import { changePasswordSchema, createUserSchema } from "../validators/user.validator.js";

describe("request validation coverage", () => {
  it("rejects weak user passwords", () => expect(createUserSchema.safeParse({ body: { name: "User", email: "user@test.dev", password: "short", systemRole: "USER" } }).success).toBe(false));
  it("rejects invalid system roles", () => expect(createUserSchema.safeParse({ body: { name: "User", email: "user@test.dev", password: "Password123", systemRole: "PROJECT_LEADER" } }).success).toBe(false));
  it("requires the current password for password changes", () => expect(changePasswordSchema.safeParse({ body: { currentPassword: "", newPassword: "Password123" } }).success).toBe(false));
  it("accepts a project without a manually supplied code", () => expect(createProjectSchema.safeParse({ body: { name: "Project", description: "Valid project", status: "ACTIVE", priority: "HIGH", startDate: "2026-08-01", endDate: "2026-08-10" } }).success).toBe(true));
  it("rejects an invalid project membership role", () => expect(updateProjectMemberSchema.safeParse({ params: { id: "1", userId: "2" }, body: { projectRole: "ADMIN" } }).success).toBe(false));
  it("rejects invalid task priority", () => expect(createTaskSchema.safeParse({ body: { projectId: 1, title: "Task", description: "Valid task", status: "TO_DO", priority: "CRITICAL", progress: 0, dueDate: "2026-08-10" } }).success).toBe(false));
  it("rejects comments containing only whitespace", () => expect(createTaskCommentSchema.safeParse({ params: { id: "1" }, body: { content: "  " } }).success).toBe(false));
  it("requires progress when updating task progress", () => expect(updateTaskProgressSchema.safeParse({ params: { id: "1" }, body: { status: "IN_PROGRESS" } }).success).toBe(false));
});

describe("system-role middleware", () => {
  it("returns 401 when authentication is missing", () => {
    const next = vi.fn(); authorizeSystemRoles("ADMIN")({} as Request, {} as Response, next as NextFunction); expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 401 });
  });
  it("returns 403 when a USER requests an ADMIN resource", () => {
    const next = vi.fn(); authorizeSystemRoles("ADMIN")({ user: { id: 2, email: "user@test.dev", systemRole: "USER", status: "ACTIVE" } } as Request, {} as Response, next as NextFunction); expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 403 });
  });
  it("allows an ADMIN through", () => {
    const next = vi.fn(); authorizeSystemRoles("ADMIN")({ user: { id: 1, email: "admin@test.dev", systemRole: "ADMIN", status: "ACTIVE" } } as Request, {} as Response, next as NextFunction); expect(next).toHaveBeenCalledWith();
  });
});
