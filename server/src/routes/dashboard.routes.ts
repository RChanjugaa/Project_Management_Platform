import { Router } from "express";
import { adminDashboard, managerDashboard, memberDashboard } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeSystemRoles } from "../middleware/authorize.js";

const router = Router();

router.get("/admin", authenticate, authorizeSystemRoles("ADMIN"), adminDashboard);
router.get("/user", authenticate, managerDashboard);
router.get("/manager", authenticate, managerDashboard);
router.get("/member", authenticate, memberDashboard);

export { router as dashboardRoutes };
