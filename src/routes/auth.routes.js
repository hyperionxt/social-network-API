import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.middleware.js";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";
import {signupSchema, signinSchema} from "../schemas/auth.schema.js";
import { signIn, signUp, signOut, profile, updateProfile} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", schemaValidator(signupSchema), signUp);
router.post("/signin", schemaValidator(signinSchema) ,signIn);
router.post("/signout", signOut);
router.get("/profile", authRequired, profile)
router.put("/profile/:id", authRequired, updateProfile)


export default router;
