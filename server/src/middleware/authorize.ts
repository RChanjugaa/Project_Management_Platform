import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";

export function authorizeSystemRoles(...roles: Array<"ADMIN" | "USER">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }
    if (!roles.includes(req.user.systemRole)) {
      return next(new AppError("You are not allowed to access this resource.", 403));
    }
    return next();
  };
}
