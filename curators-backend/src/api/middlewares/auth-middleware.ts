import { FastifyRequest, FastifyReply } from 'fastify';
import { ServiceRegistry } from '../../core/services';

/**
 * Authentication middleware
 * @param serviceRegistry The service registry
 * @returns The authentication middleware function
 */
export const createAuthMiddleware = (serviceRegistry: ServiceRegistry) => {
  const authService = serviceRegistry.getAuthService();

  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Get the authorization header
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return reply.status(401).send({ error: 'Authorization header is required' });
      }

      // Check if the header is in the correct format
      if (!authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Invalid authorization header format' });
      }

      // Extract the token
      const token = authHeader.substring(7);
      if (!token) {
        return reply.status(401).send({ error: 'Token is required' });
      }

      // Verify the token
      const decoded = authService.verifyToken(token);

      // Add the user ID to the request
      request.user = {
        userId: decoded.userId,
        walletAddress: decoded.walletAddress,
      };
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  };
};

// Extend the FastifyRequest interface to include the user property
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      walletAddress: string;
    };
  }
} 