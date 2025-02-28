import axios from "axios";
import { config } from "../../config";
import { generateQueryParams } from "../../lib/utils";

const SANCTUM_API_BASE_URL = config.sanctumExtraApiUrl;

export async function fetchLatestApy(symbols: string[]): Promise<Record<string, number>> {
  try {
    const queryParams = generateQueryParams(symbols);

    const response = await axios.get<Record<string, number>>(
      `${SANCTUM_API_BASE_URL}/apy/latest?${queryParams}`,
      { headers: { Accept: "application/json" } }
    );
    
    console.log("Raw API response:", response.data);
    
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch latest APY from Sanctum API: ${error}`);
  }
}
