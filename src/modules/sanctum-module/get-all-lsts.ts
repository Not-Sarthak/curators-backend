import axios from "axios";
import { config } from "../../config";
import { SanctumLst } from "../../types/api-types";

const SANCTUM_API_BASE_URL = config.sanctumExtraApiUrl;

export async function fetchAllLsts(): Promise<SanctumLst[]> {
  try {    
    const response = await axios.get<{ lsts: SanctumLst[] }>(
      `${SANCTUM_API_BASE_URL}/lsts`,
      { headers: { Accept: "application/json" } }
    );

    return response.data.lsts;
  } catch (error) {
    throw new Error(`Failed to fetch LSTs from Sanctum API: ${error}`);
  }
}