import prisma from "../../../lib/prisma";
import { UserProfitHistory } from "../../../types/database-types";

export async function getUserProfitHistory(userId: string): Promise<UserProfitHistory[]> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error(`User with ID ${userId} not found`);

  const profitHistory = await prisma.epochProfit.findMany({
    where: { userId },
    orderBy: { epochEndTime: "desc" },
  });

  return profitHistory.map(entry => ({
    id: entry.id,
    userId: entry.userId,
    startValueSol: Number(entry.startValueSol),
    endValueSol: Number(entry.endValueSol),
    epochNumber: entry.epochNumber,
    totalProfitSol: Number(entry.totalProfitSol),
    profitPercentage: Number(entry.profitPercentage),
    bestPerformingLst: entry.bestPerformingLst,
    bestLstApy: entry.bestLstApy ? Number(entry.bestLstApy) : null,
    worstPerformingLst: entry.worstPerformingLst,
    worstLstApy: entry.worstLstApy ? Number(entry.worstLstApy) : null,
    epochStartTime: entry.epochStartTime.toISOString(),
    epochEndTime: entry.epochEndTime.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  }));
}
