import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/response.js";
import * as users from "../services/user.service.js";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, "Users loaded.", { users: await users.listUsers() });
});
export const updateOwnProfile = asyncHandler(async (req: Request, res: Response) => { sendSuccess(res, "Profile updated.", { user: await users.updateProfile(req.user!.id, req.body) }); });
export const changeOwnPassword = asyncHandler(async (req: Request, res: Response) => { await users.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword); sendSuccess(res, "Password changed.", null); });

export const getAssignableUsers = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, "Assignable users loaded.", { users: await users.listAssignableUsers() });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "User created.", { user: await users.createUser(req.body) }, 201);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "User updated.", { user: await users.updateUser(Number(req.params.id), req.body) });
});

export const deactivateUser = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "User deactivated.", { user: await users.deactivateUser(Number(req.params.id)) });
});
