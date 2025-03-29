/**
 * DTO (Data Transfer Object) type definitions for API endpoints
 */

import { TransactionType, WithdrawalType } from '@prisma/client';

/**
 * Transaction DTOs
 */
export interface CreateDepositRequestDto {
  walletAddress: string;
  amountSol: string;
  transactionHash?: string;
}

export interface CreateWithdrawalRequestDto {
  walletAddress: string;
  requestedAmountSol: string;
  withdrawalType: WithdrawalType;
  lstMintAddress?: string;
}

export interface TransactionResponseDto {
  id: string;
  userId: string;
  transactionType: TransactionType;
  walletAddress: string;
  amountSol: string;
  status: string;
  transactionHash?: string;
  
  // Withdrawal specific fields
  actualAmountSol?: string;
  withdrawalType?: WithdrawalType;
  
  // LST related fields
  lstMintAddress?: string;
  lstAmount?: string;
  conversionPriceSol?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface GetTransactionsResponseDto {
  userId: string;
  transactions: TransactionResponseDto[];
}

export interface GetDepositsResponseDto {
  userId: string;
  deposits: TransactionResponseDto[];
}

export interface GetWithdrawalsResponseDto {
  userId: string;
  withdrawals: TransactionResponseDto[];
}
