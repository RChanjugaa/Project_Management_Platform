import "dotenv/config";
import { z } from "zod";

if (process.env.VITEST) {
  process.env.NODE_ENV ??= "test";
  process.env.CLIENT_URL ??= "http://localhost:3000";
  process.env.DATABASE_URL ??= "mysql://user:password@localhost:3306/project_team_management_test";
  process.env.JWT_SECRET ??= "local-test-secret-that-is-long-enough-for-validation";
  process.env.JWT_EXPIRES_IN ??= "24h";
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  JWT_EXPIRES_IN: z.string().default("24h")
});

export const env = envSchema.parse(process.env);
