import { solanaConnection } from '../../lib/solana';
import { EpochInfo } from '../../types';

/**
 * Fetches the current epoch information from the Solana blockchain
 * @returns The current epoch information
 */
export const getEpochInfo = async (): Promise<EpochInfo> => {
  try {
    const epochInfo = await solanaConnection.getEpochInfo();

    return {
      epoch: epochInfo.epoch,
      slotIndex: epochInfo.slotIndex,
      slotsInEpoch: epochInfo.slotsInEpoch,
      absoluteSlot: epochInfo.absoluteSlot,
      blockHeight: epochInfo.blockHeight || 0,
      transactionCount: epochInfo.transactionCount || 0,
    };
  } catch (error) {
    throw new Error(`Failed to get epoch info: ${error instanceof Error ? error.message : String(error)}`);
  }
};
