import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.middleware.js";
import { signupSchema } from "../schemas/user.schema.js";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByUsername,
  getUsers,
  updateUser,
} from "../controllers/users.controller.js";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";
import {
  adminRequired,
  moderatorOrAdmin,
} from "../middlewares/roleValidator.middleware.js";

const router = Router();

router.get("/users", authRequired, adminRequired, getUsers);
router.get("/searchUser", authRequired, adminRequired, getUserByUsername);
router.get("/user/:id", authRequired, adminRequired, getUser);
router.post(
  "/user",
  authRequired,
  adminRequired,
  schemaValidator(signupSchema),
  createUser
);
router.put("/user/:id", authRequired, moderatorOrAdmin, updateUser);
router.delete("/user/:id", authRequired, adminRequired, deleteUser);

export default router;
