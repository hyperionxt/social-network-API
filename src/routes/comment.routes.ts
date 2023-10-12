import { Router } from "express";
import { authRequired } from "../middlewares/tokenValidator.middleware";
import { schemaValidator } from "../middlewares/schemaValidator.middleware";
import { createCommentSchema } from "../schemas/comment.schema";
import {
  createComments,
  createReply,
  deleteComments,
  getCommentOrReply,
  getCommentsByPost,
  updateComments,
} from "../controllers/comment.controller";
import { commentPermissions } from "../middlewares/autModAdm.middleware";

const router = Router();

router.get("/comments/:postId", getCommentsByPost);
router.get("/comment/:commentId", getCommentOrReply);
router.post(
  "/comment/:postId",
  authRequired,
  schemaValidator(createCommentSchema),
  createComments
);

router.post(
  "/comment/reply/:commentId/:postId",
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
