import { Router } from "express";
import { getNotifications, readNotification } from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/authenticate.js";
const router = Router();
router.use(authenticate); router.get("/", getNotifications); router.patch("/:id/read", readNotification);
export { router as notificationRoutes };
