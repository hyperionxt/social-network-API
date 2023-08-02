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

/**
 * @swagger
 * components:
 *    schemas:
 *      Category:
 *        type: object
 *        required:
 *            - title
 *        properties:
 *          id:
 *            type: ObjectId
 *            description: auto-generated id by mongodb of the category
 *          title:
 *            type: string
 *            description: category's title
 *          user:
 *            type: ObjectId
 *            description: category's author
 *          createdAt:
 *            type: Date
 *            description: category's creation date
 *          updatedAt:
 *            type: Date
 *            description: category's last update date
 *        example:
 *            _id: 4889873042ds093412
 *            title: category1
 *            user: aa5bd90af8cb4d3ce9498
 *            createdAt: 2022-01-01T00:00:00.000Z
 *            updatedAt: 2022-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/category/{id}:
 *    get:
 *      summary: Returns the a list of post by its category id.
 *      tags: [Categories]
 *      responses:
 *        200:
 *          description: The list of post
 *          content:
 *            application/json:
 *              schemas:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Category'
 *        500:
 *          description: Some server error
 */

/**
 * @swagger
 * tags:
 *  name: Categories
 *  description: The category managing API
 */

router.get("/category/:id", getPostsByCategory);

/**
 * @swagger
 * /api/category:
 *  post:
 *    summary: Create a new category
 *    tags: [Categories]
 *    security:
 *      - bearerAuth: []
 *        superuser: true  
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *    responses:
 *      200:
 *        description: The category was created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      500:
 *        description: Some server error
 */

router.post(
  "/new-category",
  authRequired,
  superUserRequired,
  schemaValidator(createCategorySchema),
  createCategory
);

/**
 * @swagger
 * /api/category/{id}:
 *  delete:
 *    summary: Delete the category by its id.
 *    tags: [Categories]
 *    security:
 *      - bearerAuth: []
 *        superuser: true
 *    parameters:
 *      - int: path
 *        name: id
 *        schema:
 *          type: ObjectId
 *        required: true
 *        description: The category id
 *    responses:
 *      200:
 *        description: The category was deleted
 *      404:
 *        description: The category was not found
 *      
 *  
 */
router.delete("/category/:id", authRequired, superUserRequired, deleteCategory);

/**
 * @swagger
 * /api/category/{id}:
 *  put:
 *    summary: Update the category by its id.
 *    tags: [Communities]
 *    secutiry:
 *      - bearerAuth: []
 *        superuser: true
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: ObjectId
 *         required: true
 *         description: The category id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *    responses:
 *      200:
 *        description: the category was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      404:
 *        description: the category was not found.
 *      500:
 *        description: some error server.
 *
 */


router.put("/category/:id", authRequired, superUserRequired, updateCategory);

export default router;
