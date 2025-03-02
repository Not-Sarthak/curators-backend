import axios from "axios";
import { JupiterSwapQuote, JupiterSwapTransaction, JupiterSwapRequest } from "../../types";

const JUPITER_API_BASE_URL = process.env.JUPITER_API_BASE_URL || "https://quote-api.jup.ag/v6";

/**
 * Fetches a swap transaction from Jupiter API.
 */
export async function getSwapTransaction(
  quoteResponse: JupiterSwapQuote,
  userPublicKey: string
): Promise<JupiterSwapTransaction> {
  try {
    const swapRequest: JupiterSwapRequest = {
      quoteResponse,
      userPublicKey,
      dynamicComputeUnitLimit: true,
      dynamicSlippage: { maxBps: 300 },
      prioritizationFeeLamports: {
        priorityLevelWithMaxLamports: {
          maxLamports: 1_000_000,
          priorityLevel: "veryHigh",
        },
      },
    };

    const response = await axios.post<JupiterSwapTransaction>(`${JUPITER_API_BASE_URL}/swap`, swapRequest, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching swap transaction from Jupiter:", error.response?.data || error.message);
    throw new Error("Failed to fetch swap transaction from Jupiter API");
  }
}
