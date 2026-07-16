# PulseDeck — Project and Team Management Platform

PulseDeck is a full-stack web application I built to make project and task management simple for administrators, project leaders, and team members. The main idea is similar to a lightweight Trello workspace: create a project, add the right people, assign tasks, track progress, and keep everyone informed from one place.

This project was completed as part of my Full Stack Developer internship practical assignment.

## What can PulseDeck do?

- Secure login and logout using an HTTP-only authentication cookie
- Administrator user management
- Project creation with an automatically generated project code
- Project-specific leaders and team members
- Task creation, assignment, priority, deadline, status, and progress tracking
- Trello-style task workflow: `To Do`, `In Progress`, `Under Review`, and `Completed`
- Task comments for team communication
- Notifications when a user is added to a project or assigned a task
- Due-soon task reminders
- User profile and password management
- Administrator activity history
- Light and dark themes
- Responsive layout for desktop, tablet, and mobile screens

## How the roles work

PulseDeck uses two levels of access so that permissions stay clear.

### Administrator

An administrator manages system users, can view all projects, and can review system activity. An administrator can also be added to a project as a Project Leader or Team Member.

### Project Leader

A Project Leader manages a particular project. They can add project members, create and assign tasks, update project information, and monitor the team's progress.

### Team Member

A Team Member can view the projects they belong to, work on assigned tasks, update task progress, and add comments.

A user can be a leader in one project and a team member in another project. This is handled through the project membership relationship instead of giving every user one fixed project role.

## Main workflow

1. The administrator creates the required user accounts.
2. A project is created and PulseDeck generates its project code automatically.
3. Users are added to the project as Project Leaders or Team Members.
4. The Project Leader creates tasks and assigns them to project members.
5. Team Members move their work through the task statuses and update progress.
6. Comments and notifications keep the team informed.
7. The dashboard shows project, task, deadline, and completion information.

## Technology used

| Part | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Authentication | JWT in an HTTP-only cookie |
| Password security | bcryptjs |
| Testing | Vitest and Supertest |
| CI | GitHub Actions |

## Project structure

```text
project-team-management-platform/
├── client/                 # Next.js frontend
├── server/                 # Express API and Prisma setup
│   ├── prisma/
│   │   ├── migrations/     # Database migration history
│   │   ├── schema.prisma   # Database models and relationships
│   │   └── seed.ts         # Realistic demo data
│   └── src/
├── DIAGRAMS/               # ER and use-case diagrams
├── postman/                # API testing collection
├── .github/workflows/      # Automatic CI checks
├── START-PULSEDECK.cmd     # One-click Windows launcher
└── README.md
```

## Before running the project

Please install the following:

- Node.js 20 or later
- npm
- PostgreSQL
- Git, if you are cloning the repository

## Setup instructions

### 1. Clone and open the project

```bash
git clone https://github.com/RChanjugaa/Project_Management_Platform.git
cd Project_Management_Platform
```

### 2. Install the packages

Run these commands from the project root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Create the environment files

On Windows PowerShell:

```powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
```

On macOS or Linux:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

The frontend file should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Open `server/.env` and update:

- `DATABASE_URL` with your PostgreSQL username, password, host, port, and database name
- `JWT_SECRET` with a private random value of at least 32 characters
- Seed account names, emails, and passwords used for local testing

Never commit the real `.env` files. The repository contains only safe `.env.example` templates.

### 4. Prepare the database

Create an empty PostgreSQL database named `project_team_management`, then run:

```bash
npm run prisma:generate --prefix server
npm run db:migrate --prefix server
npm run db:seed --prefix server
```

The seed command creates sample users, projects, memberships, tasks, comments, notifications, and activity records. It is useful for testing the complete system without entering everything manually.

## Starting PulseDeck

### Easy Windows method

Double-click:

```text
START-PULSEDECK.cmd
```

It clears the old frontend cache and opens two command windows:

- PulseDeck Backend
- PulseDeck Frontend

Keep both windows open. When the frontend window says `Ready`, open:

```text
http://localhost:3000/login
```

### Manual method

You can also start both applications from the project root:

```bash
npm run dev
```

Local addresses:

- Frontend: `http://localhost:3000`
- API: `http://localhost:5000/api/v1`
- API health check: `http://localhost:5000/api/v1/health`

## Logging in

Use the admin, manager, or member email and password configured in `server/.env` before running the seed command.

For security, real passwords are not written in this README. If login fails after changing a seed password, run the seed command again so the stored password is updated:

```bash
npm run db:seed --prefix server
```

## How to use the system

### As an Administrator

1. Sign in using the seeded administrator account.
2. Open **Users** to create and review user accounts.
3. Open **Projects** to create a project or review existing projects.
4. Add users to a project and choose their project role.
5. Use **Activity Log** to review important system actions.

### As a Project Leader

1. Open **Projects** and select a project you lead.
2. Add Team Members where required.
3. Create tasks, choose an assignee, priority, and deadline.
4. Track tasks across the four workflow columns.
5. Review task progress and comments before completing the project.

### As a Team Member

1. Sign in and open **Projects**.
2. Select a project you belong to.
3. Review tasks assigned to you.
4. Update the status and progress as work moves forward.
5. Add a comment when you need to share an update.
6. Check the notification bell for assignments and approaching deadlines.

## Useful development commands

Run these from the project root:

```bash
npm run lint        # Check code quality
npm run type-check  # Check TypeScript types
npm run test        # Run backend tests
npm run build       # Build frontend and backend
```

Prisma commands:

```bash
npm run prisma:format --prefix server
npm run prisma:validate --prefix server
npm run prisma:generate --prefix server
npm run db:migrate --prefix server
npm run db:seed --prefix server
```

## Diagrams

- [ER diagram — SVG](<DIAGRAMS/ER DIAGRAM.drawio.svg>)
- [ER diagram — PDF](<DIAGRAMS/ER DIAGRAM.pdf>)
- [Use-case diagram — SVG](<DIAGRAMS/PM USECASEdrawio.drawio.svg>)
- [Use-case diagram — PDF](<DIAGRAMS/USECASE DIAGRAM.pdf>)

## API testing

The Postman collection is available at:

[Project Team Management Postman collection](postman/project-team-management.postman_collection.json)

Import it into Postman and update the base URL if the API is deployed online.

## Deployment overview

The application can be deployed using:

- Vercel for the Next.js frontend
- Render for the Express backend
- Render PostgreSQL for the database

Production environment values must be added through the hosting dashboards and must never be committed to GitHub. Before deploying, run the build and tests locally, push the latest files, apply Prisma migrations, and update the frontend/backend URLs.

## Continuous integration

The `.github/workflows/ci.yml` file runs automatic checks whenever code is pushed to `main` or a pull request is opened. It checks the frontend build, backend build, TypeScript, Prisma migrations, and tests. This helps catch errors before submission or deployment.

## Current validation

- Backend tests: 11 passed
- TypeScript checks: passed
- Production builds: passed
- Prisma schema and migrations: included

---

Built as an internship practical project to demonstrate full-stack development, relational database design, role-based permissions, API development, testing, and responsive interface design.
