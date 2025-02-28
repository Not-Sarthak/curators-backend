import { FastifyInstance } from 'fastify';
import { NetworkController } from '../controllers';
import { ServiceRegistry } from '../../core/services';
import { networkDetailsResponseSchema } from '../../lib/schema/network-schema';

/**
 * Network routes
 * @param fastify The Fastify instance
 * @param serviceRegistry The service registry
 */
export const registerNetworkRoutes = (
  fastify: FastifyInstance,
  serviceRegistry: ServiceRegistry
) => {
  const networkController = new NetworkController(serviceRegistry);

  fastify.get('/network-details', {
    schema: {
      response: {
        200: networkDetailsResponseSchema
      }
    },
    handler: async (request, reply) => {
      try {
        const result = await networkController.getNetworkDetails(request, reply);
        if (!reply.sent) {
          reply.send(result);
        }
      } catch (error) {
        console.error('Error in Network-Details Handler:', error);
        if (!reply.sent) {
          reply.status(500).send({
            error: 'Internal Server Error',
            message: 'Failed To Get Network Details',
          });
        }
      }
    },
  });
}; 