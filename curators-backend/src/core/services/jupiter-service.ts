import { Connection } from "@solana/web3.js";
import { getSwapQuote } from "../../modules/jupiter-module/get-swap-quote";
import { getSwapTransaction } from "../../modules/jupiter-module/get-swap-transaction";
import { simulateTransaction } from "../../modules/jupiter-module/simulate-transaction";

export class JupiterService {
  constructor(private readonly connection: Connection) {}

  public async getSwapQuote(inputMint: string, outputMint: string, amount: number, slippageBps: number = 50) {
    return getSwapQuote(inputMint, outputMint, amount, slippageBps);
  }

  public async getSwapTransaction(
    inputMint: string,
    outputMint: string,
    amount: number,
    userPublicKey: string,
    slippageBps: number = 50
  ) {
    return getSwapTransaction(this.connection, inputMint, outputMint, amount, userPublicKey, slippageBps);
  }

  public async simulateTransaction(swapTransaction: string) {
    return simulateTransaction(swapTransaction);
  }
}
