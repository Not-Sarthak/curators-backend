import { FastifyRequest, FastifyReply } from 'fastify';
import { ServiceRegistry } from '../../core/services';
import { ExecuteSwapRequestDto } from '../../types/dto-types';

/**
 * Swap controller
 */
export class SwapController {
  private readonly serviceRegistry: ServiceRegistry;

  /**
   * Creates a new SwapController instance
   * @param serviceRegistry The service registry
   */
  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
  }

  /**
   * Gets a swap quote
   * @param request The request
   * @param reply The reply
   */
  public getSwapQuote = async (
    request: FastifyRequest<{ Querystring: { userId?: string, inputMint: string, outputMint: string, amount: string, slippageBps?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { inputMint, outputMint, amount, slippageBps } = request.query;
      const userId = request.query.userId || request.user?.userId;
      
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User ID is required',
        });
      }
      
      // Check if the user is authorized to get a swap quote for this user
      if (request.query.userId && request.user?.userId !== request.query.userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to get a swap quote for this user',
        });
      }
      
      // Get the swap service
      const swapService = this.serviceRegistry.getSwapService();
      
      // Get the swap quote
      const swapQuote = await swapService.getSwapQuote(
        userId,
        inputMint,
        outputMint,
        amount,
        slippageBps ? Number(slippageBps) : undefined
      );
      
      // Return the swap quote
      return reply.status(200).send(swapQuote);
    } catch (error) {
      console.error('Error getting swap quote:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return reply.status(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }
      
      if (error instanceof Error && error.message.includes('Insufficient balance')) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: error.message,
        });
      }
      
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get swap quote',
      });
    }
  };

  /**
   * Executes a swap
   * @param request The request
   * @param reply The reply
   */
  public executeSwap = async (
    request: FastifyRequest<{
      Body: {
        userId: string;
        sourceMint: string;
        destinationMint: string;
        amount: string;
        route?: string; // Make route optional since we'll always use Jupiter
        slippageBps?: number;
      };
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { userId, sourceMint, destinationMint, amount, slippageBps } = request.body;
      
      // Check if the user is authorized to execute a swap for this user
      if (request.user?.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to execute a swap for this user',
        });
      }
      
      // Get the swap service
      const swapService = this.serviceRegistry.getSwapService();
      
      // Execute the swap (always using Jupiter)
      const swap = await swapService.executeSwap(
        userId,
        sourceMint,
        destinationMint,
        amount,
        'JUPITER', // Always use Jupiter
        slippageBps
      );
      
      // Return the swap
      return reply.status(200).send(swap);
    } catch (error) {
      console.error('Error executing swap:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return reply.status(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }
      
      if (error instanceof Error && error.message.includes('Insufficient balance')) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: error.message,
        });
      }
      
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to execute swap',
      });
    }
  };

  /**
   * Analyzes all portfolios for profitable swaps
   * @param request The request
   * @param reply The reply
   */
  public analyzeAllPortfoliosForProfitableSwaps = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      // Get the swap service
      const swapService = this.serviceRegistry.getSwapService();
      
      // Analyze all portfolios for profitable swaps
      await swapService.analyzeAllPortfoliosForProfitableSwaps();
      
      // Return success
      return reply.status(200).send({
        message: 'Successfully analyzed all portfolios for profitable swaps',
      });
    } catch (error) {
      console.error('Error analyzing all portfolios for profitable swaps:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to analyze all portfolios for profitable swaps',
      });
    }
  };

  /**
   * Checks for stop-loss triggers
   * @param request The request
   * @param reply The reply
   */
  public checkStopLossTriggers = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      // Get the swap service
      const swapService = this.serviceRegistry.getSwapService();
      
      // Check for stop-loss triggers
      await swapService.checkStopLossTriggers();
      
      // Return success
      return reply.status(200).send({
        message: 'Successfully checked for stop-loss triggers',
      });
    } catch (error) {
      console.error('Error checking for stop-loss triggers:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to check for stop-loss triggers',
      });
    }
  };

  /**
   * Gets available swap routes
   * @param request The request
   * @param reply The reply
   */
  public getAvailableRoutes = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      // Return only Jupiter as the available route
      return reply.status(200).send({
        routes: ['JUPITER']
      });
    } catch (error) {
      console.error('Error getting available routes:', error);
      
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get available routes',
      });
    }
  };

  /**
   * Handles a user deposit
   * @param request The request
   * @param reply The reply
   */
  public handleUserDeposit = async (
    request: FastifyRequest<{ Body: { userId: string, amount: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { userId, amount } = request.body;
      
      // Check if the user is authorized to handle a deposit for this user
      if (request.user?.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to handle a deposit for this user',
        });
      }
      
      // Get the swap service
      const swapService = this.serviceRegistry.getSwapService();
      
      // Handle the user deposit
      const result = await swapService.handleUserDeposit(userId, amount);
      
      // Return the result
      return reply.status(200).send(result);
    } catch (error) {
      console.error('Error handling user deposit:', error);
      
      if (error instanceof Error && error.message.includes('No verified LSTs available')) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: error.message,
        });
      }
      
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to handle user deposit',
      });
    }
  };

  /**
   * Manually triggers an epoch check for all users
   * @param request The request
   * @param reply The reply
   */
  public runEpochCheck = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const swapService = this.serviceRegistry.getSwapService();
      
      await swapService.runEpochCheck();
      
      return reply.status(200).send({
        message: 'Successfully ran epoch check for all users',
      });
    } catch (error) {
      console.error('Error running epoch check:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to run epoch check',
      });
    }
  };
} 