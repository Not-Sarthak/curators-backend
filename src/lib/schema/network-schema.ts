export const networkDetailsResponseSchema = {
  type: 'object',
  properties: {
    epochInfo: {
      type: 'object',
      properties: {
        epoch: { type: 'number' },
        slotIndex: { type: 'number' },
        slotsInEpoch: { type: 'number' },
        absoluteSlot: { type: 'number' },
        blockHeight: { type: 'number' },
        transactionCount: { type: 'number' },
      },
    },
    inflationRate: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        validator: { type: 'number' },
        foundation: { type: 'number' },
        epoch: { type: 'number' },
      },
    },
    epochProgress: { type: 'number' },
    timeRemainingInEpoch: { type: 'string' },
    baseSolStakingApy: { type: 'number' },
  },
}; 