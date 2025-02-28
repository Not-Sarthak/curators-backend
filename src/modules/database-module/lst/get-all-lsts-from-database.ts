import prisma from "../../../lib/prisma";
import { LstToken } from "../../../types/database-types";

export async function getAllLstsFromDb(): Promise<LstToken[]> {
  try {
    const tokens = await prisma.lstToken.findMany({
      orderBy: { currentApy: "desc" },
      select: {
        mintAddress: true,
        symbol: true,
        name: true,
        imageUrl: true,
        protocolName: true,
        protocolWebsite: true,
        currentApy: true,
        currentPriceSol: true,
        totalLiquiditySol: true,
        marketCapSol: true,
        avgApyOverHistory: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return tokens.map((token: any) => ({
      ...token,
      currentApy: token.currentApy !== null ? Number(token.currentApy) : null,
      currentPriceSol: token.currentPriceSol !== null ? Number(token.currentPriceSol) : null,
      totalLiquiditySol: token.totalLiquiditySol !== null ? Number(token.totalLiquiditySol) : null,
      marketCapSol: token.marketCapSol !== null ? Number(token.marketCapSol) : null,
      avgApyOverHistory: token.avgApyOverHistory ? JSON.stringify(token.avgApyOverHistory) : null,
      apyVolatility: token.apyVolatility !== null ? Number(token.apyVolatility) : null,
    }));
  } catch (error) {
    throw new Error(`Failed to get all LST tokens: ${error instanceof Error ? error.message : String(error)}`);
  }
}
