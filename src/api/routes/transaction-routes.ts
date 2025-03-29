import { FastifyInstance } from 'fastify';
import { TransactionController } from '../controllers';
import { ServiceRegistry } from '../../core/services';
import { createAuthMiddleware } from '../middlewares';
import { 
  createDepositBodySchema, 
  depositResponseSchema, 
  userDepositsResponseSchema, 
  userIdParamSchema
} from '../../lib/schema/transaction-schema';
import {
  createWithdrawalBodySchema,
  withdrawalResponseSchema,
  userWithdrawalsResponseSchema,
  userTransactionsResponseSchema
} from '../../lib/schema/transaction-schema';

/**
 * Transaction routes
 * @param fastify The Fastify instance
 * @param serviceRegistry The service registry
 */
export const registerTransactionRoutes = (
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
        201: depositResponseSchema
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

  fastify.post('/withdrawals', {
    preHandler: authMiddleware,
    schema: {
      body: createWithdrawalBodySchema,
      response: {
        201: withdrawalResponseSchema
      },
    },
    handler: transactionController.createWithdrawal,
  });

  fastify.get('/withdrawals/:userId', {
    preHandler: authMiddleware,
    schema: {
      params: userIdParamSchema,
      response: {
        200: userWithdrawalsResponseSchema
      },
    },
    handler: transactionController.getWithdrawalsForUser,
  });

  fastify.get('/transactions/:userId', {
    preHandler: authMiddleware,
    schema: {
      params: userIdParamSchema,
      response: {
        200: userTransactionsResponseSchema
      },
    },
    handler: transactionController.getTransactionsForUser,
  });
}; 