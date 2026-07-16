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

export const getProject = asyncHandler(async (req: Request, res: Response) => { sendSuccess(res, "Project loaded.", { project: await projects.getProject(req.user!, Number(req.params.id)) }); });
export const addProjectMember = asyncHandler(async (req: Request, res: Response) => { sendSuccess(res, "Member added.", { project: await projects.addMember(req.user!, Number(req.params.id), req.body.userId, req.body.projectRole) }, 201); });
export const updateProjectMember = asyncHandler(async (req: Request, res: Response) => { sendSuccess(res, "Member role updated.", { project: await projects.changeMemberRole(req.user!, Number(req.params.id), Number(req.params.userId), req.body.projectRole) }); });
export const removeProjectMember = asyncHandler(async (req: Request, res: Response) => { await projects.removeMember(req.user!, Number(req.params.id), Number(req.params.userId)); sendSuccess(res, "Member removed.", null); });
export const getProjectWorkload = asyncHandler(async (req: Request, res: Response) => { sendSuccess(res, "Project workload loaded.", { workload: await projects.getWorkload(req.user!, Number(req.params.id)) }); });
