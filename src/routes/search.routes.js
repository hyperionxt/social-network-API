import { Router } from "express";
import { searchPostOrCommunities } from "../models/search.controller.js";

const router = Router();

router.get("/search", searchPostOrCommunities);

export default router;
