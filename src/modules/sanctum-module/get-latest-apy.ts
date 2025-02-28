import axios from "axios";
import { config } from "../../config";
import { SanctumApyResponse } from "../../types/api-types";

const SANCTUM_API_BASE_URL = config.sanctumExtraApiUrl;

export async function fetchLatestApy(symbols: string[]): Promise<SanctumApyResponse> {
  try {
    const queryParams = symbols.map(symbol => `lst=${encodeURIComponent(symbol)}`).join('&');    
    const response = await axios.get<SanctumApyResponse>(
      `${SANCTUM_API_BASE_URL}/apy/latest?${queryParams}`,
      { headers: { Accept: "application/json" } }
    );    
    
    return response.data;
  } catch (error) {
    console.error("[fetchLatestApy] Error:", error);
    throw new Error(`Failed to fetch latest APY from Sanctum API: ${error}`);
  }
}
