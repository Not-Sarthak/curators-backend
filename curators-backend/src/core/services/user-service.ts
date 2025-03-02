import { getUserPortfolio } from "../../modules/database-module/portfolio/get-user-portfolio";
import { getUserProfitHistory } from "../../modules/database-module/portfolio/get-user-profit";
import { getUserTransactions } from "../../modules/database-module/portfolio/get-user-transactions";
import { updatePortfolioAfterDeposit } from "../../modules/database-module/portfolio/update-portfolio-after-deposit";
import { updatePortfolioAfterWithdrawal } from "../../modules/database-module/portfolio/update-portfolio-after-withdrawal";
import { updatePortfolioAfterSwap } from "../../modules/database-module/portfolio/update-portfolio-after-swap";
import { SanctumService } from "./sanctum-service";

export class UserService {
  private readonly sanctumService: SanctumService;

  constructor(sanctumService: SanctumService) {
    this.sanctumService = sanctumService;
  }

  public async getUserPortfolio(userId: string) {
    return getUserPortfolio(userId, this.sanctumService);
  }

  public async getUserProfitHistory(userId: string) {
    return getUserProfitHistory(userId);
  }

  public async getUserTransactions(userId: string) {
    return getUserTransactions(userId);
  }

  public async updatePortfolioAfterDeposit(
    userId: string,
    depositAmount: number,
    lstMintAddress: string,
    lstAmount: number,
    lstPrice: number
  ) {
    return updatePortfolioAfterDeposit(userId, depositAmount, lstMintAddress, lstAmount, lstPrice);
  }

  public async updatePortfolioAfterWithdrawal(
    userId: string,
    withdrawalAmount: number,
    lstMintAddress: string,
    lstAmount: number,
    lstPrice: number
  ) {
    return updatePortfolioAfterWithdrawal(userId, withdrawalAmount, lstMintAddress, lstAmount, lstPrice);
  }

  public async updatePortfolioAfterSwap(
    userId: string,
    sourceLstMintAddress: string,
    sourceAmount: number,
    sourcePriceSol: number,
    destinationLstMintAddress: string,
    destinationAmount: number,
    destinationPriceSol: number
  ) {
    return updatePortfolioAfterSwap(
      userId,
      sourceLstMintAddress,
      sourceAmount,
      sourcePriceSol,
      destinationLstMintAddress,
      destinationAmount,
      destinationPriceSol
    );
  }
}
