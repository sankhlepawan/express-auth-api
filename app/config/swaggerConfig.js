const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "One Squaristic API",
      version: "1.0.0",
      description: "Automatically generated API docs",
    },
    servers: [
      {
        url: "http://localhost:8080", // change if needed
        description: "Local dev server",
      },
    ],
    components: {
      securitySchemes: {
        accessToken: {
          type: "apiKey",
          in: "header",
          name: "x-access-token",
          description: "Enter your JWT token",
        },
      },
    },
    security: [
      {
        accessToken: [],
      },
    ],
  },
  apis: ["./app/routes/*.js", "./app/controllers/*.js"], // use JSDoc comments here
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
