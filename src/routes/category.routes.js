import { Router } from "express";
import {
  authRequired,
  superUserRequired,
} from "../middlewares/tokenValidator.middleware.js";
import {
  createCategory,
  deleteCategory,
  getPostsByCategory,
  updateCategory,
} from "../controllers/catetgory.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.middleware.js";
import { createCategorySchema } from "../schemas/category.schema.js";

const router = Router();

router.get("/category", getPostsByCategory);
router.post(
  "/new-category",
  authRequired,
  superUserRequired,
  schemaValidator(createCategorySchema),
  createCategory
);
router.delete("/category", authRequired, superUserRequired, deleteCategory);
router.put("/category", authRequired, superUserRequired, updateCategory);

export default router;
