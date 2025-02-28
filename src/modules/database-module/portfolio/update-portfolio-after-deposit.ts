import prisma from "../../../lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function updatePortfolioAfterDeposit(
  userId: string,
  depositAmount: number,
  lstMintAddress: string,
  lstAmount: number,
  lstPrice: number
) {
  if (isNaN(depositAmount) || isNaN(lstAmount) || isNaN(lstPrice)) {
    throw new Error("Invalid numerical values provided for deposit");
  }

  const depositAmountDecimal = new Decimal(depositAmount.toString());
  const lstAmountDecimal = new Decimal(lstAmount.toString());
  const lstPriceDecimal = new Decimal(lstPrice.toString());

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalDepositsSol: { increment: depositAmountDecimal },
      currentDepositSol: { increment: depositAmountDecimal },
      totalValueSol: { increment: depositAmountDecimal },
    },
  });

  const existingHolding = await prisma.userHolding.findUnique({
    where: { unique_user_lst: { userId, lstMintAddress } },
  });

  if (existingHolding) {
    const newTotalAmount = existingHolding.amount.plus(lstAmountDecimal);
    const newEntryPrice = existingHolding.amount
      .mul(existingHolding.entryPriceSol)
      .plus(lstAmountDecimal.mul(lstPriceDecimal))
      .div(newTotalAmount);

    await prisma.userHolding.update({
      where: { unique_user_lst: { userId, lstMintAddress } },
      data: {
        amount: newTotalAmount,
        valueInSol: newTotalAmount.mul(lstPriceDecimal),
        entryPriceSol: newEntryPrice,
      },
    });
  } else {
    await prisma.userHolding.create({
      data: {
        amount: lstAmountDecimal,
        valueInSol: lstAmountDecimal.mul(lstPriceDecimal),
        entryPriceSol: lstPriceDecimal,
        user: { connect: { id: userId } },
        lstToken: { connect: { mintAddress: lstMintAddress } },
      },
    });
  }
}
