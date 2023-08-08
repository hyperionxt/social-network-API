import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "A simple Express blog API with communities that contains post and users can subcribes to the communities that they want.",
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
