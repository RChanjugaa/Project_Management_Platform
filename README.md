# Project and Team Task Management Platform

A full-stack practical assignment foundation for a project and team task management platform. The Day 1 scope includes system setup, database modelling, authentication, role-based access control, role dashboards, documentation, tests that do not require MySQL, and CI validation.

## Technology Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, ESLint
- Backend: Node.js, Express.js, TypeScript
- Database: MySQL
- ORM: Prisma
- Validation: Zod
- Authentication: JWT in secure HTTP-only cookie
- Password hashing: bcryptjs
- API: RESTful JSON API under `/api/v1`
- Package manager: npm

## User Roles

- `ADMIN`: manages users, roles, projects, and system access.
- `PROJECT_MANAGER`: manages projects, team members, and project tasks.
- `TEAM_MEMBER`: views assigned projects/tasks and updates permitted task activity.

## Folder Structure

```text
project-team-management-platform/
  client/
  server/
  diagrams/
  docs/
  postman/
  .github/workflows/
```

## Current Day 1 Features

- Root monorepo scripts for development, linting, type-checking, tests, and builds.
- Responsive login UI and role dashboards.
- Frontend auth state management and role-based redirects.
- Express API with security middleware, CORS credentials, JSON limits, rate-limited login, central error handling, and 404 handling.
- Prisma MySQL schema for roles, users, projects, members, tasks, comments, notifications, and activity logs.
- Secure seed script that reads development accounts from environment variables.
- Auth endpoints: `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`.
- RBAC dashboard endpoints for admin, project manager, and team member roles.
- Non-database tests for health, 404, and validation failure.
- GitHub Actions workflow for lint, type-check, tests, Prisma generation, and build.

Project and task CRUD interfaces are intentionally not implemented in this Day 1 scope.

## Prerequisites

- Node.js 20 or newer
- npm
- MySQL 8 or newer

## Setup

Install dependencies:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Create environment files:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Update `server/.env` with a real MySQL `DATABASE_URL`, a long `JWT_SECRET`, and secure local seed credentials.

Run the development apps:

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000/api/v1`

## MySQL Setup Commands To Run Later

Do not run these until your local MySQL service is fixed and `DATABASE_URL` points to a working database:

```bash
npm run db:migrate --prefix server
npm run db:seed --prefix server
```

## Safe Verification Commands

These do not require a live MySQL connection:

```bash
npm run prisma:format --prefix server
npm run prisma:validate --prefix server
npm run prisma:generate --prefix server
npm run lint
npm run type-check
npm run test
npm run build
```

## Documentation

- [Role permissions](docs/role-permissions.md)
- [API endpoints](docs/api-endpoints.md)
- [SRS](docs/SRS.md)
- [Feature completion report](docs/feature-completion-report.md)
- [CI/CD explanation](docs/ci-cd-explanation.md)
- [ER diagram](diagrams/er-diagram.mmd)
- [Use case diagram](diagrams/use-case-diagram.puml)
- [System architecture](diagrams/system-architecture.mmd)
- [Postman collection](postman/project-team-management.postman_collection.json)

## Security Notes

- JWTs are stored in the `access_token` HTTP-only cookie.
- Cookies use `sameSite: lax` and are marked secure in production.
- Passwords are hashed with bcryptjs.
- Backend authorization is enforced with middleware; frontend route hiding is only a usability layer.
- Real secrets and passwords must not be committed.

## AI Usage Disclosure

AI tools assisted with project scaffolding, architecture planning, boilerplate code generation, documentation drafting, and verification guidance. Final review, testing, and submission decisions remain the developer's responsibility.
