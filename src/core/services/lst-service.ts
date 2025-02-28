import { getAllLstsFromDb } from '../../modules/database-module/lst/get-all-lsts-from-database';
import { LstToken } from '../../types/database-types';
import { fetchAllLsts } from '../../modules/sanctum-module/get-all-lsts';
import { fetchLatestApy } from '../../modules/sanctum-module/get-latest-apy';
import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';

export class LstService {
  public async getAllLsts(): Promise<LstToken[]> {
    try {
      const dbLsts = await getAllLstsFromDb();
      if (dbLsts && dbLsts.length > 0) {
        return dbLsts;
      }

      const sanctumLsts = await fetchAllLsts();
      if (!sanctumLsts || sanctumLsts.length === 0) {
        return [];
      }

      const symbols = sanctumLsts.map((lst) => lst.symbol);

      const apyData = await fetchLatestApy(symbols);

      const lstTokens: LstToken[] = [];

      for (const lst of sanctumLsts) {
        const apyValue =
          typeof apyData.apys === 'object' && apyData.apys !== null && lst.symbol in apyData.apys
            ? apyData.apys[lst.symbol]
            : null;

        const lstToken = await prisma.lstToken.upsert({
          where: { mintAddress: lst.mint },
          update: {
            symbol: lst.symbol,
            name: lst.name,
            currentApy: apyValue !== null ? new Prisma.Decimal(apyValue) : null,
            imageUrl: lst.logo_uri || null,
            protocolName: lst.pool?.program || 'Unknown',
            updatedAt: new Date(),
          },
          create: {
            mintAddress: lst.mint,
            symbol: lst.symbol,
            name: lst.name,
            currentApy: apyValue !== null ? new Prisma.Decimal(apyValue) : null,
            imageUrl: lst.logo_uri || null,
            protocolName: lst.pool?.program || 'Unknown',
            protocolWebsite: null,
          },
        });

        const plainObject = JSON.parse(JSON.stringify(lstToken));
        lstTokens.push(plainObject as LstToken);
      }

      lstTokens.sort((a, b) => {
        const apyA = a.currentApy ? Number(a.currentApy) : 0;
        const apyB = b.currentApy ? Number(b.currentApy) : 0;
        return apyB - apyA;
      });
      return lstTokens;
    } catch (error) {
      throw new Error(
        `Failed to get LSTs: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  public async getLstTokenByMintAddress(mintAddress: string): Promise<LstToken | null> {
    try {
      const token = await prisma.lstToken.findUnique({
        where: { mintAddress },
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

      if (!token) return null;

      return {
        mintAddress: token.mintAddress,
        symbol: token.symbol,
        name: token.name,
        token_program: "",
        decimals: 9,
        imageUrl: token.imageUrl,
        currentApy: token.currentApy ? String(token.currentApy) : null,
        currentPriceSol: token.currentPriceSol ? Number(token.currentPriceSol) : null,
        totalLiquiditySol: token.totalLiquiditySol ? Number(token.totalLiquiditySol) : null,
        marketCapSol: token.marketCapSol ? Number(token.marketCapSol) : null,
        avgApyOverHistory: token.avgApyOverHistory ? String(token.avgApyOverHistory) : null,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
      };
    } catch (error) {
      throw new Error(
        `Failed to get LST token by mint address: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
