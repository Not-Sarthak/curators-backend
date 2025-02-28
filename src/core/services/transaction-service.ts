import { PrismaClient, DepositStatus, WithdrawalStatus, WithdrawalType, TransactionType, TransactionStatus } from '@prisma/client';
import { SolanaService } from './solana-service';
import { SanctumService } from './sanctum-service';
import { UserService } from './user-service';

/**
 * Service for managing deposits and withdrawals
 */
export class TransactionService {
  private readonly prisma: PrismaClient;
  private readonly solanaService: SolanaService;
  private readonly sanctumService: SanctumService;
  private readonly userService: UserService;

  /**
   * Creates a new TransactionService instance
   * @param prisma The Prisma client
   * @param solanaService The Solana service
   * @param sanctumService The Sanctum service
   * @param userService The user service for portfolio operations
   */
  constructor(
    prisma: PrismaClient,
    solanaService: SolanaService,
    sanctumService: SanctumService,
    userService: UserService
  ) {
    this.prisma = prisma;
    this.solanaService = solanaService;
    this.sanctumService = sanctumService;
    this.userService = userService;
  }

  /**
   * Creates a new deposit
   * @param userId The user ID
   * @param walletAddress The wallet address
   * @param amountSol The amount in SOL
   * @param transactionHash The transaction hash
   * @returns The created deposit
   */
  public async createDeposit(
    userId: string,
    walletAddress: string,
    amountSol: number,
    transactionHash: string
  ) {
    // Check if a deposit with this transaction hash already exists
    const existingDeposit = await this.prisma.deposit.findUnique({
      where: { transactionHash },
    });

    if (existingDeposit) {
      throw new Error(`A deposit with transaction hash ${transactionHash} already exists`);
    }

    // Get the best LST to deposit into (highest APY)
    const lstTokens = await this.prisma.lstToken.findMany({
      orderBy: {
        currentApy: 'desc'
      }
    });

    if (lstTokens.length === 0) {
      throw new Error('No LSTs found');
    }

    // Find the first LST with a valid price
    let bestLst = null;
    let lstPrice = 0;

    for (const lst of lstTokens) {
      try {
        const priceResponse = await this.sanctumService.getLstPriceInSol([lst.mintAddress]);
        const price = Number(priceResponse.price);
        
        if (!isNaN(price) && price > 0) {
          bestLst = lst;
          lstPrice = price;
          break;
        }
      } catch (error) {
        console.warn(`Failed to get price for LST ${lst.mintAddress}, trying next LST`);
        continue;
      }
    }

    if (!bestLst || lstPrice <= 0) {
      throw new Error('No LSTs found with valid prices');
    }

    // Calculate the amount of LST to receive
    const lstAmount = amountSol / lstPrice;

    // Validate LST amount
    if (isNaN(lstAmount) || lstAmount <= 0) {
      throw new Error(`Invalid LST amount calculated: ${lstAmount}`);
    }

    // Get the user's current portfolio value
    const userBefore = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userBefore) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Create the deposit record
    const deposit = await this.prisma.deposit.create({
      data: {
        userId,
        walletAddress,
        amountSol,
        transactionHash,
        status: DepositStatus.PENDING,
      },
    });

    try {
      // Update the user's portfolio
      await this.userService.updatePortfolioAfterDeposit(
        userId,
        amountSol,
        bestLst.mintAddress,
        lstAmount,
        lstPrice
      );

      // Get the updated user portfolio value
      const userAfter = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!userAfter) {
        throw new Error(`User with ID ${userId} not found after update`);
      }

      // Update the deposit status
      const updatedDeposit = await this.prisma.deposit.update({
        where: { id: deposit.id },
        data: {
          status: DepositStatus.CONFIRMED,
          confirmationCount: 32,
          networkFeeSol: 0.000005,
        },
      });

      return updatedDeposit;
    } catch (error) {
      const updatedDeposit = await this.prisma.deposit.update({
        where: { id: deposit.id },
        data: {
          status: DepositStatus.FAILED,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Processes a pending deposit
   * @param depositId The deposit ID
   * @returns The processed deposit
   */
  public async processDeposit(depositId: string) {
    // Get the deposit
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
      include: { user: true },
    });

    if (!deposit) {
      throw new Error(`Deposit with ID ${depositId} not found`);
    }

    if (deposit.status !== DepositStatus.PENDING) {
      throw new Error(`Deposit with ID ${depositId} is not pending`);
    }

    try {
      // In a real implementation, this would verify the transaction on the blockchain
      // For now, we'll simulate a successful deposit

      // Get the best LST to deposit into (highest APY)
      const lstTokens = await this.prisma.lstToken.findMany({
        orderBy: {
          currentApy: 'desc'
        }
      });

      if (lstTokens.length === 0) {
        throw new Error('No LSTs found');
      }

      // Find the first LST with a valid price
      let bestLst = null;
      let lstPrice = 0;

      for (const lst of lstTokens) {
        try {
          const priceResponse = await this.sanctumService.getLstPriceInSol([lst.mintAddress]);
          const price = Number(priceResponse.price);
          
          if (!isNaN(price) && price > 0) {
            bestLst = lst;
            lstPrice = price;
            break;
          }
        } catch (error) {
          console.warn(`Failed to get price for LST ${lst.mintAddress}, trying next LST`);
          continue;
        }
      }

      if (!bestLst || lstPrice <= 0) {
        throw new Error('No LSTs found with valid prices');
      }

      // Calculate the amount of LST to receive
      const lstAmount = deposit.amountSol / lstPrice;

      // Validate LST amount
      if (isNaN(lstAmount) || lstAmount <= 0) {
        throw new Error(`Invalid LST amount calculated: ${lstAmount}`);
      }

      await this.userService.updatePortfolioAfterDeposit(
        deposit.userId,
        Number(deposit.amountSol),
        bestLst.mintAddress,
        lstAmount,
        lstPrice
      );

      // Update the deposit status
      const updatedDeposit = await this.prisma.deposit.update({
        where: { id: depositId },
        data: {
          status: DepositStatus.CONFIRMED,
          confirmationCount: 32, // Simulated confirmation count
          networkFeeSol: 0.000005, // Estimated Solana network fee
        },
      });

      // Create a transaction record in the explorer
      await this.prisma.explorer.create({
        data: {
          transactionType: TransactionType.DEPOSIT,
          transactionHash: deposit.transactionHash,
          amountSol: deposit.amountSol,
          feeSol: 0.000005,
          lstAmount,
          lstPriceSol: lstPrice,
          portfolioValueBeforeSol: deposit.user.totalValueSol - deposit.amountSol,
          portfolioValueAfterSol: deposit.user.totalValueSol,
          status: TransactionStatus.CONFIRMED,
          confirmationCount: 32,
          user: {
            connect: {
              id: deposit.userId
            }
          },
          lstToken: {
            connect: {
              mintAddress: bestLst.mintAddress
            }
          },
          deposit: {
            connect: {
              id: deposit.id
            }
          }
        },
      });

      return updatedDeposit;
    } catch (error) {
      // Update the deposit status to failed
      const updatedDeposit = await this.prisma.deposit.update({
        where: { id: depositId },
        data: {
          status: DepositStatus.FAILED,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      return updatedDeposit;
    }
  }

  /**
   * Gets deposits for a user
   * @param userId The user ID
   * @returns The user's deposits
   */
  public async getDepositsForUser(userId: string) {
    const deposits = await this.prisma.deposit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return deposits;
  }

  public async createWithdrawal(
    userId: string,
    walletAddress: string,
    requestedAmountSol: number,
    withdrawalType: WithdrawalType,
    lstMintAddress?: string
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Check if the user has enough funds
    if (requestedAmountSol > user.currentDepositSol) {
      throw new Error(`Insufficient funds. User has ${user.currentDepositSol} SOL but requested to withdraw ${requestedAmountSol} SOL`);
    }

    const withdrawal = await this.prisma.withdrawal.create({
      data: {
        userId,
        walletAddress,
        requestedAmountSol,
        withdrawalType,
        lstMintAddress: withdrawalType === WithdrawalType.LST ? lstMintAddress : null,
        status: WithdrawalStatus.PENDING,
      },
    });

    return withdrawal;
  }

  public async processWithdrawal(withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { user: true },
    });

    if (!withdrawal) {
      throw new Error(`Withdrawal with ID ${withdrawalId} not found`);
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new Error(`Withdrawal with ID ${withdrawalId} is not pending`);
    }

    try {
      const networkFeeSol = 0.000005;

      // Calculate the actual amount to withdraw (after fees)
      const actualAmountSol = withdrawal.requestedAmountSol - networkFeeSol;

      if (withdrawal.withdrawalType === WithdrawalType.SOL) {
        // Withdrawing as SOL
        // Find the user's holdings to liquidate
        const holdings = await this.prisma.userHolding.findMany({
          where: { userId: withdrawal.userId },
          orderBy: { amount: 'desc' },
        });

        if (holdings.length === 0) {
          throw new Error('User has no holdings to withdraw from');
        }

        // Calculate the total value of all holdings
        let totalValueSol = 0;
        const holdingsWithPrices = await Promise.all(
          holdings.map(async (holding) => {
            const priceResponse = await this.sanctumService.getLstPrice(holding.lstMintAddress);
            const currentPrice = Number(priceResponse.price);
            const currentValue = holding.amount * currentPrice;
            totalValueSol += currentValue;
            return {
              ...holding,
              currentPriceSol: currentPrice,
              currentValueSol: currentValue,
            };
          })
        );

        // Sort holdings by value (descending)
        holdingsWithPrices.sort((a, b) => b.currentValueSol - a.currentValueSol);

        // Withdraw from holdings until we reach the requested amount
        let remainingToWithdraw = actualAmountSol;
        let conversionFeeSol = 0;

        for (const holding of holdingsWithPrices) {
          if (remainingToWithdraw <= 0) {
            break;
          }

          const amountToWithdrawFromHolding = Math.min(
            remainingToWithdraw,
            holding.currentValueSol
          );

          const lstAmountToWithdraw = amountToWithdrawFromHolding / holding.currentPriceSol;

          // Update the user's portfolio
          await this.userService.updatePortfolioAfterWithdrawal(
            withdrawal.userId,
            amountToWithdrawFromHolding,
            holding.lstMintAddress,
            lstAmountToWithdraw,
            holding.currentPriceSol
          );

          // Add a small conversion fee (0.1%)
          const holdingConversionFee = amountToWithdrawFromHolding * 0.001;
          conversionFeeSol += holdingConversionFee;

          remainingToWithdraw -= amountToWithdrawFromHolding;
        }

        // Update the withdrawal record
        const updatedWithdrawal = await this.prisma.withdrawal.update({
          where: { id: withdrawalId },
          data: {
            status: WithdrawalStatus.COMPLETED,
            actualAmountSol: actualAmountSol - conversionFeeSol,
            networkFeeSol,
            conversionFeeSol,
            transactionHash: updatedWithdrawal.transactionHash!,
          },
        });

        // Create a transaction record in the explorer
        await this.prisma.explorer.create({
          data: {
            transactionType: TransactionType.WITHDRAWAL,
            transactionHash: updatedWithdrawal.transactionHash!,
            amountSol: actualAmountSol - conversionFeeSol,
            feeSol: networkFeeSol + conversionFeeSol,
            portfolioValueBeforeSol: withdrawal.user.totalValueSol,
            portfolioValueAfterSol: withdrawal.user.totalValueSol - withdrawal.requestedAmountSol,
            status: TransactionStatus.CONFIRMED,
            confirmationCount: 32,
            user: {
              connect: {
                id: withdrawal.userId
              }
            },
            withdrawal: {
              connect: {
                id: withdrawal.id
              }
            }
          },
        });

        return updatedWithdrawal;
      } else if (withdrawal.withdrawalType === WithdrawalType.LST && withdrawal.lstMintAddress) {
        // Withdrawing as LST
        // Get the current price of the LST
        const priceResponse = await this.solanaService.getLstPrice(withdrawal.lstMintAddress);
        const lstPrice = Number(priceResponse.price);

        // Calculate the amount of LST to withdraw
        const lstAmount = actualAmountSol / lstPrice;

        // Get the user's holding for this LST
        const holding = await this.prisma.userHolding.findUnique({
          where: {
            userId_lstMintAddress: {
              userId: withdrawal.userId,
              lstMintAddress: withdrawal.lstMintAddress,
            },
          },
        });

        if (!holding) {
          throw new Error(`User does not have a holding for LST with mint address ${withdrawal.lstMintAddress}`);
        }

        if (holding.amount < lstAmount) {
          throw new Error(`Insufficient LST balance. User has ${holding.amount} but requested to withdraw ${lstAmount}`);
        }

        // Update the user's portfolio
        await this.userService.updatePortfolioAfterWithdrawal(
          withdrawal.userId,
          actualAmountSol,
          withdrawal.lstMintAddress,
          lstAmount,
          lstPrice
        );

        // Update the withdrawal record
        const updatedWithdrawal = await this.prisma.withdrawal.update({
          where: { id: withdrawalId },
          data: {
            status: WithdrawalStatus.COMPLETED,
            actualAmountSol,
            networkFeeSol,
            conversionFeeSol: 0,
            lstAmount,
            conversionPriceSol: lstPrice,
            transactionHash: `simulated-tx-${Date.now()}`, // In a real implementation, this would be the actual transaction hash
          },
        });

        // Create a transaction record in the explorer
        await this.prisma.explorer.create({
          data: {
            transactionType: TransactionType.WITHDRAWAL,
            transactionHash: updatedWithdrawal.transactionHash!,
            amountSol: actualAmountSol,
            feeSol: networkFeeSol,
            lstAmount,
            lstPriceSol: lstPrice,
            portfolioValueBeforeSol: withdrawal.user.totalValueSol,
            portfolioValueAfterSol: withdrawal.user.totalValueSol - withdrawal.requestedAmountSol,
            status: TransactionStatus.CONFIRMED,
            confirmationCount: 32,
            user: {
              connect: {
                id: withdrawal.userId
              }
            },
            lstToken: {
              connect: {
                mintAddress: withdrawal.lstMintAddress!
              }
            },
            withdrawal: {
              connect: {
                id: withdrawal.id
              }
            }
          },
        });

        return updatedWithdrawal;
      } else {
        throw new Error('Invalid withdrawal type or missing LST mint address');
      }
    } catch (error) {
      // Update the withdrawal status to failed
      const updatedWithdrawal = await this.prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: WithdrawalStatus.FAILED,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          retryCount: { increment: 1 },
        },
      });

      return updatedWithdrawal;
    }
  }

  public async getWithdrawalsForUser(userId: string) {
    const withdrawals = await this.prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return withdrawals;
  }
} 