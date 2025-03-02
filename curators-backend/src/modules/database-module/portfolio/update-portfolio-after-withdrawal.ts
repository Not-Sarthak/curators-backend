import prisma from "../../../lib/prisma";

export async function updatePortfolioAfterWithdrawal(
  userId: string,
  withdrawalAmount: number,
  lstMintAddress: string,
  lstAmount: number,
  lstPrice: number
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      totalWithdrawalsSol: { increment: withdrawalAmount },
      currentDepositSol: { decrement: withdrawalAmount },
      totalValueSol: { decrement: withdrawalAmount },
    },
  });

  const holding = await prisma.userHolding.findUnique({
    where: { unique_user_lst: { userId, lstMintAddress } },
  });

  if (!holding) {
    throw new Error(`User does not have a holding for LST with mint address ${lstMintAddress}`);
  }

  const newAmount = Number(holding.amount) - lstAmount;
  if (newAmount <= 0) {
    await prisma.userHolding.delete({ where: { unique_user_lst: { userId, lstMintAddress } } });
  } else {
    await prisma.userHolding.update({
      where: { unique_user_lst: { userId, lstMintAddress } },
      data: { amount: newAmount, valueInSol: newAmount * lstPrice },
    });
  }
}
