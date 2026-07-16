import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.access_token as string | undefined;
  if (!token) {
    return next(new AppError("Authentication required.", 401));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || user.status !== "ACTIVE") {
      return next(new AppError("Invalid or expired session.", 401));
    }
    req.user = { id: user.id, email: user.email, systemRole: user.systemRole, status: user.status };
    return next();
  } catch {
    return next(new AppError("Invalid or expired session.", 401));
  }
}
