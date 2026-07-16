import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/response.js";
import { listActivityLogs } from "../services/activity.service.js";
export const getActivityLogs = asyncHandler(async (req: Request, res: Response) => { sendSuccess(res, "Activity logs loaded.", await listActivityLogs(Number(req.query.page ?? 1), Math.min(Number(req.query.pageSize ?? 25), 100))); });
