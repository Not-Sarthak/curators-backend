import { FastifyInstance } from 'fastify';
import { NetworkController } from '../controllers';
import { networkDetailsResponseSchema } from '../../lib/schema/network-schema';

/**
 * Network routes
 * @param fastify The Fastify instance
 */
export const registerNetworkRoutes = (
  fastify: FastifyInstance,
) => {
  const networkController = new NetworkController();

  fastify.get('/network-details', {
    schema: {
      response: {
        200: networkDetailsResponseSchema,
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: async (request, reply) => {
      try {
        const result = await networkController.getNetworkDetails(request, reply);
        console.log("Result:", JSON.stringify(result, null, 2));
        await reply.status(200).send(result);
      } catch (error) {
        console.error('Error in Network-Details Handler:', error);
        await reply.status(500).send({
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Failed To Get Network Details',
        });
      }
    },
  });
};
