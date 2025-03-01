import prisma from '../../../lib/prisma';
import { TransactionType, TransactionStatus, WithdrawalType } from '@prisma/client';

export async function createWithdrawal(
  userId: string,
  walletAddress: string,
  amountSol: number,
  withdrawalType: WithdrawalType,
  lstMintAddress?: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || amountSol > Number(user.currentDepositSol)) {
    throw new Error(`Insufficient funds`);
  }

  if (withdrawalType === WithdrawalType.LST && !lstMintAddress) {
    throw new Error('LST mint address is required for LST withdrawals');
  }

  return await prisma.transaction.create({
    data: {
      userId,
      walletAddress,
      transactionType: TransactionType.WITHDRAWAL,
      amountSol,
      withdrawalType,
      lstMintAddress: withdrawalType === WithdrawalType.LST ? lstMintAddress : null,
      status: TransactionStatus.PENDING,
    },
  });
}
