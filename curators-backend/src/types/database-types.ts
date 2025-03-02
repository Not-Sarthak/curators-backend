export interface LstToken {
  mintAddress: string;
  token_program: string;
  name: string;
  symbol: string;
  imageUrl: string | null;
  decimals: number;
  currentApy: any | null;
  currentPriceSol: number | null;
  totalLiquiditySol: number | null;
  marketCapSol: number | null;
  avgApyOverHistory: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfitHistory {
  id: string;
  userId: string;
  startValueSol: number;
  endValueSol: number;
  epochNumber: number;
  totalProfitSol: number;
  profitPercentage: number;
  bestPerformingLst: string | null;
  bestLstApy: number | null;
  worstPerformingLst: string | null;
  worstLstApy: number | null;
  epochStartTime: string;
  epochEndTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserTransaction {
  id: string;
  userId: string;
  transactionType: string;
  transactionHash: string | null;
  amountSol: number;
  feeSol: number;
  lstMintAddress: string | null;
  lstAmount: number | null;
  lstPriceSol: number | null;
  portfolioValueBeforeSol: number;
  portfolioValueAfterSol: number;
  profitImpactSol: number | null;
  status: string;
  confirmationCount: number;
  blockNumber: number | null; 
  blockTime: number | null; 
  createdAt: string;
  updatedAt: string;
}

export interface UserPortfolio {
  user: {
    id: string;
    walletAddress: string;
    totalDepositsSol: number;
    totalWithdrawalsSol: number;
    currentDepositSol: number;
    totalValueSol: number;
    unrealizedProfitSol: number;
    realizedProfitSol: number;
    totalProfitSol: number;
    profitPercentage: number;
    status: string;
  };
  holdings: Holding[];
}

export interface Holding {
  lstMintAddress: string;
  amount: number;
  entryPriceSol: number;
  currentPriceSol: number;
  currentValueSol: number;
  unrealizedProfitSol: number;
}
