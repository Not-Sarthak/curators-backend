/**
 * DTO (Data Transfer Object) type definitions for API endpoints
 */

import { WithdrawalType } from '@prisma/client';

/**
 * Deposit DTOs
 */
export interface CreateDepositRequestDto {
  walletAddress: string;
  amountSol: string;
  transactionHash?: string;
}

export interface DepositResponseDto {
  id: string;
  userId: string;
  walletAddress: string;
  amountSol: string;
  status: string;
  transactionHash?: string;
  createdAt: string;
}

export interface GetDepositsResponseDto {
  deposits: DepositResponseDto[];
  total: number;
}

/**
 * Withdrawal DTOs
 */
export interface CreateWithdrawalRequestDto {
  walletAddress: string;
  requestedAmountSol: string;
  withdrawalType: WithdrawalType;
  lstMintAddress?: string;
}

export interface WithdrawalResponseDto {
  id: string;
  userId: string;
  walletAddress: string;
  requestedAmountSol: string;
  actualAmountSol?: string;
  status: string;
  withdrawalType: WithdrawalType;
  lstMintAddress?: string;
  lstAmount?: string;
  createdAt: string;
}

export interface GetWithdrawalsResponseDto {
  withdrawals: WithdrawalResponseDto[];
  total: number;
}
