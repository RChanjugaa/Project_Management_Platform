import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createProjectSchema } from "../validators/project.validator.js";
import { createTaskSchema, updateTaskProgressSchema } from "../validators/task.validator.js";
import { addProjectMemberSchema } from "../validators/project.validator.js";

describe("two-level role alignment", () => {
  const schema = readFileSync(new URL("../../prisma/schema.prisma", import.meta.url), "utf8");
  it("uses ADMIN and USER system roles", () => { expect(schema).toContain("enum SystemRole"); expect(schema).toMatch(/ADMIN\s+USER/); });
  it("stores project roles on membership", () => { expect(schema).toContain("projectRole ProjectRole"); expect(schema).toContain("PROJECT_LEADER"); });
  it("preserves unique project membership", () => expect(schema).toContain("@@unique([projectId, userId])"));
  it("allows both project membership roles", () => {
    expect(addProjectMemberSchema.safeParse({ params: { id: "1" }, body: { userId: 2, projectRole: "PROJECT_LEADER" } }).success).toBe(true);
    expect(addProjectMemberSchema.safeParse({ params: { id: "1" }, body: { userId: 2, projectRole: "TEAM_MEMBER" } }).success).toBe(true);
  });
});

describe("business validation", () => {
  const project = { name: "Project", projectCode: "P-1", description: "A valid project", status: "ACTIVE", priority: "MEDIUM", startDate: "2026-07-20", endDate: "2026-07-19" };
  it("rejects an end date before the start date", () => expect(createProjectSchema.safeParse({ body: project }).success).toBe(false));
  it("rejects progress below zero", () => expect(updateTaskProgressSchema.safeParse({ params: { id: 1 }, body: { progress: -1 } }).success).toBe(false));
  it("rejects progress above 100", () => expect(updateTaskProgressSchema.safeParse({ params: { id: 1 }, body: { progress: 101 } }).success).toBe(false));
  it("allows an unassigned task", () => expect(createTaskSchema.safeParse({ body: { projectId: 1, assignedToId: null, title: "Task", description: "A valid task", status: "TO_DO", priority: "MEDIUM", progress: 0, dueDate: "2026-07-20" } }).success).toBe(true));
});
