import prisma from "../lib/prisma";
import { fetchLatestApy } from "../modules/sanctum-module/get-latest-apy";

async function updateLstApy() {
  try {
    console.log("Starting LST APY update script");
    
    // Get all LST tokens from the database
    const lstTokens = await prisma.lstToken.findMany({
      select: {
        mintAddress: true,
        symbol: true,
        currentApy: true,
      },
    });
    
    console.log(`Found ${lstTokens.length} LST tokens in the database`);
    
    if (lstTokens.length === 0) {
      console.log("No LST tokens found in the database. Exiting.");
      return;
    }
    
    // Group symbols into batches of 20 to avoid URL length limits
    const batchSize = 20;
    const symbols = lstTokens.map(token => token.symbol);
    let updatedCount = 0;
    
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batchSymbols = symbols.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(symbols.length / batchSize)} with ${batchSymbols.length} symbols`);
      
      try {
        const apyData = await fetchLatestApy(batchSymbols);
        console.log(`Received APY data for ${Object.keys(apyData.apys).length} symbols`);
        
        // Update each token in the batch
        for (const symbol of batchSymbols) {
          if (symbol in apyData.apys) {
            const apyValue = apyData.apys[symbol];
            const token = lstTokens.find(t => t.symbol === symbol);
            
            if (token) {
              await prisma.lstToken.update({
                where: { mintAddress: token.mintAddress },
                data: { 
                  currentApy: apyValue.toString(),
                  updatedAt: new Date()
                },
              });
              
              console.log(`Updated APY for ${symbol}: ${apyValue}`);
              updatedCount++;
            }
          } else {
            console.log(`No APY data found for ${symbol}`);
          }
        }
      } catch (error) {
        console.error(`Error processing batch ${Math.floor(i / batchSize) + 1}:`, error);
      }
      
      // Add a small delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`Successfully updated APY values for ${updatedCount} LST tokens`);
    
  } catch (error) {
    console.error("Error updating LST APY values:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateLstApy()
  .then(() => console.log("Script completed"))
  .catch(error => console.error("Script failed:", error)); 