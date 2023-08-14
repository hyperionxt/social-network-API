import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.middleware.js";
import {
  authRequired,
  passwordTokenRequired,
} from "../middlewares/tokenValidator.middleware.js";
import { signupSchema, signinSchema } from "../schemas/auth.schema.js";
import {
  signIn,
  signUp,
  signOut,
  profile,
  updateProfile,
  forgotPassword,
  newPassword,
} from "../controllers/auth.controller.js";
import { fileUploadCloudinary } from "../middlewares/fileUpload.middleware.js";

const router = Router();

/**
 * @swagger
 * components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *            - title
 *            - username
 *            - email
 *            - password
 *        properties:
 *          id:
 *            type: ObjectId
 *            description: auto-generated id by mongodb of the post
 *          username:
 *            type: string
 *            description: username of the user
 *          email:
 *            type: string
 *            description: email's user
 *          password:
 *            type: string
 *            description: password's user encrypted by bcryptjs
 *          description:
 *            type: string
 *            description: description's user.
 *          superuser:
 *            type: Boolean
 *            default: false
 *            description: If the user is a superuser or not
 *          createdAt:
 *            type: Date
 *            description: Post's creation date
 *          updatedAt:
 *            type: Date
 *            description: Post's last update date
 *        example:
 *            _id: 4889873042ds093412
 *            username: potato123
 *            email: potato123@gmail.com
 *            password: $2a$10$wRLYZidbB809xDNMiP4nxuVg0Jdl7RVTSU.4ADH0XB.uOeml3T3rS
 *            description: 32345b8c8f8cb4dsdsdj2
 *            createdAt: 2022-01-01T00:00:00.000Z
 *            updatedAt: 2022-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/signup:
 *    post:
 *      summary: register a new user
 *      tags: [Users]
 *      responses:
 *        200:
 *          description: new user registered
 *          content:
 *            application/json:
 *              schemas:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 *                token:
 *                  type: string
 *                  description: include this token in the header for protected endpoints.
 *        400:
 *          description: email or password arready exists.
 *        500:
 *          description: Some server error
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The suscription managing API
 */

router.post(
  "/signup",
  fileUploadCloudinary,
  schemaValidator(signupSchema),
  signUp
);

/**
 * @swagger
 * /api/signin:
 *  post:
 *    summary: user login
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: user logged in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *            token:
 *               type: string
 *               description: include this token in the header for protected endpoints.
 *      400:
 *          description: invalid credentials.
 *      500:
 *        description: Some server error
 */

router.post("/signin", schemaValidator(signinSchema), signIn);

/**
 * @swagger
 * /api/signout:
 *  post:
 *    summary: user logout
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: user logout and token deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'

 */

router.post("/signout", signOut);

/**
 * @swagger
 * /api/profile/{id}:
 *    get:
 *      summary: Get a user profile by its id
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: user information
 *          contens:
 *            application/json:
 *              schema:
 *                $ref:'#/components/schemas/Post'
 *        401:
 *          description: token invalid.
 *        404:
 *          description: User not found
 */

router.get("/profile/:id", authRequired, profile);

/**
 * @swagger
 * /api/profile/{id}:
 *  put:
 *    summary: Update profile
 *    tags: [Users]
 *    security:
 *       - bearerAuth: []
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: ObjectId
 *         required: true
 *         description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: the profile was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      401:
 *        description: token invalid.
 *      403:
 *        description: unauthorized, only owners's profile are allowed to update their profiles.
 *      404:
 *        description: user not found
 *      500:
 *        description: some error server.
 *
 */

router.put("/profile/:id", authRequired, fileUploadCloudinary, updateProfile);

router.post("/forgot-password", forgotPassword);

router.post(
  "/reset-password/:id/:token",
  passwordTokenRequired,
  newPassword
);

export default router;
