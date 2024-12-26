

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "API documentation for authentication",
    },
    servers: [
      {
        url: "http://localhost:3000", // URL của API
      },
    ], 
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT", // Định dạng của token
          },
        },
      },
      security: [
        {
          bearerAuth: [], // Sử dụng bearerAuth làm mặc định cho tất cả các endpoint
        },
      ],
  },
  apis: ["./routes/*.js"], // Đường dẫn tới các file route có chú thích Swagger
};

module.exports = { swaggerOptions };
