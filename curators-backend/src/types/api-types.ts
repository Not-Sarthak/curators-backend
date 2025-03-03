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
  apys: Record<string, number>;
  errs: Record<string, string>;
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
  inAmount: number;
  outputMint: string;
  outAmount: number;
  otherAmountThreshold: number;
  swapMode: "ExactIn" | "ExactOut";
  slippageBps: number;
  platformFee: any | null;
  priceImpactPct: number;
  routePlan: JupiterRoutePlan[];
  contextSlot: number;
  timeTaken: number;
}

export interface JupiterRoutePlan {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

export interface JupiterSwapTransaction {
  swapTransaction: string;
}

export interface JupiterSwapRequest {
  quoteResponse: JupiterSwapQuote;
  userPublicKey: string;
  wrapUnwrapSOL: boolean;
}
