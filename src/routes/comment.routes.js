import { Router } from "express";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";
import { schemaValidator } from "../middlewares/schemaValidator.middleware.js";
import { createCommentSchema } from "../schemas/comment.schema.js";
import {
  createComments,
  createReply,
  deleteComments,
  getCommentOrReply,
  getCommentsByPost,
  updateComments,
} from "../controllers/comment.controller.js";
import { commentPermissions } from "../middlewares/autModAdm.middleware.js";

const router = Router();

router.get("/comments/:postId", getCommentsByPost);
router.get("/comment/:commentId", getCommentOrReply);
router.post(
  "/comments/:postId",
  authRequired,
  schemaValidator(createCommentSchema),
  createComments
);

router.post(
  "/comments/reply/:commentId/:postId",
  authRequired,
  schemaValidator(createCommentSchema),
  createReply
);
router.delete(
  "/comments/:commentId",
  authRequired,
  commentPermissions,
  deleteComments
);
router.put(
  "/comments/:commentId",
  authRequired,
  commentPermissions,
  schemaValidator(createCommentSchema),
  updateComments
);

export default router;
