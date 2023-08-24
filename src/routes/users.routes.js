import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
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
router.get("/users/:id", authRequired, adminRequired, getUser);
router.post("/users", authRequired, adminRequired, createUser);
router.put("/users/:id", authRequired, moderatorOrAdmin, updateUser);
router.delete("/users/:id", authRequired, adminRequired, deleteUser);

export default router;
