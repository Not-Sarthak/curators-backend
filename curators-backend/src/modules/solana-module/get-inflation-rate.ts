import axios from 'axios';
import { InflationRate, RpcResponse } from '../../types';
import { connection } from '../../config';

/**
 * Fetches the current inflation rate from the Solana blockchain
 * @returns The current inflation rate
 */
export const getInflationRate = async (): Promise<InflationRate> => {
  try {
    console.log('SolanaService: Fetching inflation rate...');

    const response = await axios.post<RpcResponse<InflationRate>>(
      connection.rpcEndpoint,
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'getInflationRate',
        params: [],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    console.log('SolanaService: Inflation rate response:', JSON.stringify(response.data.result));

    return {
      total: response.data.result.total,
      validator: response.data.result.validator,
      foundation: response.data.result.foundation,
      epoch: response.data.result.epoch,
    };
  } catch (error) {
    console.error('SolanaService: Error getting inflation rate:', error);
    throw new Error(`Failed to get inflation rate: ${error instanceof Error ? error.message : String(error)}`);
  }
};
