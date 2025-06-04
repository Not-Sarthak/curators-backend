import { createDeposit } from '../modules/database-module/transfers/create-deposit';
import { processDeposit } from '../modules/database-module/transfers/process-deposit';
import { createWithdrawal } from '../modules/database-module/transfers/create-withdrawal';
import { processWithdrawal } from '../modules/database-module/transfers/process-withdrawal';
import { getDepositsForUser } from '../modules/database-module/transfers/get-user-deposits';
import { getWithdrawalsForUser } from '../modules/database-module/transfers/get-user-withdrawals';
import { getTransactionsForUser } from '../modules/database-module/transfers/get-user-transactions';
import { WithdrawalType, TransactionStatus } from '@prisma/client';
import prisma from '../lib/prisma';
/**
 * Service for managing transactions (deposits and withdrawals)
 */
export class TransactionService {
  /**
   * Creates a new deposit transaction
   */
  public async createDeposit(userId: string, walletAddress: string, amountSol: number, transactionHash?: string) {
    return await createDeposit(userId, walletAddress, amountSol, transactionHash);
  }

  /**
   * Processes a deposit transaction
   */
  public async processDeposit(transactionId: string) {
    return await processDeposit(transactionId);
  }

  /**
   * Gets deposit transactions for a user
   */
  public async getDepositsForUser(userId: string) {
    return await getDepositsForUser(userId);
  }

  /**
   * Creates a new withdrawal transaction
   */
  public async createWithdrawal(
    userId: string,
    walletAddress: string,
    amountSol: number,
    withdrawalType: WithdrawalType,
    lstMintAddress?: string
  ) {
    return await createWithdrawal(userId, walletAddress, amountSol, withdrawalType, lstMintAddress);
  }

  /**
   * Processes a withdrawal transaction
   */
  public async processWithdrawal(transactionId: string) {
    return await processWithdrawal(transactionId);
  }

  /**
   * Gets withdrawal transactions for a user
   */
  public async getWithdrawalsForUser(userId: string) {
    return await getWithdrawalsForUser(userId);
  }

  /**
   * Gets all transactions for a user
   */
  public async getTransactionsForUser(userId: string) {
    return await getTransactionsForUser(userId);
  }

  /**
   * Updates a deposit transaction with swap details
   * @param transactionId The deposit transaction ID
   * @param swapTxHash The swap transaction hash
   * @param lstMintAddress The LST mint address
   * @param usedMevProtection Whether MEV protection was used
   */
  public async updateDepositWithSwap(
    transactionId: string,
    swapTxHash: string,
    lstMintAddress: string,
    usedMevProtection: boolean
  ) {
    return await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: TransactionStatus.COMPLETED,
        confirmationCount: 32,
        lstToken: {
          connect: {
            mintAddress: lstMintAddress
          }
        },
        swapTransactionHash: swapTxHash,
        usedMevProtection,
      },
    });
  }
}
