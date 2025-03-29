import prisma from "../../../lib/prisma";

export async function updatePortfolioAfterSwap(
  userId: string,
  sourceLstMintAddress: string,
  sourceAmount: number,
  sourcePriceSol: number,
  destinationLstMintAddress: string,
  destinationAmount: number,
  destinationPriceSol: number
) {
  const sourceHolding = await prisma.userHolding.findUnique({
    where: { unique_user_lst: { userId, lstMintAddress: sourceLstMintAddress } },
  });

  if (!sourceHolding) {
    throw new Error(`User does not have a holding for source LST with mint address ${sourceLstMintAddress}`);
  }

  const sourceValueSol = sourceAmount * sourcePriceSol;
  const destinationValueSol = destinationAmount * destinationPriceSol;
  const swapProfitLoss = destinationValueSol - sourceValueSol;

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalValueSol: { increment: swapProfitLoss },
      unrealizedProfitSol: { increment: swapProfitLoss },
      totalProfitSol: { increment: swapProfitLoss },
    },
  });

  const destinationHolding = await prisma.userHolding.findUnique({
    where: { unique_user_lst: { userId, lstMintAddress: destinationLstMintAddress } },
  });

  if (destinationHolding) {
    const newTotalAmount = destinationHolding.amount.plus(destinationAmount);
    const newEntryPrice = destinationHolding.amount
      .mul(destinationHolding.entryPriceSol)
      .plus(destinationAmount * destinationPriceSol)
      .div(newTotalAmount);

    await prisma.userHolding.update({
      where: { unique_user_lst: { userId, lstMintAddress: destinationLstMintAddress } },
      data: {
        amount: newTotalAmount,
        valueInSol: newTotalAmount.mul(destinationPriceSol),
        entryPriceSol: newEntryPrice,
      },
    });
  } else {
    await prisma.userHolding.create({
      data: {
        userId,
        lstMintAddress: destinationLstMintAddress,
        amount: destinationAmount,
        valueInSol: destinationAmount * destinationPriceSol,
        entryPriceSol: destinationPriceSol,
      },
    });
  }
}
