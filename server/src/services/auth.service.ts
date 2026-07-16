import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { signAccessToken } from "../utils/jwt.js";
import type { LoginInput } from "../validators/auth.validator.js";

const invalidCredentialsMessage = "Invalid email or password.";

export function toSafeUser(user: {
  id: number;
  name: string;
  email: string;
  status: string;
  systemRole: "ADMIN" | "USER";
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    systemRole: user.systemRole
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError(invalidCredentialsMessage, 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(invalidCredentialsMessage, 401);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(invalidCredentialsMessage, 401);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  const safeUser = toSafeUser(user);
  const token = signAccessToken({
    id: safeUser.id,
    email: safeUser.email,
    systemRole: safeUser.systemRole,
    status: safeUser.status
  });

  return { user: safeUser, token };
}

export async function getAuthenticatedUser(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("Authenticated user no longer exists.", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Invalid or expired session.", 401);
  }

  return toSafeUser(user);
}
