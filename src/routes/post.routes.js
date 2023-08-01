import Router from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";
import { validateSchema } from "../../../000_project_one/src/middlewares/validator.middleware.js";
import { createPostSchema } from "../schemas/post.schema.js";

const router = Router();

router.get("/posts", getPosts);
router.get("/post/:id", authRequired, getPost);
router.post(
  "/new-post",
  authRequired,
  validateSchema(createPostSchema),
  createPost
);
router.delete("/post/:id", authRequired, deletePost);
router.put("/post/:id", authRequired, updatePost);

export default router;
