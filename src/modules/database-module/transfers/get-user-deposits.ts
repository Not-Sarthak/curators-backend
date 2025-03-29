import prisma from '../../../lib/prisma';
import { TransactionType } from '@prisma/client';

export async function getDepositsForUser(userId: string) {
  const deposits = await prisma.transaction.findMany({
    where: { userId, transactionType: TransactionType.DEPOSIT },
    orderBy: { createdAt: 'desc' },
  });

  return { userId, deposits, total: deposits.length };
}
