import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.access_token as string | undefined;
  if (!token) {
    return next(new AppError("Authentication required.", 401));
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return next(new AppError("Invalid or expired session.", 401));
  }
}
