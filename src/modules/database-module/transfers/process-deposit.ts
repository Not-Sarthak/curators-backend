import prisma from '../../../lib/prisma';
import { TransactionStatus } from '@prisma/client';

export async function processDeposit(transactionId: string) {
  console.log(`Processing deposit transaction ${transactionId}`);

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { user: true },
  });

  if (!transaction || transaction.transactionType !== 'DEPOSIT' || transaction.status !== 'PENDING') {
    throw new Error(`Invalid transaction for processing`);
  }

  return await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: TransactionStatus.CONFIRMED,
      confirmationCount: 32,
    },
  });
}
