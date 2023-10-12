"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSetup = exports.swaggerServe = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("../config");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "social network API",
            version: "1.0.0",
            description: "A simple social network API made by nodejs-express, mongoDB Atlas and Cloudinary as a cloud service image storage.",
        },
        servers: [
            {
                url: `http://localhost:${config_1.LOCAL_PORT}`,
            },
        ],
    },
    apis: ["src/routes/*.js"],
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.swaggerServe = swagger_ui_express_1.default.serve;
exports.swaggerSetup = swagger_ui_express_1.default.setup(specs);
