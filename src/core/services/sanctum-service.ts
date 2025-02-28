import { fetchAllLsts } from "../../modules/sanctum-module/get-all-lsts";
import { fetchLstMetadata } from "../../modules/sanctum-module/get-lst-meta";
import { fetchLatestApy } from "../../modules/sanctum-module/get-latest-apy";
import { fetchLstPriceInSol } from "../../modules/sanctum-module/get-lst-sol-price";
import { SanctumLstMetadata, SanctumLst, SanctumPriceResponse, InceptionApyResponse } from "../../types/api-types";
import { fetchInceptionApy } from "../../modules/sanctum-module/get-inception-apy";

export class SanctumService {
  public async getAllLsts(): Promise<SanctumLst[]> {
    return fetchAllLsts();
  }

  public async getLstMetadata(symbols: string[]): Promise<{ [key: string]: SanctumLstMetadata }> {
    return fetchLstMetadata(symbols);
  }

  public async getLatestApy(symbols: string[]): Promise<Record<string, number>> {
    return fetchLatestApy(symbols);
  }

  public async getLstPriceInSol(symbols: string[]): Promise<SanctumPriceResponse> {
    return fetchLstPriceInSol(symbols);
  }

  public async getInceptionApy(symbols: string[]): Promise<InceptionApyResponse> {
    return fetchInceptionApy(symbols);
  }
}
