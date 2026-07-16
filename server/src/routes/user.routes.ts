import { Router } from "express";
import { changeOwnPassword, createUser, deactivateUser, getAssignableUsers, getUsers, updateOwnProfile, updateUser } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeSystemRoles } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { changePasswordSchema, createUserSchema, updateProfileSchema, updateUserSchema, userIdSchema } from "../validators/user.validator.js";

const router = Router();

router.use(authenticate);
router.patch("/me/profile", validate(updateProfileSchema), updateOwnProfile);
router.patch("/me/password", validate(changePasswordSchema), changeOwnPassword);
router.get("/assignable", getAssignableUsers);

router.use(authorizeSystemRoles("ADMIN"));
router.get("/", getUsers);
router.post("/", validate(createUserSchema), createUser);
router.patch("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", validate(userIdSchema), deactivateUser);

export { router as userRoutes };
