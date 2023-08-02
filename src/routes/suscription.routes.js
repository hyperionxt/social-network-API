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
 *    summary: Create a new suscription
 *    tags: [Suscriptions]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Suscription'
 *    responses:
 *      200:
 *        description: The suscription was created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Community'
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
 *    summary: delete the suscription by its id.
 *    tags: [Suscriptions]
 *    parameters:
 *      - int: path
 *        name: id
 *        schema:
 *          type: ObjectId
 *        required: true
 *        description: The suscription id
 *    responses:
 *      200:
 *        description: The suscriptions was deleted
 *      404:
 *        description: The suscriptions was not found
 *
 *
 */
router.delete("/suscription/:id", authRequired, deleteSuscription);

export default router;
