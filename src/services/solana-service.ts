import { computeEpochData } from '../modules/solana-module/compute-epoch';
import { getEpochInfo } from '../modules/solana-module/get-epoch-info';
import { getInflationRate } from '../modules/solana-module/get-inflation-rate';
import { ComputedEpochData } from '../types';

/**
 * Service for interacting with the Solana blockchain
 */
export class SolanaService {
  public async getEpochInfo() {
    return getEpochInfo();
  }

  public async getInflationRate() {
    return getInflationRate();
  }

  public async getComputedEpochData(): Promise<ComputedEpochData> {
    const epochInfo = await getEpochInfo();
    const inflationRate = await getInflationRate();
    return computeEpochData(epochInfo, inflationRate);
  }
}
