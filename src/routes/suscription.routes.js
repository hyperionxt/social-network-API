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

/**
 * @swagger
 * components:
 *    schemas:
 *      Suscription:
 *        type: object
 *        required:
 *            - community
 *        properties:
 *          id:
 *            type: ObjectId
 *            description: auto-generated id by mongodb of the suscription
 *          user:
 *            type: ObjectId
 *            description: Suscription's author
 *          community:
 *            type: ObjectId
 *            description: Suscription's community
 *          createdAt:
 *            type: Date
 *            description: Suscription's creation date
 *          updatedAt:
 *            type: Date
 *            description: Suscription's last update date
 *        example:
 *            _id: 4889873042ds093412
 *            user: aa5bd90af8cb4d3ce9498
 *            community: 32345b8c8f8cb4dsdsdj2
 *            createdAt: 2022-01-01T00:00:00.000Z
 *            updatedAt: 2022-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/suscriptions:
 *    get:
 *      summary: Returns a list of the suscriptions's user
 *      tags: [Suscriptions]
 *      secutiry:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: The list of suscriptions
 *          content:
 *            application/json:
 *              schemas:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Suscriptions'
 *        500:
 *          description: Some server error
 */

/**
 * @swagger
 * tags:
 *  name: Suscriptions
 *  description: The suscription managing API
 */

router.get("/suscriptions", authRequired, getSuscriptions);

/**
 * @swagger
 * /api/suscription:
 *  post:
 *    summary: Create a new subscription
 *    tags: [Suscriptions]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: ObjectId
 *        required: true
 *        description: user id      
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              community:
 *                type: ObjectId
 *                description: The ID of the community for which the subscription is being created.
 *    responses:
 *      200:
 *        description: The subscription was created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Subscription'
 *      500:
 *        description: Some server error
 */

router.post(
  "/suscription",
  authRequired,
  schemaValidator(createSuscriptionSchema),
  createSuscription
);

/**
 * @swagger
 * /api/suscription/{id}:
 *  delete:
 *    summary: delete suscription
 *    tags: [Suscriptions]
 *    security:
 *      - bearerAuth: []
 *      - ownerAuth: []
 *    parameters:
 *      - in: path
 *        name: id 
 *        schema:
 *          type: ObjectId
 *        required: true
 *        description: The suscription id
 *      - in: query
 *        name: id
 *        schema:
 *          type: ObjectId
 *        required: true
 *        description: user id
 *    responses:
 *      200:
 *        description: The suscriptions was deleted
 *      404:
 *        description: The suscriptions was not found
 * 
 *  components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JSON Web Token (JWT) containing user information, including user ID and role.
 *
 *
 */
router.delete("/suscription/:id", authRequired, deleteSuscription);

export default router;
