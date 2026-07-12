import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/async-handler.js";
import { getAuthenticatedUser, loginUser } from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.cookie("access_token", result.token, cookieOptions);
  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: { user: result.user }
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("access_token", cookieOptions);
  res.status(200).json({
    success: true,
    message: "Logout successful.",
    data: null
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getAuthenticatedUser(req.user!.id);
  res.status(200).json({
    success: true,
    message: "Authenticated user loaded.",
    data: { user }
  });
});
