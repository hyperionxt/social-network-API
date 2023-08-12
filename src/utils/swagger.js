import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "social network API",
      version: "1.0.0",
      description: "A simple social network API made by nodejs-express and mongoDB with communities that contains post and users can subcribes to the communities.",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["src/routes/*.js"],
};

const specs = swaggerJsDoc(options);
export const swaggerServe = swaggerUI.serve;
export const swaggerSetup = swaggerUI.setup(specs);
