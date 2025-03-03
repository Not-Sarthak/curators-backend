export const swapQuoteSchema = {
  querystring: {
    type: 'object',
    required: ['inputMint', 'outputMint', 'amount'],
    properties: {
      userId: { type: 'string' },
      inputMint: { type: 'string' },
      outputMint: { type: 'string' },
      amount: { type: 'string' },
      slippageBps: { type: 'number' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        inputMint: { type: 'string' },
        inAmount: { type: 'string' },
        outputMint: { type: 'string' },
        outAmount: { type: 'string' },
        otherAmountThreshold: { type: 'string' },
        swapMode: { type: 'string' },
        slippageBps: { type: 'number' },
        platformFee: { type: ['object', 'null'] },
        priceImpactPct: { type: 'string' },
        routePlan: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              swapInfo: { type: 'object' },
              percent: { type: 'number' },
            },
          },
        },
        scoreReport: { type: ['object', 'null'] },
        contextSlot: { type: 'number' },
        timeTaken: { type: 'number' },
        swapUsdValue: { type: 'string' },
        simplerRouteUsed: { type: 'boolean' },
      },
      additionalProperties: true,
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    403: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

export const swapExecuteSchema = {
  body: {
    type: 'object',
    required: ['userId', 'inputMint', 'outputMint', 'amount'],
    properties: {
      userId: { type: 'string' },
      inputMint: { type: 'string' },
      outputMint: { type: 'string' },
      amount: { type: 'string' },
      slippageBps: { type: 'number' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        transactionHash: { type: ['string', 'null'] },
        sourceLstMint: { type: 'string' },
        sourceAmount: { type: 'string' },
        sourcePriceSol: { type: 'number' },
        sourceApy: { type: 'number' },
        destinationLstMint: { type: 'string' },
        destinationAmount: { type: ['string', 'null'] },
        destinationPriceSol: { type: 'number' },
        destinationApy: { type: 'number' },
        routeSource: { type: 'string' },
        quotedOutputAmount: { type: 'string' },
        actualOutputAmount: { type: ['string', 'null'] },
        networkFeeSol: { type: 'number' },
        protocolFeeSol: { type: 'number' },
        slippageBps: { type: 'number' },
        priceImpactPercent: { type: 'number' },
        expectedProfitSol: { type: 'number' },
        actualProfitSol: { type: ['number', 'null'] },
        status: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        transaction: { type: 'string' }
      },
    },
  },
};

export const swapRoutesSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        routes: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  },
};
