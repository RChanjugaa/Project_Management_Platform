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
  role: { name: string };
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    role: user.role.name
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { role: true }
  });

  if (!user) {
    throw new AppError(invalidCredentialsMessage, 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("This account is inactive.", 403);
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
    role: safeUser.role,
    status: safeUser.status
  });

  return { user: safeUser, token };
}

export async function getAuthenticatedUser(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true }
  });

  if (!user) {
    throw new AppError("Authenticated user no longer exists.", 401);
  }

  return toSafeUser(user);
}
