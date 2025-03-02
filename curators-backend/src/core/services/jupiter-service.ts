import { getSwapQuote } from "../../modules/jupiter-module/get-swap-quote";
import { getSwapTransaction } from "../../modules/jupiter-module/get-swap-transaction";
import { simulateTransaction } from "../../modules/jupiter-module/simulate-transaction";
import { JupiterSwapQuote } from "../../types";

export class JupiterService {
  public async getSwapQuote(inputMint: string, outputMint: string, amount: number, slippageBps: number = 50) {
    return getSwapQuote(inputMint, outputMint, amount, slippageBps);
  }

  public async getSwapTransaction(quoteResponse: JupiterSwapQuote, userPublicKey: string) {
    return getSwapTransaction(quoteResponse, userPublicKey);
  }

  public async simulateTransaction(swapTransaction: string) {
    return simulateTransaction(swapTransaction);
  }
}
