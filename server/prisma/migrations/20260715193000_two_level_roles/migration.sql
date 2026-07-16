-- This forward-only migration preserves existing data while separating system and project roles.
CREATE TYPE "SystemRole" AS ENUM ('ADMIN', 'USER');
CREATE TYPE "ProjectRole" AS ENUM ('PROJECT_LEADER', 'TEAM_MEMBER');

ALTER TABLE "User" ADD COLUMN "systemRole" "SystemRole";
ALTER TABLE "ProjectMember" ADD COLUMN "projectRole" "ProjectRole";

UPDATE "User" AS u
SET "systemRole" = CASE WHEN r."name" = 'ADMIN' THEN 'ADMIN'::"SystemRole" ELSE 'USER'::"SystemRole" END
FROM "Role" AS r
WHERE u."roleId" = r."id";

UPDATE "ProjectMember" AS pm
SET "projectRole" = CASE
  WHEN r."name" = 'PROJECT_MANAGER' THEN 'PROJECT_LEADER'::"ProjectRole"
  ELSE 'TEAM_MEMBER'::"ProjectRole"
END
FROM "User" AS u
JOIN "Role" AS r ON r."id" = u."roleId"
WHERE pm."userId" = u."id";

INSERT INTO "ProjectMember" ("projectId", "userId", "projectRole", "assignedAt")
SELECT p."id", p."createdById", 'PROJECT_LEADER'::"ProjectRole", CURRENT_TIMESTAMP
FROM "Project" AS p
ON CONFLICT ("projectId", "userId") DO UPDATE SET "projectRole" = 'PROJECT_LEADER'::"ProjectRole";

ALTER TABLE "User" ALTER COLUMN "systemRole" SET DEFAULT 'USER';
ALTER TABLE "User" ALTER COLUMN "systemRole" SET NOT NULL;
ALTER TABLE "ProjectMember" ALTER COLUMN "projectRole" SET DEFAULT 'TEAM_MEMBER';
ALTER TABLE "ProjectMember" ALTER COLUMN "projectRole" SET NOT NULL;

ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";
DROP INDEX "User_roleId_idx";
ALTER TABLE "User" DROP COLUMN "roleId";
DROP TABLE "Role";

CREATE INDEX "User_systemRole_status_idx" ON "User"("systemRole", "status");
CREATE INDEX "ProjectMember_projectId_projectRole_idx" ON "ProjectMember"("projectId", "projectRole");
ALTER TABLE "Task" ADD CONSTRAINT "Task_progress_check" CHECK ("progress" >= 0 AND "progress" <= 100);
ALTER TABLE "Project" ADD CONSTRAINT "Project_date_range_check" CHECK ("endDate" >= "startDate");
