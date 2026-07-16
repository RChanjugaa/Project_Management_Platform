import { Router } from "express";
import { addProjectMember, createProject, deleteProject, getProject, getProjectWorkload, getProjects, removeProjectMember, updateProject, updateProjectMember } from "../controllers/project.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { addProjectMemberSchema, createProjectSchema, projectIdSchema, projectMemberIdSchema, updateProjectMemberSchema, updateProjectSchema } from "../validators/project.validator.js";

const router = Router();

router.use(authenticate);
router.get("/", getProjects);
router.post("/", validate(createProjectSchema), createProject);
router.get("/:id", validate(projectIdSchema), getProject);
router.get("/:id/workload", validate(projectIdSchema), getProjectWorkload);
router.patch("/:id", validate(updateProjectSchema), updateProject);
router.delete("/:id", validate(projectIdSchema), deleteProject);
router.post("/:id/members", validate(addProjectMemberSchema), addProjectMember);
router.patch("/:id/members/:userId", validate(updateProjectMemberSchema), updateProjectMember);
router.delete("/:id/members/:userId", validate(projectMemberIdSchema), removeProjectMember);

export { router as projectRoutes };
