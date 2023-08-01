import { Router } from "express";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";
import { schemaValidator } from "../middlewares/schemaValidator.middleware.js";
import { createSuscriptionSchema } from "../schemas/suscription.schema.js";
import {
  createSuscription,
  deleteSuscription,
  getSuscriptions,
} from "../controllers/suscriptions.controller.js";

const router = Router();

router.get("/suscriptions", authRequired, getSuscriptions);
router.post(
  "/new-suscription",
  authRequired,
  schemaValidator(createSuscriptionSchema),
  createSuscription
);
router.delete("/suscription/:id", authRequired, deleteSuscription);

export default router;
