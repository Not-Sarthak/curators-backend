import { getEpochInfo } from './get-epoch-info';
import { getInflationRate } from './get-inflation-rate';
import { computeEpochData } from './compute-epoch';
import { NetworkDetails } from '../../types';
import { checkClusterHealth } from './get-cluster-health';
import { getClusterStats } from './get-cluster-stats';
import { getSupplyInfo } from './get-supply-info';
import { getNetworkPerformance } from './get-network-info';
import { connection } from '../../config';

/**
 * Gets comprehensive network details including epoch info, inflation rate, and computed metrics
 * @returns Network details including epoch, inflation, and computed metrics
 */
export const getNetwork = async (): Promise<NetworkDetails> => {
  try {
    const version = await connection.getVersion();
    const cluster = process.env.SOLANA_CLUSTER || 'mainnet-beta';
    const [
      epochInfo,
      inflationRate,
      clusterStats,
      supplyInfo,
      performance,
      health
    ] = await Promise.allSettled([
      getEpochInfo(),
      getInflationRate(),
      getClusterStats(connection),
      getSupplyInfo(connection),
      getNetworkPerformance(connection),
      checkClusterHealth(connection)
    ]);

    const response: NetworkDetails = {
      version: version ? `${version['solana-core']}` : 'unknown',
      cluster,
      epochInfo: {
        current: {
          epoch: 0,
          slotIndex: 0,
          slotsInEpoch: 432000,
          absoluteSlot: 0,
          blockHeight: 0,
          transactionCount: 0
        },
        progress: 0,
        timeRemaining: 'unknown'
      },
      inflation: {
        current: {
          total: 0,
          validator: 0,
          foundation: 0,
          epoch: 0
        },
        baseSolStakingApy: 0
      },
      stats: {
        currentSlot: 0,
        transactionCount: 0,
        validatorCount: 0,
        clusterTime: Date.now() / 1000,
        averageBlockTime: 0.4
      },
      supply: {
        total: 0,
        circulating: 0,
        nonCirculating: 0,
        maxSupply: null
      },
      performance: {
        averageSlotTime: 0.4,
        currentTps: 0,
        maxTps: 0,
        averageTps: 0
      },
      health: {
        status: 'down' as const,
        lastUpdated: new Date().toISOString()
      }
    };

    if (epochInfo.status === 'fulfilled' && inflationRate.status === 'fulfilled') {
      const computedData = computeEpochData(epochInfo.value, inflationRate.value);
      response.epochInfo = {
        current: epochInfo.value,
        progress: computedData.epochProgress,
        timeRemaining: computedData.timeRemainingInEpoch
      };
      response.inflation = {
        current: inflationRate.value,
        baseSolStakingApy: computedData.baseSolStakingApy
      };
    }

    if (clusterStats.status === 'fulfilled') {
      response.stats = clusterStats.value;
    }

    if (supplyInfo.status === 'fulfilled') {
      response.supply = supplyInfo.value;
    }

    if (performance.status === 'fulfilled') {
      response.performance = performance.value;
    }

    if (health.status === 'fulfilled') {
      response.health = health.value;
    }

    return response;
  } catch (error) {
    console.error('SolanaService: Error getting network details:', error);
    throw new Error(`Failed to get network details: ${error instanceof Error ? error.message : String(error)}`);
  }
}; 