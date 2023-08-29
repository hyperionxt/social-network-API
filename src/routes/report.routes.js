import { Router } from "express";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";
import { schemaValidator } from "../middlewares/schemaValidator.middleware.js";
import { createReportSchema } from "../schemas/report.schema.js";
import {
  createReport,
  getReports,
  getReportsById,
} from "../controllers/reports.controller.js";
import { moderatorOrAdmin } from "../middlewares/roleValidator.middleware.js";

const router = Router();

router.get("/reports", authRequired, getReports);

router.get("/report/:id", authRequired, moderatorOrAdmin, getReportsById);

router.post(
  "/report/:element/:id",
  authRequired,
  schemaValidator(createReportSchema),
  createReport
);

export default router;
