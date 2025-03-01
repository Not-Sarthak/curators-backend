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
   * Creates a deposit transaction
   * @param request The request
   * @param reply The reply
   */
  public createDeposit = async (
    request: FastifyRequest<{ Body: CreateDepositRequestDto }>,
    reply: FastifyReply
  ) => {
    try {
      const { walletAddress, amountSol, transactionHash } = request.body;
      
      const amountSolNumber = Number(amountSol);
      if (isNaN(amountSolNumber)) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Invalid Amount Provided',
        });
      }
      
      if (request.user?.walletAddress !== walletAddress) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are Not Authorized to Create a Deposit for this Wallet',
        });
      }
      
      const transactionService = this.serviceRegistry.getTransactionService();
      
      const transaction = await transactionService.createDeposit(
        request.user.userId,
        walletAddress,
        amountSolNumber,
        transactionHash
      );
      
      const processedTransaction = await transactionService.processDeposit(transaction.id);
      
      return reply.status(201).send(processedTransaction);
    } catch (error) {
      console.error('Error Creating Deposit:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to Create Deposit',
      });
    }
  };

  /**
   * Gets deposit transactions for a user
   * @param request The request
   * @param reply The reply
   */
  public getDepositsForUser = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { userId } = request.params;
      
      if (request.user?.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to access these deposits',
        });
      }
      
      const transactionService = this.serviceRegistry.getTransactionService();
      
      const result = await transactionService.getDepositsForUser(userId);
      
      return reply.status(200).send(result);
    } catch (error) {
      console.error('Error getting deposits for user:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get deposits for user',
      });
    }
  };

  /**
   * Creates a withdrawal transaction
   * @param request The request
   * @param reply The reply
   */
  public createWithdrawal = async (
    request: FastifyRequest<{ Body: CreateWithdrawalRequestDto }>,
    reply: FastifyReply
  ) => {
    try {
      const { walletAddress, requestedAmountSol, withdrawalType, lstMintAddress } = request.body;
      
      if (request.user?.walletAddress !== walletAddress) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to create a withdrawal for this wallet',
        });
      }
      
      const amountSolNumber = Number(requestedAmountSol);
      if (isNaN(amountSolNumber) || amountSolNumber <= 0) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Invalid withdrawal amount provided',
        });
      }
      
      const transactionService = this.serviceRegistry.getTransactionService();
      
      const transaction = await transactionService.createWithdrawal(
        request.user.userId,
        walletAddress,
        amountSolNumber,
        withdrawalType,
        lstMintAddress
      );
      
      const processedTransaction = await transactionService.processWithdrawal(transaction.id);
      
      return reply.status(201).send(processedTransaction);
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to create withdrawal',
      });
    }
  };

  /**
   * Gets withdrawal transactions for a user
   * @param request The request
   * @param reply The reply
   */
  public getWithdrawalsForUser = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { userId } = request.params;
      
      if (request.user?.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to access these withdrawals',
        });
      }
      
      const transactionService = this.serviceRegistry.getTransactionService();
      
      const withdrawals = await transactionService.getWithdrawalsForUser(userId);
      
      return reply.status(200).send(withdrawals);
    } catch (error) {
      console.error('Error getting withdrawals for user:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get withdrawals for user',
      });
    }
  };

  /**
   * Gets all transactions for a user
   * @param request The request
   * @param reply The reply
   */
  public getTransactionsForUser = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { userId } = request.params;
      
      if (request.user?.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to access these transactions',
        });
      }
      
      const transactionService = this.serviceRegistry.getTransactionService();
      
      const result = await transactionService.getTransactionsForUser(userId);
      
      return reply.status(200).send(result);
    } catch (error) {
      console.error('Error getting transactions for user:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get transactions for user',
      });
    }
  };
} 