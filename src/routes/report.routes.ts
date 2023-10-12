import { Router } from "express";
import { authRequired } from "../middlewares/tokenValidator.middleware";
import { schemaValidator } from "../middlewares/schemaValidator.middleware";
import { createReportSchema } from "../schemas/report.schema";
import {
  createReport,
  getReports,
  getReportsById,
} from "../controllers/reports.controller";
import { moderatorOrAdmin } from "../middlewares/roleValidator.middleware";

const router = Router();

router.get("/reports", authRequired, getReports);

router.get("/report/:id", authRequired, moderatorOrAdmin, getReportsById);

router.post(
  "/report/:elementId/:userId",
  authRequired,
  schemaValidator(createReportSchema),
  createReport
);

export default router;
