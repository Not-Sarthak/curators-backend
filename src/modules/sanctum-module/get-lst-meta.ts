import axios from "axios";
import { config } from "../../config";
import { generateQueryParams } from "../../lib/utils";
import { SanctumLstMetadata } from "../../types/api-types";

const SANCTUM_API_BASE_URL = config.sanctumExtraApiUrl;

export async function fetchLstMetadata(symbols: string[]): Promise<{ [key: string]: SanctumLstMetadata }> {
  try {
    const queryParams = generateQueryParams(symbols);

    const response = await axios.get<{ metas: { [key: string]: SanctumLstMetadata } }>(
      `${SANCTUM_API_BASE_URL}/meta?${queryParams}`,
      { headers: { Accept: "application/json" } }
    );

    return response.data.metas;
  } catch (error) {
    throw new Error(`Failed to fetch LST metadata from Sanctum API: ${error}`);
  }
}
