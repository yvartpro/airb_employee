const swaggerJSDoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 5000;

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
    },

    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },

  apis: ["./routes/*.js"],
};

module.exports = {
  swaggerSpec: swaggerJSDoc(options)
};