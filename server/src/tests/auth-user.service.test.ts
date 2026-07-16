import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(), findUniqueOrThrow: vi.fn(), update: vi.fn(), count: vi.fn(), create: vi.fn(), findMany: vi.fn(),
  signAccessToken: vi.fn(() => "signed-token"), recordActivity: vi.fn()
}));

vi.mock("../config/prisma.js", () => ({ prisma: { user: { findUnique: mocks.findUnique, findUniqueOrThrow: mocks.findUniqueOrThrow, update: mocks.update, count: mocks.count, create: mocks.create, findMany: mocks.findMany } } }));
vi.mock("../utils/jwt.js", () => ({ signAccessToken: mocks.signAccessToken }));
vi.mock("../services/activity.service.js", () => ({ recordActivity: mocks.recordActivity }));

import { getAuthenticatedUser, loginUser, toSafeUser } from "../services/auth.service.js";
import { changePassword, createUser, updateUser } from "../services/user.service.js";

const activeUser = { id: 1, name: "Admin", email: "admin@test.dev", passwordHash: "", systemRole: "ADMIN" as const, status: "ACTIVE" };

beforeEach(() => vi.clearAllMocks());

describe("authentication service", () => {
  it("never exposes passwordHash", () => { const storedUser = { ...activeUser, passwordHash: "secret" }; expect(toSafeUser(storedUser)).not.toHaveProperty("passwordHash"); });
  it("rejects an unknown email with 401", async () => { mocks.findUnique.mockResolvedValue(null); await expect(loginUser({ email: "none@test.dev", password: "password" })).rejects.toMatchObject({ statusCode: 401 }); });
  it("rejects an inactive user with 401", async () => { mocks.findUnique.mockResolvedValue({ ...activeUser, status: "INACTIVE" }); await expect(loginUser({ email: activeUser.email, password: "password" })).rejects.toMatchObject({ statusCode: 401 }); });
  it("rejects an incorrect password", async () => { mocks.findUnique.mockResolvedValue({ ...activeUser, passwordHash: await bcrypt.hash("correct-password", 4) }); await expect(loginUser({ email: activeUser.email, password: "wrong-password" })).rejects.toMatchObject({ statusCode: 401 }); });
  it("returns a safe user and token for valid credentials", async () => {
    mocks.findUnique.mockResolvedValue({ ...activeUser, passwordHash: await bcrypt.hash("correct-password", 4) }); mocks.update.mockResolvedValue(activeUser);
    const result = await loginUser({ email: activeUser.email, password: "correct-password" });
    expect(result.token).toBe("signed-token"); expect(result.user).not.toHaveProperty("passwordHash"); expect(mocks.update).toHaveBeenCalled(); expect(mocks.signAccessToken).toHaveBeenCalledWith(expect.objectContaining({ id: 1, systemRole: "ADMIN" }));
  });
  it("rejects a deleted authenticated user", async () => { mocks.findUnique.mockResolvedValue(null); await expect(getAuthenticatedUser(99)).rejects.toMatchObject({ statusCode: 401 }); });
});

describe("user service", () => {
  it("hashes a new user's password and returns safe data", async () => {
    mocks.create.mockImplementation(async ({ data }) => ({ id: 2, ...data }));
    const result = await createUser({ name: "Member", email: "member@test.dev", password: "Password123", systemRole: "USER", status: "ACTIVE" });
    expect(result).not.toHaveProperty("passwordHash"); const data = mocks.create.mock.calls[0][0].data; expect(data.passwordHash).not.toBe("Password123"); expect(await bcrypt.compare("Password123", data.passwordHash)).toBe(true);
  });
  it("protects the final active administrator", async () => {
    mocks.findUnique.mockResolvedValue(activeUser); mocks.count.mockResolvedValue(1);
    await expect(updateUser(1, { status: "INACTIVE" })).rejects.toMatchObject({ statusCode: 409 }); expect(mocks.update).not.toHaveBeenCalled();
  });
  it("allows an administrator change when another active admin exists", async () => {
    mocks.findUnique.mockResolvedValue(activeUser); mocks.count.mockResolvedValue(2); mocks.update.mockResolvedValue({ ...activeUser, systemRole: "USER" });
    await expect(updateUser(1, { systemRole: "USER" })).resolves.toMatchObject({ systemRole: "USER" });
  });
  it("requires the correct current password before changing it", async () => {
    mocks.findUniqueOrThrow.mockResolvedValue({ ...activeUser, passwordHash: await bcrypt.hash("old-password", 4) });
    await expect(changePassword(1, "wrong-password", "new-password")).rejects.toMatchObject({ statusCode: 400 });
  });
});
