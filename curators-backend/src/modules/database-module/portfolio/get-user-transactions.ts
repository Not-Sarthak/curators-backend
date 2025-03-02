import prisma from '../../../lib/prisma';
import { UserTransaction } from '../../../types/database-types';

export async function getUserTransactions(userId: string): Promise<UserTransaction[]> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error(`User with ID ${userId} Not Found`);
    }

    const transactions = await prisma.explorer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((tx) => ({
      id: tx.id,
      userId: tx.userId,
      transactionType: tx.transactionType,
      transactionHash: tx.transactionHash ?? null,
      amountSol: Number(tx.amountSol),
      feeSol: Number(tx.feeSol),
      lstMintAddress: tx.lstMintAddress ?? null,
      lstAmount: tx.lstAmount ? Number(tx.lstAmount) : null,
      lstPriceSol: tx.lstPriceSol ? Number(tx.lstPriceSol) : null,
      portfolioValueBeforeSol: Number(tx.portfolioValueBeforeSol),
      portfolioValueAfterSol: Number(tx.portfolioValueAfterSol),
      profitImpactSol: tx.profitImpactSol ? Number(tx.profitImpactSol) : null,
      status: tx.status,
      confirmationCount: tx.confirmationCount,
      blockNumber: tx.blockNumber ? Number(tx.blockNumber) : null,
      blockTime: tx.blockTime ? Number(tx.blockTime) : null,
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
    }));
  } catch (error) {
    throw new Error(
      `Failed to get user transactions: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
