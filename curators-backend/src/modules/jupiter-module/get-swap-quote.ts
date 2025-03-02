import axios from "axios";
import { JupiterSwapQuote } from "../../types";

const JUPITER_API_BASE_URL = process.env.JUPITER_API_BASE_URL || "https://quote-api.jup.ag/v6";

/**
 * Fetches a swap quote from Jupiter API.
 */
export async function getSwapQuote(
  inputMint: string,
  outputMint: string,
  amount: number, // SOL amount
  slippageBps: number = 50
): Promise<JupiterSwapQuote> {
  try {
    const lamports = Math.floor(amount * 1_000_000_000); // Convert SOL to lamports

    const response = await axios.get<JupiterSwapQuote>(`${JUPITER_API_BASE_URL}/quote`, {
      params: { inputMint, outputMint, amount: lamports, slippageBps },
      headers: { Accept: "application/json" },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching swap quote from Jupiter:", error.response?.data || error.message);
    throw new Error("Failed to fetch swap quote from Jupiter API");
  }
}
