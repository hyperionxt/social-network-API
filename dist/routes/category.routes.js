"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tokenValidator_middleware_1 = require("../middlewares/tokenValidator.middleware");
const catetgory_controller_js_1 = require("../controllers/catetgory.controller.js");
const schemaValidator_middleware_1 = require("../middlewares/schemaValidator.middleware");
const category_schema_1 = require("../schemas/category.schema");
const roleValidator_middleware_1 = require("../middlewares/roleValidator.middleware");
const router = (0, express_1.Router)();
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
router.get("/category/:id", catetgory_controller_js_1.getPostsByCategory);
router.get("/categories", catetgory_controller_js_1.getCategories);
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
router.post("/new-category", tokenValidator_middleware_1.authRequired, roleValidator_middleware_1.adminRequired, (0, schemaValidator_middleware_1.schemaValidator)(category_schema_1.createCategorySchema), catetgory_controller_js_1.createCategory);
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
router.delete("/category/:id", tokenValidator_middleware_1.authRequired, roleValidator_middleware_1.adminRequired, catetgory_controller_js_1.deleteCategory);
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
router.put("/category/:id", tokenValidator_middleware_1.authRequired, roleValidator_middleware_1.adminRequired, catetgory_controller_js_1.updateCategory);
exports.default = router;
