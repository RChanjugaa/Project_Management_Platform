import { Router } from "express";
import { getActivityLogs } from "../controllers/activity.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeSystemRoles } from "../middleware/authorize.js";
const router = Router();
router.get("/", authenticate, authorizeSystemRoles("ADMIN"), getActivityLogs);
export { router as activityRoutes };
