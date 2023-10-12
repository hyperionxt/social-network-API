import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { LOCAL_PORT } from "../config";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "social network API",
      version: "1.0.0",
      description:
        "A simple social network API made by nodejs-express, mongoDB Atlas and Cloudinary as a cloud service image storage.",
    },
    servers: [
      {
        url: `http://localhost:${LOCAL_PORT}`,
      },
    ],
  },
  apis: ["src/routes/*.js"],
};

const specs = swaggerJsDoc(options);
export const swaggerServe = swaggerUI.serve;
export const swaggerSetup = swaggerUI.setup(specs);
