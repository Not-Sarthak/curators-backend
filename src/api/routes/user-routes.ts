import { FastifyInstance } from 'fastify';
import { ServiceRegistry } from '../../services';
import { createAuthMiddleware } from '../middlewares/auth-middleware';
import { getUserPortfolio } from '../../modules/database-module/portfolio/get-user-portfolio';
import { getUserProfitHistory } from '../../modules/database-module/portfolio/get-user-profit';
import { getUserTransactions } from '../../modules/database-module/portfolio/get-user-transactions';
import { portfolioResponseSchema, profitHistoryResponseSchema, transactionResponseSchema, userIdParamSchema } from '../../lib/schema/user-schema';

export const registerUserRoutes = (
  fastify: FastifyInstance,
  serviceRegistry: ServiceRegistry
) => {
  const authMiddleware = createAuthMiddleware(serviceRegistry);
  const sanctumService = serviceRegistry.getSanctumService();

  fastify.get('/users/portfolio/:userId', {
    preHandler: authMiddleware,
    schema: {
      params: userIdParamSchema,
      response: { 200: portfolioResponseSchema }
    },
    handler: async (request, reply) => {
      const { userId } = request.params as { userId: string };
      const result = await getUserPortfolio(userId, sanctumService);
      return reply.send(result);
    }
  });

  fastify.get('/users/profit-history/:userId', {
    preHandler: authMiddleware,
    schema: {
      params: userIdParamSchema,
      response: { 200: profitHistoryResponseSchema }
    },
    handler: async (request, reply) => {
      const { userId } = request.params as { userId: string };
      const result = await getUserProfitHistory(userId);
      return reply.send(result);
    }
  });

  fastify.get('/users/transactions/:userId', {
    preHandler: authMiddleware,
    schema: {
      params: userIdParamSchema,
      response: { 200: transactionResponseSchema }
    },
    handler: async (request, reply) => {
      const { userId } = request.params as { userId: string };
      const result = await getUserTransactions(userId);
      return reply.send(result);
    }
  });
};