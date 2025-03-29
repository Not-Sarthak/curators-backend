import prisma from "../../../lib/prisma";
import { SanctumService } from "../../../core/services/sanctum-service";
import { UserPortfolio } from "../../../types/database-types";

export async function getUserPortfolio(userId: string, sanctumService: SanctumService): Promise<UserPortfolio> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { holdings: true },
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const holdingsWithCurrentValues = await Promise.all(
    user.holdings.map(async (holding) => {
      const priceResponse = await sanctumService.getLstPriceInSol([holding.lstMintAddress]);
      const currentPrice = Number(priceResponse[holding.lstMintAddress as keyof typeof priceResponse]);
      const currentValue = Number(holding.amount) * currentPrice;
      const unrealizedProfit = currentValue - (Number(holding.amount) * Number(holding.entryPriceSol));

      return {
        lstMintAddress: holding.lstMintAddress,
        amount: Number(holding.amount),
        entryPriceSol: Number(holding.entryPriceSol),
        currentPriceSol: currentPrice,
        currentValueSol: currentValue,
        unrealizedProfitSol: unrealizedProfit,
      };
    })
  );

  const totalValue = holdingsWithCurrentValues.reduce((sum, holding) => sum + holding.currentValueSol, 0);
  const totalUnrealizedProfit = holdingsWithCurrentValues.reduce((sum, holding) => sum + holding.unrealizedProfitSol, 0);
  const profitPercentage = Number(user.totalDepositsSol) > 0 ? (totalUnrealizedProfit / Number(user.totalDepositsSol)) * 100 : 0;

  return {
    user: {
      id: user.id,
      walletAddress: user.walletAddress,
      totalDepositsSol: Number(user.totalDepositsSol),
      totalWithdrawalsSol: Number(user.totalWithdrawalsSol),
      currentDepositSol: Number(user.currentDepositSol),
      totalValueSol: totalValue,
      unrealizedProfitSol: totalUnrealizedProfit,
      realizedProfitSol: Number(user.realizedProfitSol),
      totalProfitSol: totalUnrealizedProfit + Number(user.realizedProfitSol),
      profitPercentage,
      status: user.status,
    },
    holdings: holdingsWithCurrentValues,
  };
}
