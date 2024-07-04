const PORT = process.env.PORT || 3000;
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Backend project",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },


        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],

    },
    apis: ["./routes/*.js"],
};

module.exports = options