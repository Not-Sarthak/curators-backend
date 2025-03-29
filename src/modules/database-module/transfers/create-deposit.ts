import prisma from '../../../lib/prisma';
import { TransactionType, TransactionStatus } from '@prisma/client';

export async function createDeposit(userId: string, walletAddress: string, amountSol: number, transactionHash?: string) {
  if (transactionHash) {
    const existingTransaction = await prisma.transaction.findUnique({ where: { transactionHash } });
    if (existingTransaction) {
      throw new Error(`A transaction with hash ${transactionHash} already exists`);
    }
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      walletAddress,
      transactionType: TransactionType.DEPOSIT,
      amountSol,
      transactionHash,
      status: TransactionStatus.PENDING,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalDepositsSol: { increment: amountSol },
      currentDepositSol: { increment: amountSol },
    },
  });

  return transaction;
}
