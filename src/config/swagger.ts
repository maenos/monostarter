// swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for your API',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Remplacez ceci par l'URL de votre serveur
      },
    ],
  },
  apis: [
    '../*/*.routes.ts'
  ],
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: any) {
  app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
}
