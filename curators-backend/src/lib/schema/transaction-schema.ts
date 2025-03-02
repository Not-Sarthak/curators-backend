import { TransactionType, WithdrawalType } from '@prisma/client';

export const transactionResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    transactionType: { type: 'string', enum: Object.values(TransactionType) },
    transactionHash: { type: ['string', 'null'] },
    walletAddress: { type: 'string' },
    amountSol: { type: 'string' },
    actualAmountSol: { type: ['string', 'null'] },
    networkFeeSol: { type: ['string', 'null'] },
    conversionFeeSol: { type: ['string', 'null'] },
    withdrawalType: { type: ['string', 'null'], enum: [...Object.values(WithdrawalType), null] },
    lstMintAddress: { type: ['string', 'null'] },
    lstAmount: { type: ['string', 'null'] },
    conversionPriceSol: { type: ['string', 'null'] },
    status: { type: 'string' },
    errorMessage: { type: ['string', 'null'] },
    retryCount: { type: 'number' },
    confirmationCount: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const createWithdrawalBodySchema = {
  type: 'object',
  required: ['walletAddress', 'requestedAmountSol', 'withdrawalType'],
  properties: {
    walletAddress: { type: 'string' },
    requestedAmountSol: { type: 'string' },
    withdrawalType: { type: 'string', enum: Object.values(WithdrawalType) },
    lstMintAddress: { type: 'string' },
  },
};

export const withdrawalResponseSchema = transactionResponseSchema;

export const userWithdrawalsResponseSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    withdrawals: {
      type: 'array',
      items: transactionResponseSchema,
    },
    total: { type: 'number' },
  },
};

export const userTransactionsResponseSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    transactions: {
      type: 'array',
      items: transactionResponseSchema,
    },
    total: { type: 'number' },
  },
}; 

export const createDepositBodySchema = {
  type: 'object',
  required: ['walletAddress', 'amountSol'],
  properties: {
    walletAddress: { type: 'string' },
    transactionHash: { type: 'string' },
    amountSol: { type: 'string' },
    networkFeeSol: { type: 'string' },
  },
};

export const depositResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    transactionType: { type: 'string' },
    transactionHash: { type: ['string', 'null'] },
    walletAddress: { type: 'string' },
    amountSol: { type: 'string' },
    networkFeeSol: { type: ['string', 'null'] },
    status: { type: 'string' },
    confirmationCount: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const userDepositsResponseSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    deposits: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          transactionType: { type: 'string' },
          transactionHash: { type: ['string', 'null'] },
          walletAddress: { type: 'string' },
          amountSol: { type: 'string' },
          networkFeeSol: { type: ['string', 'null'] },
          status: { type: 'string' },
          errorMessage: { type: ['string', 'null'] },
          confirmationCount: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
    total: { type: 'number' },
  },
};

export const userIdParamSchema = {
  type: 'object',
  required: ['userId'],
  properties: {
    userId: { type: 'string' },
  },
}; 