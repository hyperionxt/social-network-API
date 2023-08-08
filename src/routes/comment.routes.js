import { Router } from "express";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";
import { schemaValidator } from "../middlewares/schemaValidator.middleware.js";
import { createCommentSchema } from "../schemas/comment.schema.js";
import {
  createComments,
  deleteComments,
  getComments,
  updateComments,
} from "../controllers/comment.controller.js";
const router = Router();

router.get("/comments/:communityId", getComments);
router.post(
  "/comments/:communityId",
  authRequired,
  schemaValidator(createCommentSchema),
  createComments
);
router.delete("/comments/:commentId", authRequired, deleteComments);
router.put("/comments/:commentId", authRequired, updateComments);


export default router;