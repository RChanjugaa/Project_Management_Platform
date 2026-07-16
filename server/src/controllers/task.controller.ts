import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/response.js";
import * as tasks from "../services/task.service.js";

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "Tasks loaded.", { tasks: await tasks.listTasks(req.user!) });
});
export const getTask = asyncHandler(async (req: Request, res: Response) => { sendSuccess(res, "Task loaded.", { task: await tasks.getTask(req.user!, Number(req.params.id)) }); });

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "Task created.", { task: await tasks.createTask(req.user!, req.body) }, 201);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "Task updated.", { task: await tasks.updateTask(req.user!, Number(req.params.id), req.body) });
});

export const updateTaskProgress = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "Task progress updated.", { task: await tasks.updateTaskProgress(req.user!, Number(req.params.id), req.body) });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  await tasks.deleteTask(req.user!, Number(req.params.id));
  sendSuccess(res, "Task deleted.", null);
});

export const createTaskComment = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "Comment added.", { comment: await tasks.createComment(req.user!, Number(req.params.id), req.body.content) }, 201);
});
