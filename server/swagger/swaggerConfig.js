// server/swagger/swaggerConfig.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test Platform API',
      version: '1.0.0',
      description: 'API для тестирования и управления тестами и результатами',
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            role: { type: 'string', enum: ['teacher', 'student'] },
          },
        },
        Test: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            teacher: { $ref: '#/components/schemas/User' },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correctAnswer: { type: 'string' },
                  answerType: { type: 'string', enum: ['multiple', 'open'] },
                },
              },
            },
            url: { type: 'string' },
          },
        },
        Result: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            student: { $ref: '#/components/schemas/User' },
            test: { $ref: '#/components/schemas/Test' },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  questionId: { type: 'string' },
                  selectedAnswer: { type: 'string' },
                },
              },
            },
            score: { type: 'number' },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
