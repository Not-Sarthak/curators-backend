import { FastifyRequest, FastifyReply } from 'fastify';
import { ServiceRegistry } from '../../services';
import { SignInRequestDto, VerifyTokenRequestDto } from '../../types/auth-types';

/**
 * Authentication controller
*/
export class AuthController {
  private readonly serviceRegistry: ServiceRegistry;

  /**
   * Creates a new AuthController instance
   * @param serviceRegistry The service registry
  */
  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
  }

  /**
   * Signs in a user
   * @param request The request
   * @param reply The reply
   */
  public signIn = async (
    request: FastifyRequest<{ Body: SignInRequestDto }>,
    reply: FastifyReply
  ) => {
    try {
      const { walletAddress, signature } = request.body;
      const authService = this.serviceRegistry.getAuthService();
      const result = await authService.signIn(walletAddress, signature);
      
      return reply.status(200).send({
        user: {
          id: result.user.id,
          walletAddress: result.user.walletAddress,
          status: result.user.status,
        },
        token: result.token,
      });
    } catch (error) {
      console.error('Error Signing In:', error);
      return reply.status(400).send({
        error: 'Authentication Error',
        message: error instanceof Error ? error.message : 'Failed to sign in',
      });
    }
  };

  /**
   * Verifies a token
   * @param request The request
   * @param reply The reply
   */
  public verifyToken = async (
    request: FastifyRequest<{ Body: VerifyTokenRequestDto }>,
    reply: FastifyReply
  ) => {
    try {
      const { token } = request.body;
      const authService = this.serviceRegistry.getAuthService();
      const decoded = authService.verifyToken(token);
      const user = await authService.getUserById(decoded.userId);
      
      return reply.status(200).send({
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          status: user.status,
        },
        token,
      });
    } catch (error) {
      console.error('Error Verifying Token:', error);
      return reply.status(401).send({
        error: 'Authentication Error',
        message: error instanceof Error ? error.message : 'Failed to Verify Token',
      });
    }
  };
} 