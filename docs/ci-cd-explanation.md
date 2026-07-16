# CI/CD Workflow Explanation

PulseDeck uses GitHub Actions for basic continuous integration. The workflow is stored in `.github/workflows/ci.yml` and runs when code is pushed to `main` or when a pull request targets `main`.

## Frontend checks

The frontend job uses Node.js 20 and runs inside the `client` directory:

1. Check out the repository.
2. Install the exact package versions with `npm ci`.
3. Run ESLint.
4. Run the TypeScript type check.
5. Create a Next.js production build.

If any step fails, the frontend CI job fails and the error is visible in the GitHub Actions log.

## Backend checks

The backend job uses Node.js 20 and a temporary PostgreSQL 16 service created only for CI:

1. Check out the repository.
2. Install the exact backend package versions with `npm ci`.
3. Generate Prisma Client.
4. Apply Prisma migrations to the temporary CI database.
5. Run the TypeScript type check.
6. Run the automated tests.
7. Build the Express application for production.

The CI database uses placeholder credentials inside the workflow. It is separate from the deployed PostgreSQL database, so automated tests never modify production data.

## Deployment flow

```text
Developer push
      ↓
GitHub repository
      ↓
GitHub Actions validation
      ↓
Vercel frontend deployment + Render backend deployment
```

Vercel and Render are connected to the GitHub repository and deploy changes from the main branch. Production secrets are configured through their environment-variable settings and are not stored in source control.

## Purpose

This workflow catches lint, type, migration, test, and build failures before a change is treated as deployment-ready. It also provides a visible validation history for reviewers in the repository's Actions tab.
