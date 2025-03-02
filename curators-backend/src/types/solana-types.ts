// Solana Types

export interface EpochInfo {
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  absoluteSlot: number;
  blockHeight: number;
  transactionCount: number;
}

export interface ComputedEpochData {
  epochProgress: number;
  timeRemainingInEpoch: string;
  baseSolStakingApy: number;
}

export interface NetworkDetails {
  epochInfo: EpochInfo;
  inflationRate: InflationRate;
  epochProgress: number;
  timeRemainingInEpoch: string;
  baseSolStakingApy: number;
}

export interface InflationRate {
  total: number;
  validator: number;
  foundation: number;
  epoch: number;
}

export interface RpcResponse<T> {
  jsonrpc: string;
  id: string | number;
  result: T;
}

export interface RpcError {
  jsonrpc: string;
  id: string | number;
  error: {
    code: number;
    message: string;
    data?: any;
  };
}
