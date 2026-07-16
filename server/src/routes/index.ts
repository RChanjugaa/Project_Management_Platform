import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { dashboardRoutes } from "./dashboard.routes.js";
import { projectRoutes } from "./project.routes.js";
import { taskRoutes } from "./task.routes.js";
import { userRoutes } from "./user.routes.js";
import { activityRoutes } from "./activity.routes.js";
import { notificationRoutes } from "./notification.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy.",
    data: {
      service: "project-team-management-api",
      status: "ok"
    }
  });
});

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/activity-logs", activityRoutes);
router.use("/notifications", notificationRoutes);

export { router as apiRoutes };
