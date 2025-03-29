import { FastifyInstance } from 'fastify';
import { ServiceRegistry } from '../../core/services';
import { createAuthMiddleware } from '../middlewares';
import { SwapController } from '../controllers';
import { swapQuoteSchema, swapExecuteSchema, swapRoutesSchema } from '../../lib/schema/swap-schema';

/**
 * Swap routes
 * @param fastify The Fastify instance
 * @param serviceRegistry The service registry
 */
export const registerSwapRoutes = (
  fastify: FastifyInstance,
  serviceRegistry: ServiceRegistry
) => {
  const authMiddleware = createAuthMiddleware(serviceRegistry);
  const swapController = new SwapController();

  fastify.get('/swaps/quote', {
    preValidation: authMiddleware,
    schema: swapQuoteSchema,
    handler: swapController.getSwapQuote,
  });

  fastify.post('/swaps/execute', {
    preValidation: authMiddleware,
    schema: swapExecuteSchema,
    handler: swapController.executeSwap,
  });

  fastify.get('/swaps/routes', {
    onRequest: [authMiddleware],
    schema: swapRoutesSchema,
    handler: async (_, reply) => {
      return swapController.getAvailableRoutes(reply);
    }
  });
}; 