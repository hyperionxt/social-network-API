"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_PASS = exports.REDIS_LOCAL_PORT = exports.REDIS_DOCKER_PORT = exports.REDIS_HOST = exports.API_SECRET = exports.API_KEY = exports.CLOUD_NAME = exports.DOMAIN = exports.RESEND_API_KEY = exports.JWT_SECRET_KEY = exports.MONGODB_URI = exports.CLIENT = exports.LOCAL_PORT = exports.DOCKER_PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
//BACKEND PORT
exports.DOCKER_PORT = process.env.DOCKER_PORT;
exports.LOCAL_PORT = process.env.LOCAL_PORT;
//CLIENT DOMAIN
exports.CLIENT = process.env.CLIENT;
//MONGODB CONNECTION STRING
exports.MONGODB_URI = process.env.MONGODB_URI;
//SECRET KEY JWT
exports.JWT_SECRET_KEY = process.env.SECRET_KEY;
//RESEND CONFIG
exports.RESEND_API_KEY = process.env.RESEND_API_KEY;
exports.DOMAIN = process.env.DOMAIN;
//CLOUDINARY CONFIG
exports.CLOUD_NAME = process.env.CLOUD_NAME;
exports.API_KEY = process.env.API_KEY;
exports.API_SECRET = process.env.API_SECRET;
//REDIS CONFIG
exports.REDIS_HOST = process.env.REDIS_HOST;
exports.REDIS_DOCKER_PORT = process.env.REDIS_DOCKER_PORT;
exports.REDIS_LOCAL_PORT = process.env.REDIS_LOCAL_PORT;
exports.REDIS_PASS = process.env.REDIS_PASS;
