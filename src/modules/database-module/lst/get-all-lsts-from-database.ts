// import prisma from "../../../lib/prisma";
// import { LstToken } from "../../../types/database-types";

// export async function getAllLstsFromDb(): Promise<LstToken[]> {
//   try {
//     const tokens = await prisma.lstToken.findMany({
//       orderBy: { currentApy: "desc" },
//       select: {
//         mintAddress: true,
//         symbol: true,
//         name: true,
//         imageUrl: true,
//         protocolName: true,
//         protocolWebsite: true,
//         currentApy: true,
//         currentPriceSol: true,
//         totalLiquiditySol: true,
//         marketCapSol: true,
//         avgApyOverHistory: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     return tokens.map((token) => {
//       const mappedToken: LstToken = {
//         mintAddress: token.mintAddress,
//         symbol: token.symbol,
//         name: token.name,
//         token_program: "",
//         decimals: 9,
//         imageUrl: token.imageUrl,
//         currentApy: token.currentApy !== null ? String(token.currentApy) : null,
//         currentPriceSol: token.currentPriceSol !== null ? Number(token.currentPriceSol) : null,
//         totalLiquiditySol: token.totalLiquiditySol !== null ? Number(token.totalLiquiditySol) : null,
//         marketCapSol: token.marketCapSol !== null ? Number(token.marketCapSol) : null,
//         avgApyOverHistory: token.avgApyOverHistory ? String(token.avgApyOverHistory) : null,
//         createdAt: token.createdAt,
//         updatedAt: token.updatedAt,
//       };
            
//       return mappedToken;
//     });
//   } catch (error) {
//     throw new Error(`Failed to get all LST tokens: ${error instanceof Error ? error.message : String(error)}`);
//   }
// }

import prisma from "../../../lib/prisma";
import { LstToken } from "../../../types/database-types";

export async function getAllLstsFromDb(): Promise<LstToken[]> {
  try {
    const tokens = await prisma.lstToken.findMany({
      orderBy: {
        currentApy: {
          sort: "desc",
          nulls: "last", // Ensures NULL values are placed last
        },
      },
      select: {
        mintAddress: true,
        symbol: true,
        name: true,
        imageUrl: true,
        protocolName: true,
        protocolWebsite: true,
        currentApy: true, // Now correctly stored as Decimal
        currentPriceSol: true,
        totalLiquiditySol: true,
        marketCapSol: true,
        avgApyOverHistory: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Debugging - Ensure APYs are sorted
    console.log("Sorted DB LSTs:", tokens.map(t => ({ symbol: t.symbol, apy: t.currentApy?.toString() })));

    return tokens.map(token => ({
      mintAddress: token.mintAddress,
      symbol: token.symbol,
      name: token.name,
      token_program: "",
      decimals: 9,
      imageUrl: token.imageUrl,
      currentApy: token.currentApy ? Number(token.currentApy) : null, // Convert Decimal to number
      currentPriceSol: token.currentPriceSol ? Number(token.currentPriceSol) : null,
      totalLiquiditySol: token.totalLiquiditySol ? Number(token.totalLiquiditySol) : null,
      marketCapSol: token.marketCapSol ? Number(token.marketCapSol) : null,
      avgApyOverHistory: token.avgApyOverHistory ? String(token.avgApyOverHistory) : null,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
    }));
  } catch (error) {
    console.error("[getAllLstsFromDb] Error:", error);
    throw new Error(`Failed to get all LST tokens: ${error instanceof Error ? error.message : String(error)}`);
  }
}
