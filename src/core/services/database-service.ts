import { getAllLstsFromDb } from "../../modules/database-module/lst/get-all-lsts-from-database";
import { LstToken } from "../../types/database-types";
import { fetchAllLsts } from "../../modules/sanctum-module/get-all-lsts";
import { fetchLatestApy } from "../../modules/sanctum-module/get-latest-apy";
import prisma from "../../lib/prisma";
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
      
      const symbols = sanctumLsts.map(lst => lst.symbol);
      
      const apyData = await fetchLatestApy(symbols);
      if (apyData && apyData.apys && typeof apyData.apys === 'object') {
        const apyEntries = Object.entries(apyData.apys).slice(0, 5);
        console.log("First 5 APY values:", Object.fromEntries(apyEntries));
      }      
      
      const lstTokens: LstToken[] = [];
      
      for (const lst of sanctumLsts) {
        const apyValue = typeof apyData.apys === 'object' && apyData.apys !== null && lst.symbol in apyData.apys
          ? apyData.apys[lst.symbol]
          : null;
        
        const lstToken = await prisma.lstToken.upsert({
          where: { mintAddress: lst.mint },
          update: {
            symbol: lst.symbol,
            name: lst.name,
            currentApy: apyValue ? parseFloat(apyValue) : null,
            imageUrl: lst.logo_uri || null,
            protocolName: lst.pool?.program || "Unknown",
            updatedAt: new Date()
          },
          create: {
            mintAddress: lst.mint,
            symbol: lst.symbol,
            name: lst.name,
            currentApy: apyValue,
            imageUrl: lst.logo_uri || null,
            protocolName: lst.pool?.program || "Unknown",
            protocolWebsite: null,
          }
        });
        
        const plainObject = JSON.parse(JSON.stringify(lstToken));
        lstTokens.push(plainObject as LstToken);
        
      }
      
      // Step 6: Sort by APY (descending)
      console.log("[LstService] Sorting LSTs by APY (descending)");
      lstTokens.sort((a, b) => {
        const apyA = a.currentApy || 0;
        const apyB = b.currentApy || 0;
        return apyB - apyA;
      });
      
      console.log(`[LstService] Returning ${lstTokens.length} LSTs`);
      return lstTokens;
      
    } catch (error) {
      console.error("[LstService] Error in getAllLsts:", error);
      throw new Error(`Failed to get LSTs: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
