import axios from "axios";
import { config } from "../../config";
import { generateQueryParams } from "../../lib/utils";
import { InceptionApyResponse } from "../../types/api-types";

const SANCTUM_API_BASE_URL = config.sanctumExtraApiUrl;

export async function fetchInceptionApy(lstSymbols: string[]): Promise<InceptionApyResponse> {
  try {
    const queryParams = generateQueryParams(lstSymbols.map(symbol => `lst=${symbol}`));

    const response = await axios.get<InceptionApyResponse>(
      `${SANCTUM_API_BASE_URL}/apy/inception?${queryParams}`,
      { headers: { Accept: "application/json" } }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch inception APY from Sanctum API: ${error}`);
  }
}