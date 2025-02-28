export const createDepositBodySchema = {
  type: 'object',
  required: ['userId', 'walletAddress', 'transactionHash', 'amountSol'],
  properties: {
    userId: { type: 'string' },
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
    transactionHash: { type: 'string' },
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
          transactionHash: { type: 'string' },
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
  },
};

export const userIdParamSchema = {
  type: 'object',
  required: ['userId'],
  properties: {
    userId: { type: 'string' },
  },
}; 