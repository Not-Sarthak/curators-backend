import { FastifyInstance } from 'fastify';
import { TransactionController } from '../controllers';
import { ServiceRegistry } from '../../core/services';
import { createAuthMiddleware } from '../middlewares';

/**
 * Withdrawal routes
 * @param fastify The Fastify instance
 * @param serviceRegistry The service registry
 */
export const registerWithdrawalRoutes = (
  fastify: FastifyInstance,
  serviceRegistry: ServiceRegistry
) => {
  const transactionController = new TransactionController(serviceRegistry);

  const authMiddleware = createAuthMiddleware(serviceRegistry);

  fastify.post('/withdrawals', {
    preHandler: authMiddleware,
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'walletAddress', 'requestedAmountSol', 'withdrawalType'],
        properties: {
          userId: { type: 'string' },
          walletAddress: { type: 'string' },
          requestedAmountSol: { type: 'string' },
          withdrawalType: { type: 'string', enum: ['SOL', 'LST'] },
          lstMintAddress: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            transactionHash: { type: ['string', 'null'] },
            walletAddress: { type: 'string' },
            requestedAmountSol: { type: 'string' },
            actualAmountSol: { type: ['string', 'null'] },
            networkFeeSol: { type: ['string', 'null'] },
            conversionFeeSol: { type: ['string', 'null'] },
            withdrawalType: { type: 'string' },
            lstMintAddress: { type: ['string', 'null'] },
            lstAmount: { type: ['string', 'null'] },
            conversionPriceSol: { type: ['string', 'null'] },
            status: { type: 'string' },
            retryCount: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    handler: transactionController.createWithdrawal,
  });

  fastify.get('/withdrawals/:userId', {
    preHandler: authMiddleware,
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            withdrawals: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  transactionHash: { type: ['string', 'null'] },
                  walletAddress: { type: 'string' },
                  requestedAmountSol: { type: 'string' },
                  actualAmountSol: { type: ['string', 'null'] },
                  networkFeeSol: { type: ['string', 'null'] },
                  conversionFeeSol: { type: ['string', 'null'] },
                  withdrawalType: { type: 'string' },
                  lstMintAddress: { type: ['string', 'null'] },
                  lstAmount: { type: ['string', 'null'] },
                  conversionPriceSol: { type: ['string', 'null'] },
                  status: { type: 'string' },
                  errorMessage: { type: ['string', 'null'] },
                  retryCount: { type: 'number' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
    },
    handler: transactionController.getWithdrawalsForUser,
  });
}; 