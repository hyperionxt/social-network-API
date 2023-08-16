import { Router } from "express";
import { authRequired } from "../middlewares/tokenValidator.middleware.js";
import {
  createCommunity,
  deleteCommunity,
  getCommunities,
  getCommunity,
  updateCommunity,
} from "../controllers/comm.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.middleware.js";
import { createCommunitySchema } from "../schemas/community.schema.js";
import { fileUploadMiddleware } from "../middlewares/fileUpload.middleware.js";

const router = Router();

/**
 * @swagger
 * components:
 *    schemas:
 *      Community:
 *        type: object
 *        required:
 *            - title
 *        properties:
 *          id:
 *            type: ObjectId
 *            description: auto-generated id by mongodb of the community
 *          title:
 *            type: string
 *            description: community's title
 *          user:
 *            type: ObjectId
 *            description: community's author
 *          description:
 *            type: string
 *            description: community's description
 *          comments:
 *            type: ObjectId
 *            description: community's comments
 *          category:
 *            type: ObjectId
 *            description: community's category or categories
 *          edited:
 *            type: Boolean
 *            description: If the community was edited or not
 *          createdAt:
 *            type: Date
 *            description: community's creation date
 *          updatedAt:
 *            type: Date
 *            description: community's last update date
 *        example:
 *            _id: 4889873042ds093412
 *            title: besto community in the world
 *            user: aa5bd90af8cb4d3ce9498
 *            category: [55d8b8c8f8cb4d3ce9498]
 *            comments: [32345b8c8f8cb4dsdsdj2]
 *            createdAt: 2022-01-01T00:00:00.000Z
 *            updatedAt: 2022-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/communities:
 *    get:
 *      summary: Returns the list of all the community
 *      tags: [Communities]
 *      responses:
 *        200:
 *          description: The list of Community
 *          content:
 *            application/json:
 *              schemas:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Community'
 *        500:
 *          description: Some server error
 */

/**
 * @swagger
 * tags:
 *  name: Communities
 *  description: The community managing API
 */

router.get("/communities", getCommunities);

/**
 * @swagger
 * /api/community/{id}:
 *    get:
 *      summary: Get a community by id
 *      tags: [Communities]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *          type: ObjectId
 *          required: true
 *          description: The community id
 *      responses:
 *        200:
 *          description: The community information by id
 *          contens:
 *            application/json:
 *              schema:
 *                $ref:'#/components/schemas/Community'
 *        404:
 *          description: The community was not found
 */

router.get("/community/:id", getCommunity);

/**
 * @swagger
 * /api/community:
 *  post:
 *    summary: Create a new community
 *    tags: [Communities]
 *    secutiry:
 *      - bearerAuth: []
 *      - superuser: true
 *      - ownerAuth = []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Community'
 *    responses:
 *      200:
 *        description: The Community was created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Community'
 *      401:
 *        description: unauthorized.
 *      500:
 *        description: Some server error
 */

router.post(
  "/community",
  authRequired,
  fileUploadMiddleware,
  schemaValidator(createCommunitySchema),
  createCommunity
);

/**
 * @swagger
 * /api/community/{id}:
 *  delete:
 *    summary: Delete the community by its id.
 *    tags: [Communities]
 *    secutiry:
 *      - bearerAuth: []
 *      - superuser: true
 *      - ownerAuth = []
 *    parameters:
 *      - int: path
 *        name: id
 *        schema:
 *          type: ObjectId
 *        required: true
 *        description: The community id
 *    responses:
 *      200:
 *        description: The community was deleted
 *      401:
 *        description: unauthorized.
 *      404:
 *        description: The community was not found
 *
 *
 */

router.delete("/community/:id", authRequired, deleteCommunity);

/**
 * @swagger
 * /api/community/{id}:
 *  put:
 *    summary: Update the community by its id.
 *    tags: [Communities]
 *    security:
 *      - bearerAuth: []
 *      - superuser: true
 *      - ownerAuth = []
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: ObjectId
 *         required: true
 *         description: The community id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Community'
 *    responses:
 *      200:
 *        description: the community was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Community'
 *      401:
 *        description: unauthorized.
 *      404:
 *        description: the community was not found.
 *      500:
 *        description: some error server.
 *
 */

router.put(
  "/community/:id",
  authRequired,
  fileUploadMiddleware,
  updateCommunity
);

export default router;
