// Sanctum Types

export interface SanctumLstsResponse {
  lsts: SanctumLst[];
}

export interface SanctumLst {
  mint: string;
  token_program: string;
  name: string;
  symbol: string;
  logo_uri: string;
  decimals: number;
  pool: SanctumPool;
}

export interface SanctumPool {
  program: string;
  pool: string;
  validator_list: string;
  vote_account: string;
}

export interface SanctumLstMetadata {
  Categories: string;
  "Feature ID": string;
  "First bullet point": string;
  "Launch Date": string;
  "Main value proposition": string;
  "Mint address": string;
  "Mint logo URL": string;
  "Mint name": string;
  "Mint symbol": string;
  "One-liner": string;
  Program: string;
  "Sanctum Automated": string;
  "Second bullet point": string;
  Status: string;
  "TG group link": string;
  "Third bullet point": string;
  Twitter: string;
  "Vote account": string;
  Website: string;
}

export interface SanctumApyResponse {
  apys: Record<string, number | null>;
  avgApys: Record<string, number | null>;
}

export interface SanctumPriceResponse {
  price: string;
}

export interface SanctumApyError {
  code: string; 
  message: string; 
}

export interface InceptionApyResponse {
  apys: Record<string, number>; 
  errs: Record<string, SanctumApyError>; 
}

// Jupiter Types

export interface JupiterSwapQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: "ExactIn" | "ExactOut";
  slippageBps: number;
  platformFee: any | null;
  priceImpactPct: string;
  routePlan: JupiterRoutePlan[];
  scoreReport: any | null;
  contextSlot: number;
  timeTaken: number;
  swapUsdValue: string;
  simplerRouteUsed: boolean;
}

export interface JupiterRoutePlan {
  swapInfo: any;
  percent: number;
}

export interface JupiterSwapTransaction {
  swapTransaction: string;
}

export interface JupiterSwapRequest {
  quoteResponse: JupiterSwapQuote;
  userPublicKey: string;
  dynamicComputeUnitLimit: boolean;
  dynamicSlippage: { maxBps: number };
  prioritizationFeeLamports: {
    priorityLevelWithMaxLamports: {
      maxLamports: number;
      priorityLevel: "veryHigh" | "high" | "medium" | "low";
    };
  };
}
