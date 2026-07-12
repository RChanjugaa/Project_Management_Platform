import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";

function placeholderStats(role: string) {
  return {
    role,
    statistics: {
      users: 0,
      projects: 0,
      tasks: 0,
      notifications: 0
    }
  };
}

export const adminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Administrator dashboard loaded.",
    data: placeholderStats("ADMIN")
  });
});

export const managerDashboard = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Project manager dashboard loaded.",
    data: placeholderStats("PROJECT_MANAGER")
  });
});

export const memberDashboard = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Team member dashboard loaded.",
    data: placeholderStats("TEAM_MEMBER")
  });
});
