import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";

export function authorizeRoles(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not allowed to access this resource.", 403));
    }
    return next();
  };
}
