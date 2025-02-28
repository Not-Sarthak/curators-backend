import { FastifyInstance } from 'fastify';
import { SwapController } from '../controllers';
import { ServiceRegistry } from '../../core/services';
import { createAuthMiddleware } from '../middlewares';

/**
 * Swap routes
 * @param fastify The Fastify instance
 * @param serviceRegistry The service registry
 */
export const registerSwapRoutes = (
  fastify: FastifyInstance,
  serviceRegistry: ServiceRegistry
) => {
  const swapController = new SwapController(serviceRegistry);

  const authMiddleware = createAuthMiddleware(serviceRegistry);

  fastify.get('/swaps/quote', {
    preHandler: authMiddleware,
    schema: {
      querystring: {
        type: 'object',
        required: ['inputMint', 'outputMint', 'amount'],
        properties: {
          inputMint: { type: 'string' },
          outputMint: { type: 'string' },
          amount: { type: 'string' },
          slippageBps: { type: 'number' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            inputMint: { type: 'string' },
            outputMint: { type: 'string' },
            inputAmount: { type: 'string' },
            outputAmount: { type: 'string' },
            bestRoute: { type: 'string' },
            routes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  source: { type: 'string' },
                  inputAmount: { type: 'string' },
                  outputAmount: { type: 'string' },
                  fee: { type: 'number' },
                  priceImpact: { type: 'number' },
                },
              },
            },
            slippageBps: { type: 'number' },
            priceImpactPercent: { type: 'number' },
            fee: { type: 'number' },
            estimatedGas: { type: 'number' },
          },
        },
      },
    },
    handler: swapController.getSwapQuote,
  });

  fastify.post('/swaps/execute', {
    preHandler: authMiddleware,
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'sourceMint', 'destinationMint', 'amount'],
        properties: {
          userId: { type: 'string' },
          sourceMint: { type: 'string' },
          destinationMint: { type: 'string' },
          amount: { type: 'string' },
          route: { type: 'string' },
          slippageBps: { type: 'number' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            transactionHash: { type: ['string', 'null'] },
            sourceLstMint: { type: 'string' },
            sourceAmount: { type: 'string' },
            sourcePriceSol: { type: 'number' },
            sourceApy: { type: 'number' },
            destinationLstMint: { type: 'string' },
            destinationAmount: { type: ['string', 'null'] },
            destinationPriceSol: { type: 'number' },
            destinationApy: { type: 'number' },
            routeSource: { type: 'string' },
            quotedOutputAmount: { type: 'string' },
            actualOutputAmount: { type: ['string', 'null'] },
            networkFeeSol: { type: 'number' },
            protocolFeeSol: { type: 'number' },
            slippageBps: { type: 'number' },
            priceImpactPercent: { type: 'number' },
            expectedProfitSol: { type: 'number' },
            actualProfitSol: { type: ['number', 'null'] },
            status: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    handler: swapController.executeSwap,
  });

  fastify.get('/swaps/routes', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            routes: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    handler: swapController.getAvailableRoutes,
  });

  fastify.post('/swaps/deposit', {
    preHandler: authMiddleware,
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'amount'],
        properties: {
          userId: { type: 'string' },
          amount: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            transactionHash: { type: ['string', 'null'] },
            sourceLstMint: { type: 'string' },
            sourceAmount: { type: 'string' },
            sourcePriceSol: { type: 'number' },
            sourceApy: { type: 'number' },
            destinationLstMint: { type: 'string' },
            destinationAmount: { type: ['string', 'null'] },
            destinationPriceSol: { type: 'number' },
            destinationApy: { type: 'number' },
            routeSource: { type: 'string' },
            quotedOutputAmount: { type: 'string' },
            actualOutputAmount: { type: ['string', 'null'] },
            networkFeeSol: { type: 'number' },
            protocolFeeSol: { type: 'number' },
            slippageBps: { type: 'number' },
            priceImpactPercent: { type: 'number' },
            expectedProfitSol: { type: 'number' },
            actualProfitSol: { type: ['number', 'null'] },
            status: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    handler: swapController.handleUserDeposit,
  });

  fastify.get('/swaps/run-epoch-check', {
    preHandler: authMiddleware,
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: swapController.runEpochCheck,
  });
}; 