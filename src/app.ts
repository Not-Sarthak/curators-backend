import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { PrismaClient } from '@prisma/client';
import { registerRoutes } from './api/routes';
import { ServiceRegistry } from './services';
import { config } from './config';

export const createApp = async (): Promise<FastifyInstance> => {
  const app = fastify({
    logger: {
      level: config.logLevel,
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  await app.register(cors, {
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'validator.app'],
      },
    },
  });
  const prisma = new PrismaClient();
  const serviceRegistry = new ServiceRegistry();

  registerRoutes(app, serviceRegistry);

  app.get('/health', async () => {
    return { status: 'OK', timestamp: new Date().toISOString() };
  });

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  return app;
}; 