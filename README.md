# Project and Team Task Management Platform

A full-stack project management system for the Intern Full Stack Developer practical assignment. It supports administrator, project manager, and team member workflows with secure authentication, role-based authorization, project assignment, task tracking, comments, documentation, and CI validation.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Backend: Node.js, Express.js, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Auth: JWT stored in an HTTP-only cookie
- Password hashing: bcryptjs
- API: REST JSON under `/api/v1`

## Features

- Login, logout, and current-user session check.
- Administrator user management.
- Project manager project and task management.
- Team member assigned project/task view.
- Project member assignment.
- Task progress/status updates.
- Task comments.
- Role-based API authorization.
- Responsive calm-focus UI.
- PostgreSQL database relationships through Prisma.
- Basic CI for lint, type-check, test, Prisma generate, and build.

## Setup

```bash
npm install
npm install --prefix client
npm install --prefix server

cp client/.env.example client/.env
cp server/.env.example server/.env
```

Update `server/.env` with your PostgreSQL `DATABASE_URL`, `JWT_SECRET`, and seed account values.

Run the app:

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000/api/v1`

## PostgreSQL Database Commands

Run these after PostgreSQL is configured:

```bash
npm run db:migrate --prefix server
npm run db:seed --prefix server
```

## Validation

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

- [Design system](DESIGN.md)
- [API endpoints](docs/api-endpoints.md)
- [Feature completion report](docs/feature-completion-report.md)
- [CI/CD explanation](docs/ci-cd-explanation.md)
- [Postman collection](postman/project-team-management.postman_collection.json)

Draw.io diagrams can be added separately for ER, use case, and architecture diagrams.

## AI Usage

AI assisted with planning, code scaffolding, documentation, and validation guidance. The final code and submission should be reviewed by the developer before sending.
