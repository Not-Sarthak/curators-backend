import { FastifyRequest, FastifyReply } from 'fastify';
import { ServiceRegistry } from '../../core/services';

/**
 * Network controller
 */
export class NetworkController {
  private readonly serviceRegistry: ServiceRegistry;

  /**
   * Creates a new NetworkController instance
   * @param serviceRegistry The service registry
   */
  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
  }

  /**
   * Gets network details
   * @param request The request
   * @param reply The reply
   */
  public getNetworkDetails = async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    try {
      console.log('NetworkController: Starting getNetworkDetails');
      
      // Get the network service
      const networkService = this.serviceRegistry.getNetworkService();
      console.log('NetworkController: Got NetworkService');
      
      // Get network details
      console.log('NetworkController: Fetching network details...');
      const networkDetails = await networkService.getNetworkDetails();
      console.log('NetworkController: Network details received:', JSON.stringify(networkDetails));
      
      // Return the network details
      console.log('NetworkController: Sending response...');
      reply.status(200).send(networkDetails);
      console.log('NetworkController: Response sent');
    } catch (error) {
      console.error('NetworkController: Error getting network details:', error);
      reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get network details',
      });
    }
  };

  /**
   * Gets the health status of the system
   * @param request The request
   * @param reply The reply
   */
  public getHealthStatus = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      // Get the network service
      const networkService = this.serviceRegistry.getNetworkService();
      
      // Get the health status
      const healthStatus = await networkService.getHealthStatus();
      
      // Return the health status with the appropriate status code
      const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
      return reply.status(statusCode).send(healthStatus);
    } catch (error) {
      console.error('Error getting health status:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get health status',
      });
    }
  };
} 