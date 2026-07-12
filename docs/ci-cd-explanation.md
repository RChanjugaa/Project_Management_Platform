# CI/CD Workflow Explanation

The workflow in `.github/workflows/ci.yml` runs on pushes and pull requests to `main`.

## Frontend Job

- Installs dependencies with `npm ci`.
- Runs ESLint.
- Builds the Next.js app.

## Backend Job

- Installs dependencies with `npm ci`.
- Runs Prisma client generation using a placeholder MySQL `DATABASE_URL`.
- Runs TypeScript type-checking.
- Runs tests that do not require MySQL.
- Builds the Express TypeScript project.

The initial workflow does not run migrations or seed the database because those steps require a live MySQL database.
