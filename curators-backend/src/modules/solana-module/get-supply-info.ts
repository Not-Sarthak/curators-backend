import { Connection } from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SupplyInfo } from '../../types';

export const getSupplyInfo = async (connection: Connection): Promise<SupplyInfo> => {
  const supply = await connection.getSupply();
  return {
    total: Number((supply.value.total / LAMPORTS_PER_SOL).toFixed(2)),
    circulating: Number((supply.value.circulating / LAMPORTS_PER_SOL).toFixed(2)),
    nonCirculating: Number((supply.value.nonCirculating / LAMPORTS_PER_SOL).toFixed(2)),
    maxSupply: null,
  };
};
