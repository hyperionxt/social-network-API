import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
<<<<<<< HEAD:src/utils/swagger.js
import { LOCAL_PORT } from "../config.js";
=======
import { LOCAL_PORT } from "../config";
>>>>>>> ts:src/utils/swagger.ts

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "social network API",
      version: "1.0.0",
      description:
<<<<<<< HEAD:src/utils/swagger.js
        "Simple social network API made by nodejs-express.",
=======
        "A simple social network API made by nodejs-express, mongoDB Atlas and Cloudinary as a cloud service image storage.",
>>>>>>> ts:src/utils/swagger.ts
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


