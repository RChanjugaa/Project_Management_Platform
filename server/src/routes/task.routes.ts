import { Router } from "express";
import { createTask, createTaskComment, deleteTask, getTasks, updateTask, updateTaskProgress } from "../controllers/task.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { createTaskCommentSchema, createTaskSchema, taskIdSchema, updateTaskProgressSchema, updateTaskSchema } from "../validators/task.validator.js";

const router = Router();

router.use(authenticate);
router.get("/", getTasks);
router.post("/", authorizeRoles("ADMIN", "PROJECT_MANAGER"), validate(createTaskSchema), createTask);
router.patch("/:id", authorizeRoles("ADMIN", "PROJECT_MANAGER"), validate(updateTaskSchema), updateTask);
router.patch("/:id/progress", validate(updateTaskProgressSchema), updateTaskProgress);
router.delete("/:id", authorizeRoles("ADMIN", "PROJECT_MANAGER"), validate(taskIdSchema), deleteTask);
router.post("/:id/comments", validate(createTaskCommentSchema), createTaskComment);

export { router as taskRoutes };
