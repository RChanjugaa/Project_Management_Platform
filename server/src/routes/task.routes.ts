import { Router } from "express";
import { createTask, createTaskComment, deleteTask, getTask, getTasks, updateTask, updateTaskProgress } from "../controllers/task.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createTaskCommentSchema, createTaskSchema, taskIdSchema, updateTaskProgressSchema, updateTaskSchema } from "../validators/task.validator.js";

const router = Router();

router.use(authenticate);
router.get("/", getTasks);
router.post("/", validate(createTaskSchema), createTask);
router.get("/:id", validate(taskIdSchema), getTask);
router.patch("/:id", validate(updateTaskSchema), updateTask);
router.patch("/:id/progress", validate(updateTaskProgressSchema), updateTaskProgress);
router.delete("/:id", validate(taskIdSchema), deleteTask);
router.post("/:id/comments", validate(createTaskCommentSchema), createTaskComment);

export { router as taskRoutes };
