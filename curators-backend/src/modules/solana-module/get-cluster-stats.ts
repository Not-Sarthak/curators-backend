import { Connection } from '@solana/web3.js';
import { ClusterStats } from '../../types';

export const getClusterStats = async (connection: Connection): Promise<ClusterStats> => {
  const [currentSlot, validators] = await Promise.all([
    connection.getSlot(),
    connection.getVoteAccounts(),
  ]);

  const blockTime = await connection.getBlockTime(currentSlot);
  const prevBlockTime = await connection.getBlockTime(currentSlot - 1);
  const averageBlockTime = blockTime && prevBlockTime ? blockTime - prevBlockTime : 0.4;

  return {
    currentSlot,
    transactionCount: await connection.getTransactionCount(),
    validatorCount: validators.current.length + validators.delinquent.length,
    clusterTime: blockTime || Date.now() / 1000,
    averageBlockTime,
  };
};
