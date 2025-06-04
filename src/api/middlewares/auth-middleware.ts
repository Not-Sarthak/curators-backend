import { FastifyRequest, FastifyReply } from 'fastify';
import { ServiceRegistry } from '../../services';

/**
 * Authentication middleware
 * @param serviceRegistry The service registry
 * @returns The authentication middleware function
 */
export const createAuthMiddleware = (serviceRegistry: ServiceRegistry) => {
  const authService = serviceRegistry.getAuthService();

  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return reply.status(401).send({ error: 'Authorization Header' });
      }

      if (!authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Invalid Auth Header Format' });
      }

      // Extract the Token
      const token = authHeader.substring(7);
      if (!token) {
        return reply.status(401).send({ error: 'Token is Required' });
      }

      const decoded = authService.verifyToken(token);

      request.user = {
        userId: decoded.userId,
        walletAddress: decoded.walletAddress,
      };
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  };
};

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      walletAddress: string;
    };
  }
} 