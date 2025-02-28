export const portfolioResponseSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    walletAddress: { type: 'string' },
    totalDepositsSol: { type: 'number' },
    totalWithdrawalsSol: { type: 'number' },
    currentDepositSol: { type: 'number' },
    totalValueSol: { type: 'number' },
    unrealizedProfitSol: { type: 'number' },
    realizedProfitSol: { type: 'number' },
    totalProfitSol: { type: 'number' },
    profitPercentage: { type: 'number' },
    holdings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          lstMintAddress: { type: 'string' },
          symbol: { type: 'string' },
          name: { type: 'string' },
          amount: { type: 'number' },
          valueInSol: { type: 'number' },
          entryPriceSol: { type: 'number' },
          currentPriceSol: { type: 'number' },
          unrealizedProfitSol: { type: 'number' },
          profitPercentage: { type: 'number' },
          currentApy: { type: 'number' },
        },
      },
    },
  },
};

export const profitHistoryResponseSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string' },
      startValueSol: { type: 'number' },
      endValueSol: { type: 'number' },
      epochNumber: { type: 'number' },
      totalProfitSol: { type: 'number' },
      profitPercentage: { type: 'number' },
      bestPerformingLst: { type: ['string', 'null'] },
      bestLstApy: { type: ['number', 'null'] },
      worstPerformingLst: { type: ['string', 'null'] },
      worstLstApy: { type: ['number', 'null'] },
      epochStartTime: { type: 'string' },
      epochEndTime: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  },
};

export const transactionResponseSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    transactions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          transactionType: { type: 'string' },
          transactionHash: { type: ['string', 'null'] },
          referenceId: { type: 'string' },
          amountSol: { type: 'number' },
          feeSol: { type: 'number' },
          lstMintAddress: { type: ['string', 'null'] },
          lstAmount: { type: ['number', 'string', 'null'], nullable: true },
          lstPriceSol: { type: ['number', 'string', 'null'], nullable: true },
          portfolioValueBeforeSol: { type: 'number' },
          portfolioValueAfterSol: { type: 'number' },
          profitImpactSol: { type: ['number', 'string', 'null'], nullable: true },
          status: { type: 'string' },
          confirmationCount: { type: 'number' },
          blockNumber: { type: ['number', 'null'] },
          blockTime: { type: ['number', 'null'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};

export const userIdParamSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
  },
  required: ['userId'],
};
