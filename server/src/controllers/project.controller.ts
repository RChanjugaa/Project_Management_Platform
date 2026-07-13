import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/response.js";
import * as projects from "../services/project.service.js";

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "Projects loaded.", { projects: await projects.listProjects(req.user!) });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "Project created.", { project: await projects.createProject(req.user!, req.body) }, 201);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "Project updated.", { project: await projects.updateProject(req.user!, Number(req.params.id), req.body) });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  await projects.deleteProject(req.user!, Number(req.params.id));
  sendSuccess(res, "Project deleted.", null);
});

export const assignProjectMembers = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "Project members updated.", {
    project: await projects.assignMembers(req.user!, Number(req.params.id), req.body.userIds)
  });
});
