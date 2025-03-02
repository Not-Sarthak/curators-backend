import { VersionedTransaction } from '@solana/web3.js';
import { solanaConnection } from '../../lib/solana';

/**
 * Simulates a Jupiter swap transaction before execution.
 */
export async function simulateTransaction(swapTransaction: string): Promise<any> {
  try {
    const transactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(transactionBuf);

    const simulationResult = await solanaConnection.simulateTransaction(transaction);
    console.log('Simulation Result:', simulationResult);

    if (!simulationResult.value.err) {
      console.log('Transaction Simulation Successful!');
    } else {
      console.error('Transaction Simulation Failed:', simulationResult.value.err);
    }

    return simulationResult;
  } catch (error: any) {
    throw new Error('Failed to Simulate Transaction');
  }
}
