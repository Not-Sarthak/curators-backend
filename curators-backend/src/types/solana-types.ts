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
  version: string;
  cluster: string;
  epochInfo: {
    current: EpochInfo;
    progress: number;
    timeRemaining: string;
  };
  inflation: {
    current: InflationRate;
    baseSolStakingApy: number;
  };
  stats: ClusterStats;
  supply: SupplyInfo;
  performance: NetworkPerformance;
  health: {
    status: 'healthy' | 'degraded' | 'down';
    lastUpdated: string;
  };
}

export interface InflationRate {
  total: number;
  validator: number;
  foundation: number;
  epoch: number;
}

export interface ClusterStats {
  currentSlot: number;
  transactionCount: number;
  validatorCount: number;
  clusterTime: number;
  averageBlockTime: number;
}

export interface SupplyInfo {
  total: number;
  circulating: number;
  nonCirculating: number;
  maxSupply: number | null;
}

export interface NetworkPerformance {
  averageSlotTime: number;
  currentTps: number;
  maxTps: number;
  averageTps: number;
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
