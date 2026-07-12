import { Router } from "express";
import { adminDashboard, managerDashboard, memberDashboard } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";

const router = Router();

router.get("/admin", authenticate, authorizeRoles("ADMIN"), adminDashboard);
router.get("/manager", authenticate, authorizeRoles("PROJECT_MANAGER"), managerDashboard);
router.get("/member", authenticate, authorizeRoles("TEAM_MEMBER"), memberDashboard);

export { router as dashboardRoutes };
