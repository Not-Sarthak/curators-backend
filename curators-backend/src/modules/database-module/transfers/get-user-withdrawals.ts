import prisma from '../../../lib/prisma';
import { TransactionType } from '@prisma/client';

export async function getWithdrawalsForUser(userId: string) {
  const withdrawals = await prisma.transaction.findMany({
    where: { userId, transactionType: TransactionType.WITHDRAWAL },
    orderBy: { createdAt: 'desc' },
  });

  return { userId, withdrawals, total: withdrawals.length };
}
