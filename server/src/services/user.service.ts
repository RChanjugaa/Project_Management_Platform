import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { toSafeUser } from "./auth.service.js";

export async function listRoles() {
  return prisma.role.findMany({ orderBy: { id: "asc" } });
}

export async function listUsers() {
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: "desc" }
  });
  return users.map(toSafeUser);
}

export async function listAssignableUsers() {
  const users = await prisma.user.findMany({
    where: { status: "ACTIVE" },
    include: { role: true },
    orderBy: { name: "asc" }
  });
  return users.map(toSafeUser);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  roleId: number;
  status: "ACTIVE" | "INACTIVE";
}) {
  const role = await prisma.role.findUnique({ where: { id: input.roleId } });
  if (!role) throw new AppError("Role not found.", 404);

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      roleId: input.roleId,
      status: input.status
    },
    include: { role: true }
  });
  return toSafeUser(user);
}

export async function updateUser(
  id: number,
  input: Partial<{ name: string; email: string; password: string; roleId: number; status: "ACTIVE" | "INACTIVE" }>
) {
  if (input.roleId) {
    const role = await prisma.role.findUnique({ where: { id: input.roleId } });
    if (!role) throw new AppError("Role not found.", 404);
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: input.name,
      email: input.email,
      roleId: input.roleId,
      status: input.status,
      passwordHash: input.password ? await bcrypt.hash(input.password, 12) : undefined
    },
    include: { role: true }
  });
  return toSafeUser(user);
}

export async function deactivateUser(id: number) {
  const user = await prisma.user.update({
    where: { id },
    data: { status: "INACTIVE" },
    include: { role: true }
  });
  return toSafeUser(user);
}
