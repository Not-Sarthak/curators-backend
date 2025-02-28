import { EpochInfo } from '@solana/web3.js';

export const generateQueryParams = (symbols: string[], paramName = 'lst'): string => {
  if (!symbols.length) {
    throw new Error('No Symbols Provided');
  }

  return symbols.map((symbol) => `${paramName}=${encodeURIComponent(symbol)}`).join('&');
};

export const formatTimeRemaining = (timeRemainingSeconds: number): string => {
  const days = Math.floor(timeRemainingSeconds / (24 * 60 * 60));
  const hours = Math.floor((timeRemainingSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeRemainingSeconds % (60 * 60)) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ') || 'less than 1m';
};

/**
 * Calculates the estimated time remaining in the current epoch
 * @param epochInfo The current epoch information
 * @returns The estimated time remaining in seconds
 */
export const calculateTimeRemainingInEpoch = (epochInfo: EpochInfo): number => {
  const slotsRemaining = epochInfo.slotsInEpoch - epochInfo.slotIndex;
  // Solana's average slot time is ~400ms
  const averageSlotTimeMs = 400;
  return (slotsRemaining * averageSlotTimeMs) / 1000;
};

/**
 * Calculates the progress of the current epoch as a percentage
 * @param epochInfo The current epoch information
 * @returns The progress as a percentage string
 */
export const calculateEpochProgress = (epochInfo: EpochInfo): string => {
  const progress = (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100;
  return progress.toFixed(2);
};

export const parseSolanaPrivateKey = (key: string | undefined): Uint8Array | null => {
  try {
    if (!key) return null;
    const parsedKey = JSON.parse(key);
    if (!Array.isArray(parsedKey)) throw new Error('Invalid private key format');
    return new Uint8Array(parsedKey);
  } catch (error) {
    console.error('❌ Invalid SOLANA_WALLET_PRIVATE_KEY format. Expected a JSON array.');
    process.exit(1);
  }
};
