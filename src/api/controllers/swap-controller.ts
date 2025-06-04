import { FastifyRequest, FastifyReply } from 'fastify';
import { Keypair } from '@solana/web3.js';
import { getSwapQuote } from '../../modules/jupiter-module/get-swap-quote';
import { executeSwapWithMevProtection } from '../../modules/jupiter-module/execute-swap';

/**
 * Swap controller
*/
export class SwapController {
  private readonly walletKeypair: Keypair;

  constructor() {
    const privateKeyString = process.env.SOLANA_WALLET_PRIVATE_KEY;
    if (!privateKeyString) {
      throw new Error('SOLANA_WALLET_PRIVATE_KEY Is Missing');
    }
    try {
      const privateKeyData = JSON.parse(privateKeyString);
      this.walletKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyData));
    } catch (error) {
      throw new Error('Invalid wallet private key format');
    }
  }

  /**
   * Gets a swap quote
   * @param request The request
   * @param reply The reply
   */
  public getSwapQuote = async (
    request: FastifyRequest<{
      Querystring: {
        userId?: string;
        inputMint: string;
        outputMint: string;
        amount: string;
        slippageBps?: number;
      };
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { inputMint, outputMint, amount, slippageBps } = request.query;
      const userId = request.query.userId || request.user?.userId;

      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User ID is required',
        });
      }

      if (request.query.userId && request.user?.userId !== request.query.userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to get a swap quote for this user',
        });
      }

      const swapQuote = await getSwapQuote(inputMint, outputMint, Number(amount), slippageBps);

      return reply.status(200).send(swapQuote);
    } catch (error) {
      console.error('Error getting swap quote:', error);

      if (error instanceof Error && error.message.includes('not found')) {
        return reply.status(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }

      if (error instanceof Error && error.message.includes('Insufficient balance')) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: error.message,
        });
      }

      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get swap quote',
      });
    }
  };

  /**
   * Executes a swap with MEV protection when possible
   * @param request The request
   * @param reply The reply
   */
  public executeSwap = async (
    request: FastifyRequest<{
      Body: {
        userId: string;
        inputMint: string;
        outputMint: string;
        amount: string;
        maxJitoSlotDistance?: number;
      };
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { userId, inputMint, outputMint, amount, maxJitoSlotDistance } = request.body;

      if (request.user?.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to execute a swap for this user',
        });
      }

      const result = await executeSwapWithMevProtection(
        inputMint,
        outputMint,
        Number(amount),
        this.walletKeypair,
        maxJitoSlotDistance
      );

      return reply.status(200).send({
        transactionHash: result.txHash,
        usedMevProtection: result.usedMevProtection,
        status: 'success',
      });
    } catch (error) {
      console.error('Error executing swap:', error);

      if (error instanceof Error && error.message.includes('not found')) {
        return reply.status(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }

      if (error instanceof Error && error.message.includes('Insufficient balance')) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: error.message,
        });
      }

      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to execute swap',
      });
    }
  };

  /**
   * Gets available swap routes
   * @param request The request
   * @param reply The reply
   */
  public getAvailableRoutes = async (reply: FastifyReply) => {
    try {
      return reply.status(200).send({
        routes: ['JUPITER_WITH_MEV_PROTECTION'],
      });
    } catch (error) {
      console.error('Error getting available routes:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get available routes',
      });
    }
  };
}
