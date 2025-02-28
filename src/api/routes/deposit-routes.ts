import { FastifyInstance } from 'fastify';
import { TransactionController } from '../controllers';
import { ServiceRegistry } from '../../core/services';
import { createAuthMiddleware } from '../middlewares';
import { 
  createDepositBodySchema, 
  depositResponseSchema, 
  userDepositsResponseSchema, 
  userIdParamSchema 
} from '../../lib/schema/transfers-schema';

export const registerDepositRoutes = (
  fastify: FastifyInstance,
  serviceRegistry: ServiceRegistry
) => {
  const transactionController = new TransactionController(serviceRegistry);

  const authMiddleware = createAuthMiddleware(serviceRegistry);

  fastify.post('/deposits', {
    preHandler: authMiddleware,
    schema: {
      body: createDepositBodySchema,
      response: {
        200: depositResponseSchema
      },
    },
    handler: transactionController.createDeposit,
  });

  fastify.get('/deposits/:userId', {
    preHandler: authMiddleware,
    schema: {
      params: userIdParamSchema,
      response: {
        200: userDepositsResponseSchema
      },
    },
    handler: transactionController.getDepositsForUser,
  });
}; 