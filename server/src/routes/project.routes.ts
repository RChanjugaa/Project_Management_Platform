import { Router } from "express";
import { assignProjectMembers, createProject, deleteProject, getProjects, updateProject } from "../controllers/project.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { assignProjectMembersSchema, createProjectSchema, projectIdSchema, updateProjectSchema } from "../validators/project.validator.js";

const router = Router();

router.use(authenticate);
router.get("/", getProjects);
router.post("/", authorizeRoles("ADMIN", "PROJECT_MANAGER"), validate(createProjectSchema), createProject);
router.patch("/:id", authorizeRoles("ADMIN", "PROJECT_MANAGER"), validate(updateProjectSchema), updateProject);
router.delete("/:id", authorizeRoles("ADMIN", "PROJECT_MANAGER"), validate(projectIdSchema), deleteProject);
router.post("/:id/members", authorizeRoles("ADMIN", "PROJECT_MANAGER"), validate(assignProjectMembersSchema), assignProjectMembers);

export { router as projectRoutes };
