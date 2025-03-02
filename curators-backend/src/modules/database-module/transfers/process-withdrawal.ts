import prisma from '../../../lib/prisma';
import { TransactionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export async function processWithdrawal(transactionId: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { user: true },
  });

  if (!transaction || transaction.transactionType !== 'WITHDRAWAL' || transaction.status !== 'PENDING') {
    throw new Error(`Invalid transaction for processing`);
  }

  const networkFeeSol = new Decimal(0.000005);
  const actualAmountSol = transaction.amountSol.minus(networkFeeSol);

  return await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: TransactionStatus.COMPLETED,
      actualAmountSol,
      networkFeeSol,
      conversionFeeSol: new Decimal(0),
      transactionHash: `simulated-tx-${Date.now()}`,
    },
  });
}
