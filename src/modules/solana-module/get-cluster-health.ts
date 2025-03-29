import { Connection } from '@solana/web3.js';

export const checkClusterHealth = async (
  connection: Connection
): Promise<{ status: 'healthy' | 'degraded' | 'down'; lastUpdated: string }> => {
  try {
    const [blockHeight, currentSlot] = await Promise.all([
      connection.getBlockHeight(),
      connection.getSlot(),
    ]);

    const slotDifference = currentSlot - blockHeight;
    const status = slotDifference < 50 ? 'healthy' : slotDifference < 150 ? 'degraded' : 'down';

    return {
      status,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'down',
      lastUpdated: new Date().toISOString(),
    };
  }
};
