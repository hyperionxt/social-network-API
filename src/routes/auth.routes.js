import { Router } from "express";
import { validateSchema } from "../middlewares/schemaValidator.middleware.js";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";
import {signupSchema, signinSchema} from "../schemas/auth.schema.js";
import { signIn, signUp, signOut, profile, updateProfile} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", validateSchema(signupSchema), signUp);
router.post("/signin", validateSchema(signinSchema) ,signIn);
router.post("/signout", signOut);
router.get("/profile", authRequired, profile)
router.put("/profile/:id", authRequired, updateProfile)


export default router;
