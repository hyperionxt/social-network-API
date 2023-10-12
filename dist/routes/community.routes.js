"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tokenValidator_middleware_1 = require("../middlewares/tokenValidator.middleware");
const community_controller_1 = require("../controllers/community.controller");
const schemaValidator_middleware_1 = require("../middlewares/schemaValidator.middleware");
const community_schema_1 = require("../schemas/community.schema");
const fileUpload_middleware_1 = require("../middlewares/fileUpload.middleware");
const autModAdm_middleware_1 = require("../middlewares/autModAdm.middleware");
const router = (0, express_1.Router)();
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
router.get("/communities", community_controller_1.getCommunities);
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
router.get("/community/:id", community_controller_1.getCommunity);
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
router.post("/community", tokenValidator_middleware_1.authRequired, fileUpload_middleware_1.fileUploadMiddleware, (0, schemaValidator_middleware_1.schemaValidator)(community_schema_1.createCommunitySchema), community_controller_1.createCommunity);
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
router.delete("/community/:id", tokenValidator_middleware_1.authRequired, autModAdm_middleware_1.communityPermissions, community_controller_1.deleteCommunity);
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
router.put("/community/:id", tokenValidator_middleware_1.authRequired, autModAdm_middleware_1.communityPermissions, fileUpload_middleware_1.fileUploadMiddleware, community_controller_1.updateCommunity);
exports.default = router;
