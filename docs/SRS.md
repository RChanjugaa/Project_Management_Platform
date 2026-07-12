# Software Requirements Specification

## Purpose

The platform supports project and team task management with secure authentication and role-based authorization.

## Scope

Day 1 scope establishes the application foundation, database design, login flow, RBAC, role dashboards, documentation, tests, and CI validation. Project and task CRUD screens are future work.

## Functional Requirements

- Users can authenticate with email and password.
- Authenticated sessions are stored in secure HTTP-only cookies.
- Administrators, project managers, and team members are redirected to role-specific dashboards.
- Backend endpoints enforce role authorization.
- The database model supports users, roles, projects, project members, tasks, comments, notifications, and activity logs.

## Non-Functional Requirements

- Strict TypeScript is used across frontend and backend.
- API input is validated with Zod.
- Passwords are hashed using bcryptjs.
- The backend uses central error handling and consistent JSON responses.
- The UI is responsive and accessible.
- CI validates linting, type-checking, tests, Prisma generation, and builds.

## Constraints

- MySQL must remain the configured database provider.
- Prisma migrations and seeding must be run only after MySQL is available.
