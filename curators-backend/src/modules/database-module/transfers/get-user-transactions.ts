import prisma from '../../../lib/prisma';

export async function getTransactionsForUser(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return { userId, transactions, total: transactions.length };
}
