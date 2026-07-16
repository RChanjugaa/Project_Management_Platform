import "dotenv/config";
import bcrypt from "bcryptjs";
import {
  PrismaClient,
  type Priority,
  type ProjectRole,
  type ProjectStatus,
  type SystemRole,
  type TaskStatus
} from "@prisma/client";

const prisma = new PrismaClient();
const day = 86_400_000;
const now = new Date();
const dateFromNow = (days: number) => new Date(now.getTime() + days * day);

function required(key: string) {
  const value = process.env[key];
  if (!value || value.startsWith("replace-with")) throw new Error(`Missing secure seed value for ${key}`);
  return value;
}

type SeedUser = { key: string; name: string; email: string; systemRole: SystemRole };

async function main() {
  const sharedPassword = required("SEED_MEMBER_PASSWORD");
  const passwordHash = await bcrypt.hash(sharedPassword, 12);
  const usersToSeed: SeedUser[] = [
    { key: "ADMIN", name: required("SEED_ADMIN_NAME"), email: required("SEED_ADMIN_EMAIL"), systemRole: "ADMIN" },
    { key: "MANAGER", name: required("SEED_MANAGER_NAME"), email: required("SEED_MANAGER_EMAIL"), systemRole: "USER" },
    { key: "MEMBER", name: required("SEED_MEMBER_NAME"), email: required("SEED_MEMBER_EMAIL"), systemRole: "USER" },
    { key: "AISHA", name: "Aisha Rahman", email: "aisha.demo@pulsedeck.test", systemRole: "USER" },
    { key: "KAVIN", name: "Kavin Raj", email: "kavin.demo@pulsedeck.test", systemRole: "USER" },
    { key: "NILA", name: "Nila Fernando", email: "nila.demo@pulsedeck.test", systemRole: "USER" },
    { key: "SAM", name: "Sam Wilson", email: "sam.demo@pulsedeck.test", systemRole: "USER" }
  ];

  const userIds = new Map<string, number>();
  for (const account of usersToSeed) {
    const accountPassword = account.key === "ADMIN"
      ? await bcrypt.hash(required("SEED_ADMIN_PASSWORD"), 12)
      : account.key === "MANAGER"
        ? await bcrypt.hash(required("SEED_MANAGER_PASSWORD"), 12)
        : passwordHash;
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: { name: account.name, systemRole: account.systemRole, status: "ACTIVE", passwordHash: accountPassword },
      create: { name: account.name, email: account.email, systemRole: account.systemRole, status: "ACTIVE", passwordHash: accountPassword }
    });
    userIds.set(account.key, user.id);
  }

  // Only replace records belonging to this demo dataset, preserving user-created projects.
  await prisma.project.deleteMany({ where: { projectCode: { startsWith: "DEMO-" } } });

  const projects: Array<{
    key: string; code: string; name: string; description: string; creator: string;
    status: ProjectStatus; priority: Priority; start: number; end: number;
    members: Array<[string, ProjectRole]>;
  }> = [
    { key: "WEB", code: "DEMO-WEB", name: "Customer Portal Redesign", description: "Redesign the customer portal with responsive dashboards, clearer navigation and accessible components.", creator: "ADMIN", status: "ACTIVE", priority: "HIGH", start: -18, end: 28, members: [["ADMIN", "PROJECT_LEADER"], ["AISHA", "PROJECT_LEADER"], ["MEMBER", "TEAM_MEMBER"], ["KAVIN", "TEAM_MEMBER"]] },
    { key: "MOBILE", code: "DEMO-MOB", name: "Mobile App MVP", description: "Deliver the first usable mobile application release for internal pilot users.", creator: "MANAGER", status: "ACTIVE", priority: "URGENT", start: -10, end: 14, members: [["MANAGER", "PROJECT_LEADER"], ["NILA", "TEAM_MEMBER"], ["SAM", "TEAM_MEMBER"]] },
    { key: "CRM", code: "DEMO-CRM", name: "CRM Data Migration", description: "Clean, map and migrate legacy customer records into the new CRM platform.", creator: "ADMIN", status: "ON_HOLD", priority: "MEDIUM", start: -30, end: 35, members: [["ADMIN", "PROJECT_LEADER"], ["KAVIN", "TEAM_MEMBER"], ["NILA", "TEAM_MEMBER"]] },
    { key: "MARKETING", code: "DEMO-MKT", name: "Q3 Product Campaign", description: "Plan content, creative assets and launch activities for the next product campaign.", creator: "AISHA", status: "PLANNING", priority: "LOW", start: 5, end: 52, members: [["AISHA", "PROJECT_LEADER"], ["MEMBER", "TEAM_MEMBER"], ["SAM", "TEAM_MEMBER"]] },
    { key: "ARCHIVE", code: "DEMO-ARC", name: "Infrastructure Upgrade", description: "Completed infrastructure modernization and operational handover.", creator: "MANAGER", status: "COMPLETED", priority: "HIGH", start: -80, end: -12, members: [["MANAGER", "PROJECT_LEADER"], ["NILA", "TEAM_MEMBER"]] }
  ];

  const projectIds = new Map<string, number>();
  for (const item of projects) {
    const project = await prisma.project.create({ data: {
      name: item.name, projectCode: item.code, description: item.description,
      createdById: userIds.get(item.creator)!, status: item.status, priority: item.priority,
      startDate: dateFromNow(item.start), endDate: dateFromNow(item.end)
    } });
    projectIds.set(item.key, project.id);
    await prisma.projectMember.createMany({ data: item.members.map(([key, projectRole]) => ({ projectId: project.id, userId: userIds.get(key)!, projectRole })) });
  }

  const taskSeeds: Array<[string, string, string, string, TaskStatus, Priority, number, number]> = [
    ["WEB", "Create responsive navigation", "Implement desktop and mobile navigation states.", "MEMBER", "IN_PROGRESS", "HIGH", 65, 2],
    ["WEB", "Accessibility audit", "Review keyboard flow, labels, focus states and contrast.", "KAVIN", "TO_DO", "HIGH", 0, 1],
    ["WEB", "Approve dashboard wireframes", "Review the final dashboard UX with stakeholders.", "AISHA", "UNDER_REVIEW", "MEDIUM", 90, 5],
    ["WEB", "Set up design tokens", "Document shared colour, spacing and typography tokens.", "MEMBER", "COMPLETED", "MEDIUM", 100, -3],
    ["MOBILE", "Fix authentication refresh", "Keep signed-in sessions valid after access token refresh.", "NILA", "IN_PROGRESS", "URGENT", 45, -1],
    ["MOBILE", "Prepare pilot release", "Create release notes and distribute the pilot build.", "SAM", "TO_DO", "HIGH", 10, 2],
    ["MOBILE", "Offline task cache", "Cache assigned tasks for unstable network conditions.", "NILA", "UNDER_REVIEW", "HIGH", 85, 7],
    ["CRM", "Validate customer mapping", "Confirm required legacy fields and transformation rules.", "KAVIN", "IN_PROGRESS", "MEDIUM", 40, 12],
    ["CRM", "Resolve duplicate contacts", "Identify and merge duplicate customer records.", "NILA", "TO_DO", "LOW", 0, 18],
    ["MARKETING", "Draft launch content calendar", "Prepare channel, owner and publishing-date plan.", "MEMBER", "TO_DO", "MEDIUM", 0, 20],
    ["MARKETING", "Collect campaign requirements", "Document audiences, goals, channels and budget.", "SAM", "COMPLETED", "LOW", 100, -2],
    ["ARCHIVE", "Complete production handover", "Transfer documentation and monitoring ownership.", "NILA", "COMPLETED", "HIGH", 100, -14]
  ];

  const taskIds: number[] = [];
  for (const [projectKey, title, description, assignee, status, priority, progress, dueIn] of taskSeeds) {
    const project = projects.find((item) => item.key === projectKey)!;
    const task = await prisma.task.create({ data: {
      projectId: projectIds.get(projectKey)!, createdById: userIds.get(project.creator)!, assignedToId: userIds.get(assignee)!,
      title, description, status, priority, progress, dueDate: dateFromNow(dueIn),
      completedAt: status === "COMPLETED" ? dateFromNow(Math.min(dueIn, -1)) : null
    } });
    taskIds.push(task.id);
  }

  await prisma.taskComment.createMany({ data: [
    { taskId: taskIds[0], userId: userIds.get("AISHA")!, content: "Mobile menu is looking good. Please also test the tablet breakpoint." },
    { taskId: taskIds[0], userId: userIds.get("MEMBER")!, content: "Tablet layout is updated and ready for review." },
    { taskId: taskIds[4], userId: userIds.get("MANAGER")!, content: "This is blocking the pilot. Share the test result once fixed." },
    { taskId: taskIds[7], userId: userIds.get("KAVIN")!, content: "The first 500 records passed validation." }
  ] });

  await prisma.notification.createMany({ data: [
    { userId: userIds.get("MEMBER")!, title: "Task due soon", message: "Create responsive navigation is due in 2 days.", type: "TASK_DUE_SOON", relatedEntityType: "TASK", relatedEntityId: taskIds[0] },
    { userId: userIds.get("KAVIN")!, title: "Task due tomorrow", message: "Accessibility audit is due tomorrow.", type: "TASK_DUE_SOON", relatedEntityType: "TASK", relatedEntityId: taskIds[1] },
    { userId: userIds.get("NILA")!, title: "Task overdue", message: "Fix authentication refresh has passed its deadline.", type: "TASK_DUE_SOON", relatedEntityType: "TASK", relatedEntityId: taskIds[4] },
    { userId: userIds.get("SAM")!, title: "Added to project", message: "You were added to Mobile App MVP.", type: "PROJECT_ASSIGNED", relatedEntityType: "PROJECT", relatedEntityId: projectIds.get("MOBILE") },
    { userId: userIds.get("AISHA")!, title: "Wireframes updated", message: "Dashboard wireframes are ready for review.", type: "TASK_UPDATED", relatedEntityType: "TASK", relatedEntityId: taskIds[2], isRead: true, readAt: dateFromNow(-1) }
  ] });

  await prisma.activityLog.createMany({ data: [
    { userId: userIds.get("ADMIN"), action: "PROJECT_CREATED", entityType: "PROJECT", entityId: projectIds.get("WEB"), details: { projectCode: "DEMO-WEB" } },
    { userId: userIds.get("MANAGER"), action: "PROJECT_CREATED", entityType: "PROJECT", entityId: projectIds.get("MOBILE"), details: { projectCode: "DEMO-MOB" } },
    { userId: userIds.get("AISHA"), action: "TASK_UPDATED", entityType: "TASK", entityId: taskIds[2], details: { status: "UNDER_REVIEW", progress: 90 } },
    { userId: userIds.get("NILA"), action: "TASK_COMPLETED", entityType: "TASK", entityId: taskIds[11], details: { status: "COMPLETED", progress: 100 } }
  ] });

  console.log(`Seed complete: ${usersToSeed.length} users, ${projects.length} projects, ${taskSeeds.length} tasks, 4 comments, 5 notifications.`);
  console.log(`Demo member accounts use SEED_MEMBER_PASSWORD. Admin and manager use their own configured passwords.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
