import { FastifyRequest, FastifyReply } from 'fastify';
import { ServiceRegistry } from '../../core/services';
import { CreateDepositRequestDto, CreateWithdrawalRequestDto } from '../../types/dto-types';

/**
 * Transaction controller
 */
export class TransactionController {
  private readonly serviceRegistry: ServiceRegistry;

  /**
   * Creates a new TransactionController instance
   * @param serviceRegistry The service registry
   */
  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
  }

  /**
   * Creates a deposit
   * @param request The request
   * @param reply The reply
   */
  public createDeposit = async (
    request: FastifyRequest<{ Body: CreateDepositRequestDto }>,
    reply: FastifyReply
  ) => {
    try {
      const { walletAddress, amountSol, transactionHash } = request.body;
      
      // Convert amountSol from string to number
      const amountSolNumber = Number(amountSol);
      if (isNaN(amountSolNumber)) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Invalid amount provided',
        });
      }
      
      // Check if the user is authorized to create a deposit for this wallet
      if (request.user?.walletAddress !== walletAddress) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to create a deposit for this wallet',
        });
      }
      
      // Get the transaction service
      const transactionService = this.serviceRegistry.getTransactionService();
      
      // Create the deposit
      const deposit = await transactionService.createDeposit(
        request.user.userId,
        walletAddress,
        amountSolNumber,
        transactionHash
      );
      
      // Process the deposit
      const processedDeposit = await transactionService.processDeposit(deposit.id);
      
      // Return the deposit
      return reply.status(201).send(processedDeposit);
    } catch (error) {
      console.error('Error creating deposit:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to create deposit',
      });
    }
  };

  /**
   * Gets deposits for a user
   * @param request The request
   * @param reply The reply
   */
  public getDepositsForUser = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { userId } = request.params;
      
      // Check if the user is authorized to access these deposits
      if (request.user?.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to access these deposits',
        });
      }
      
      // Get the transaction service
      const transactionService = this.serviceRegistry.getTransactionService();
      
      // Get the deposits
      const deposits = await transactionService.getDepositsForUser(userId);
      
      // Return the deposits
      return reply.status(200).send({
        userId,
        deposits,
      });
    } catch (error) {
      console.error('Error getting deposits for user:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get deposits for user',
      });
    }
  };

  /**
   * Creates a withdrawal
   * @param request The request
   * @param reply The reply
   */
  public createWithdrawal = async (
    request: FastifyRequest<{ Body: CreateWithdrawalRequestDto }>,
    reply: FastifyReply
  ) => {
    try {
      const { walletAddress, requestedAmountSol, withdrawalType, lstMintAddress } = request.body;
      
      // Check if the user is authorized to create a withdrawal for this wallet
      if (request.user?.walletAddress !== walletAddress) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to create a withdrawal for this wallet',
        });
      }
      
      // Get the transaction service
      const transactionService = this.serviceRegistry.getTransactionService();
      
      // Create the withdrawal
      const withdrawal = await transactionService.createWithdrawal(
        request.user.userId,
        walletAddress,
        requestedAmountSol,
        withdrawalType,
        lstMintAddress
      );
      
      // Process the withdrawal
      const processedWithdrawal = await transactionService.processWithdrawal(withdrawal.id);
      
      // Return the withdrawal
      return reply.status(201).send(processedWithdrawal);
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to create withdrawal',
      });
    }
  };

  /**
   * Gets withdrawals for a user
   * @param request The request
   * @param reply The reply
   */
  public getWithdrawalsForUser = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { userId } = request.params;
      
      // Check if the user is authorized to access these withdrawals
      if (request.user?.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to access these withdrawals',
        });
      }
      
      // Get the transaction service
      const transactionService = this.serviceRegistry.getTransactionService();
      
      // Get the withdrawals
      const withdrawals = await transactionService.getWithdrawalsForUser(userId);
      
      // Return the withdrawals
      return reply.status(200).send({
        userId,
        withdrawals,
      });
    } catch (error) {
      console.error('Error getting withdrawals for user:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get withdrawals for user',
      });
    }
  };
} 