import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers';
import { ServiceRegistry } from '../../core/services';
import { 
  signInBodySchema, 
  verifyTokenBodySchema, 
  authResponseSchema 
} from '../../lib/schema/auth-schema';

export const registerAuthRoutes = (
  fastify: FastifyInstance,
  serviceRegistry: ServiceRegistry
) => {
  const authController = new AuthController(serviceRegistry);

  fastify.post('/auth/sign-in', {
    schema: {
      body: signInBodySchema,
      response: {
        200: authResponseSchema
      },
    },
    handler: authController.signIn,
  });

  fastify.post('/auth/verify-token', {
    schema: {
      body: verifyTokenBodySchema,
      response: {
        200: authResponseSchema
      },
    },
    handler: authController.verifyToken,
  });
}; 