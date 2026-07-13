import { Router } from "express";
import { createUser, deactivateUser, getAssignableUsers, getRoles, getUsers, updateUser } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema, updateUserSchema, userIdSchema } from "../validators/user.validator.js";

const router = Router();

router.use(authenticate);
router.get("/assignable", authorizeRoles("ADMIN", "PROJECT_MANAGER"), getAssignableUsers);

router.use(authorizeRoles("ADMIN"));
router.get("/roles", getRoles);
router.get("/", getUsers);
router.post("/", validate(createUserSchema), createUser);
router.patch("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", validate(userIdSchema), deactivateUser);

export { router as userRoutes };
