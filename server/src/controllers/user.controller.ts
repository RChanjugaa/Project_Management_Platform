import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/response.js";
import * as users from "../services/user.service.js";

export const getRoles = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, "Roles loaded.", { roles: await users.listRoles() });
});

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, "Users loaded.", { users: await users.listUsers() });
});

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
