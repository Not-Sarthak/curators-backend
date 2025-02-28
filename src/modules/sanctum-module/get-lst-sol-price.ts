import axios from "axios";
import { config } from "../../config";
import { generateQueryParams } from "../../lib/utils";
import { SanctumPriceResponse } from "../../types/api-types";

const SANCTUM_API_BASE_URL = config.sanctumExtraApiUrl;

export async function fetchLstPriceInSol(mintAddresses: string[]): Promise<SanctumPriceResponse> {
  try {
    const queryParams = generateQueryParams(mintAddresses);

    const response = await axios.get<{ solValues: SanctumPriceResponse }>(
      `${SANCTUM_API_BASE_URL}/sol-value/current?${queryParams}`,
      { headers: { Accept: "application/json" } }
    );

    return response.data.solValues;
  } catch (error) {
    throw new Error(`Failed to fetch LST prices from Sanctum API: ${error}`);
  }
}
