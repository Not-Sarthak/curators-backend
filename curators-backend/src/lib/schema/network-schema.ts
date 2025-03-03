export const networkDetailsResponseSchema = {
  type: 'object',
  properties: {
    version: { type: 'string' },
    cluster: { type: 'string' },
    epochInfo: {
      type: 'object',
      properties: {
        current: {
          type: 'object',
          properties: {
            epoch: { type: 'number' },
            slotIndex: { type: 'number' },
            slotsInEpoch: { type: 'number' },
            absoluteSlot: { type: 'number' },
            blockHeight: { type: 'number' },
            transactionCount: { type: 'number' }
          }
        },
        progress: { type: 'number' },
        timeRemaining: { type: 'string' }
      }
    },
    inflation: {
      type: 'object',
      properties: {
        current: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            validator: { type: 'number' },
            foundation: { type: 'number' },
            epoch: { type: 'number' }
          }
        },
        baseSolStakingApy: { type: 'number' }
      }
    },
    stats: {
      type: 'object',
      properties: {
        currentSlot: { type: 'number' },
        transactionCount: { type: 'number' },
        validatorCount: { type: 'number' },
        clusterTime: { type: 'number' },
        averageBlockTime: { type: 'number' }
      }
    },
    supply: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        circulating: { type: 'number' },
        nonCirculating: { type: 'number' },
        maxSupply: { type: ['number', 'null'] }
      }
    },
    performance: {
      type: 'object',
      properties: {
        averageSlotTime: { type: 'number' },
        currentTps: { type: 'number' },
        maxTps: { type: 'number' },
        averageTps: { type: 'number' }
      }
    },
    health: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['healthy', 'degraded', 'down'] },
        lastUpdated: { type: 'string' }
      }
    }
  },
  additionalProperties: false
}; 