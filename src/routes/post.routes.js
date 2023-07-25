import Router from "express";
import { getPosts } from "../controllers/post.controller.js";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";

const router = Router();

router.get("/index", getPosts);
router.get("/post/:id", authRequired, );
router.post("/new-post", authRequired, );
router.delete("/post/:id", authRequired, );
router.put("/post/:id", authRequired, );

export default router;
