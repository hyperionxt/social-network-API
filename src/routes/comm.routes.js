import { Router } from "express";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";
import {
  createCommunity,
  deleteCommunity,
  getCommunities,
  getCommunity,
  updateCommunity,
} from "../controllers/comm.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.middleware.js";
import { createCommunitySchema } from "../schemas/community.schema.js";

const router = Router();

router.get("/communities", getCommunities);
router.get("/community/:id", getCommunity);
router.post(
  "/new-community",
  authRequired,
  schemaValidator(createCommunitySchema),
  createCommunity
);
router.delete("/community/:id", authRequired, deleteCommunity);
router.put("/community/:id", authRequired, updateCommunity);

export default router;
