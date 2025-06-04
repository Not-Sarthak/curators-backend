import { EpochInfo } from '../types';

// Implement Algorithm Here

export class ProfitabilityService {
  private readonly MIN_APY_IMPROVEMENT_THRESHOLD = 2.0;
  private readonly MAX_FEE_TO_YIELD_RATIO = 0.1;

  public calculateExpectedYield(amount: string, apy: number, epochInfo: EpochInfo): number {
    const amountNum = Number(amount);
    const apyDecimal = apy / 100; 
    
    const epochsPerYear = 365 * 0.5;
    const epochFraction = 1 / epochsPerYear;
    
    return amountNum * apyDecimal * epochFraction;
  }

  public isSwapProfitable(
    currentLstApy: number,
    newLstApy: number,
    amount: string,
    swapFees: number,
    epochInfo: EpochInfo
  ): { isProfitable: boolean; expectedProfit: number; reason?: string } {
    const apyImprovement = newLstApy - currentLstApy;
    if (apyImprovement < this.MIN_APY_IMPROVEMENT_THRESHOLD) {
      return {
        isProfitable: false,
        expectedProfit: 0,
        reason: `APY improvement (${apyImprovement.toFixed(2)}%) is below the minimum threshold (${this.MIN_APY_IMPROVEMENT_THRESHOLD}%)`,
      };
    }

    const currentYield = this.calculateExpectedYield(amount, currentLstApy, epochInfo);
    const newYield = this.calculateExpectedYield(amount, newLstApy, epochInfo);
    const yieldImprovement = newYield - currentYield;

    if (yieldImprovement <= swapFees) {
      return {
        isProfitable: false,
        expectedProfit: 0,
        reason: `Yield improvement (${yieldImprovement.toFixed(6)} SOL) does not cover swap fees (${swapFees.toFixed(6)} SOL)`,
      };
    }

    const epochsPerYear = 365 * 0.5; 
    const yearlyYieldImprovement = yieldImprovement * epochsPerYear;

    if (swapFees / yearlyYieldImprovement > this.MAX_FEE_TO_YIELD_RATIO) {
      return {
        isProfitable: false,
        expectedProfit: 0,
        reason: `Swap fees (${swapFees.toFixed(6)} SOL) are too high relative to yearly yield improvement (${yearlyYieldImprovement.toFixed(6)} SOL)`,
      };
    }

    const expectedProfit = yieldImprovement - swapFees;

    return {
      isProfitable: true,
      expectedProfit,
    };
  }
} 