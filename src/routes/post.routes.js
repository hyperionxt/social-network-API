import Router from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPostByCommunity,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";
import { validateSchema } from "../../../000_project_one/src/middlewares/validator.middleware.js";
import { createPostSchema } from "../schemas/post.schema.js";
import { postPermissions } from "../middlewares/autModAdm.middleware.js";
import { fileUploadMiddleware } from "../middlewares/fileUpload.middleware.js";

/**
 * @swagger
 * components:
 *    schemas:
 *      Post:
 *        type: object
 *        required:
 *            - title
 *        properties:
 *          id:
 *            type: ObjectId
 *            description: auto-generated id by mongodb of the post
 *          title:
 *            type: string
 *            description: Post's title
 *          user:
 *            type: ObjectId
 *            description: Post's author
 *          description:
 *            type: string
 *            description: Post's description
 *          community:
 *            type: ObjectId
 *            description: Post's community
 *          category:
 *            type: ObjectId
 *            description: Post's category or categories
 *          edited:
 *            type: Boolean
 *            description: If the post was edited or not
 *          createdAt:
 *            type: Date
 *            description: Post's creation date
 *          updatedAt:
 *            type: Date
 *            description: Post's last update date
 *        example:
 *            _id: 4889873042ds093412
 *            title: 10 min elden ring speedrun
 *            user: aa5bd90af8cb4d3ce9498
 *            category: [55d8b8c8f8cb4d3ce9498]
 *            community: 32345b8c8f8cb4dsdsdj2
 *            createdAt: 2022-01-01T00:00:00.000Z
 *            updatedAt: 2022-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/posts:
 *    get:
 *      summary: Returns the list of all the posts
 *      tags: [Posts]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: The list of posts
 *          content:
 *            application/json:
 *              schemas:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Post'
 *        500:
 *          description: Some server error
 */

/**
 * @swagger
 * tags:
 *  name: Posts
 *  description: The post managing API
 */

const router = Router();

router.get("/posts", getPosts);

router.get("/posts/community/:id", getPostByCommunity);

/**
 * @swagger
 * /api/post/{id}:
 *    get:
 *      summary: Get a post by id
 *      tags: [Posts]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *          type: ObjectId
 *          required: true
 *          description: The post id
 *      responses:
 *        200:
 *          description: The post information by id
 *          contens:
 *            application/json:
 *              schema:
 *                $ref:'#/components/schemas/Post'
 *        404:
 *          description: The post was not found
 */
router.get("/post/:id", getPost);

/**
 * @swagger
 * /api/post:
 *  post:
 *    summary: Create a new post
 *    tags: [Posts]
 *    secutiry:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: The post was created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      500:
 *        description: Some server error
 */
router.post(
  "/post/:id",
  authRequired,
  fileUploadMiddleware,
  validateSchema(createPostSchema),
  createPost
);

/**
 * @swagger
 * /api/post/{id}:
 *  delete:
 *    summary: Delete the post by its id.
 *    tags: [Posts]
 *    security:
 *      - bearerAuth: []
 *      - superuser: true
 *      - ownerAuth = []
 *    parameters:
 *      - int: path
 *        name: id
 *        schema:
 *          type: ObjectId
 *        required: true
 *        description: The post id
 *    responses:
 *      200:
 *        description: The post was deleted
 *      404:
 *        description: The post was not found
 *
 *
 */

router.delete("/post/:id", authRequired, postPermissions, deletePost);

/**
 * @swagger
 * /api/post/{id}:
 *  put:
 *    summary: Update the post by its id.
 *    tags: [Posts]
 *    security:
 *        - bearerAuth: []
 *        - superuser: true
 *        - ownerAuth = []
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: ObjectId
 *         required: true
 *         description: The post id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: the post was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      404:
 *        description: the post was not found.
 *      500:
 *        description: some error server.
 *
 */
router.put(
  "/post/:id/",
  authRequired,
  postPermissions,
  fileUploadMiddleware,
  updatePost
);

export default router;
