/**
 * Created by user on 21.06.2018.
 */
const swaggerJSDoc = require('swagger-jsdoc');
// swagger definition
const swaggerDefinition = {
    info: {
        title: 'Node Swagger API',
        version: '1.0.0',
        description: 'Course work API',
    },
    host: `localhost:${3000}`,
    basePath: '/api/',
};

// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./src/routes/*.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;