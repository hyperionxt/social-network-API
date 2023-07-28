import { Router } from "express";
import { superUserRequired } from "../middlewares/tokenValidator.middleware.js";
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
  superUserRequired,
  schemaValidator(createCategorySchema),
  createCategory
);
router.delete("/category", superUserRequired, deleteCategory);
router.put("/category", superUserRequired, updateCategory);

export default router
