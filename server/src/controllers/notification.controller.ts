import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/response.js";
import { listNotifications, markRead } from "../services/notification.service.js";
export const getNotifications = asyncHandler(async (req: Request, res: Response) => { sendSuccess(res, "Notifications loaded.", { notifications: await listNotifications(req.user!.id) }); });
export const readNotification = asyncHandler(async (req: Request, res: Response) => { sendSuccess(res, "Notification marked as read.", { notification: await markRead(req.user!.id, Number(req.params.id)) }); });
