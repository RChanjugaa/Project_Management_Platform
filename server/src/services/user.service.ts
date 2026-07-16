import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { toSafeUser } from "./auth.service.js";
import { recordActivity } from "./activity.service.js";

export const listUsers = async () => (await prisma.user.findMany({ orderBy: { createdAt: "desc" } })).map(toSafeUser);
export const listAssignableUsers = async () => (await prisma.user.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } })).map(toSafeUser);

export async function createUser(input: { name: string; email: string; password: string; systemRole: "ADMIN" | "USER"; status: "ACTIVE" | "INACTIVE" }) {
  const user = await prisma.user.create({ data: { name: input.name, email: input.email, passwordHash: await bcrypt.hash(input.password, 12), systemRole: input.systemRole, status: input.status } });
  await recordActivity(null, "USER_CREATED", "USER", user.id, { systemRole: user.systemRole, status: user.status });
  return toSafeUser(user);
}

export async function updateUser(id: number, input: Partial<{ name: string; email: string; password: string; systemRole: "ADMIN" | "USER"; status: "ACTIVE" | "INACTIVE" }>) {
  const current = await prisma.user.findUnique({ where: { id } });
  if (!current) throw new AppError("User not found.", 404);
  const removesActiveAdmin = current.systemRole === "ADMIN" && current.status === "ACTIVE" && (input.systemRole === "USER" || input.status === "INACTIVE");
  if (removesActiveAdmin && await prisma.user.count({ where: { systemRole: "ADMIN", status: "ACTIVE" } }) <= 1) throw new AppError("The final active administrator cannot be removed or deactivated.", 409);
  return toSafeUser(await prisma.user.update({ where: { id }, data: { name: input.name, email: input.email, systemRole: input.systemRole, status: input.status, passwordHash: input.password ? await bcrypt.hash(input.password, 12) : undefined } }));
}

export async function deactivateUser(id: number) { return updateUser(id, { status: "INACTIVE" }); }

export async function updateProfile(id: number, input: { name?: string; avatarUrl?: string | null }) {
  return toSafeUser(await prisma.user.update({ where: { id }, data: input }));
}

export async function changePassword(id: number, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  if (!await bcrypt.compare(currentPassword, user.passwordHash)) throw new AppError("Current password is incorrect.", 400);
  await prisma.user.update({ where: { id }, data: { passwordHash: await bcrypt.hash(newPassword, 12) } });
}
