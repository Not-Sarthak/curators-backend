import { Keypair, VersionedTransaction, TransactionMessage, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { connection } from '../../config';
import { findHowFarJitoLeaderIs, sendBundle } from '../jito-module/jito';
import { deserializeTransaction } from './deserialize-transaction';
import { getSwapTxn } from './get-swap-transaction';
import { signTransaction } from './sign-transaction';
import { getSignature } from '../../lib/utils';

async function waitForTransactionConfirmation(signature: string, maxRetries = 30): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    const status = await connection.getSignatureStatus(signature);
    if (status?.value?.confirmationStatus === 'confirmed' || status?.value?.confirmationStatus === 'finalized') {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

/**
 * Executes a swap using either Jito MEV protection or regular Jupiter swap
 * @param inputMint Input token mint address
 * @param outputMint Output token mint address
 * @param amount Amount to swap
 * @param walletKeypair Wallet keypair for signing
 * @param maxJitoSlotDistance Maximum acceptable distance to Jito leader slot (default 10)
 * @returns Object containing transaction hash and whether MEV protection was used
 */
export async function executeSwapWithMevProtection(
  inputMint: string,
  outputMint: string,
  amount: number,
  walletKeypair: Keypair,
  maxJitoSlotDistance = 10
): Promise<{ txHash: string; usedMevProtection: boolean }> {
  try {
    // Get the swap transaction from Jupiter
    const { swapObj } = await getSwapTxn(
      inputMint,
      outputMint,
      amount,
      walletKeypair.publicKey.toString()
    );

    // Deserialize and prepare the transaction
    const { tx, addressLookupTableAccounts } = await deserializeTransaction(
      swapObj.swapTransaction
    );

    const message = TransactionMessage.decompile(tx.message, {
      addressLookupTableAccounts,
    });

    const transaction = new VersionedTransaction(
      message.compileToV0Message(addressLookupTableAccounts)
    );

    // Always get latest blockhash before signing
    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.message.recentBlockhash = latestBlockhash.blockhash;

    const signedTransaction = await signTransaction(
      transaction,
      walletKeypair,
      0.001 * LAMPORTS_PER_SOL
    );

    const txHash = getSignature(signedTransaction);
    console.log('Transaction signature:', txHash);

    try {
      const jitoSlotDistance = await findHowFarJitoLeaderIs();
      console.log('Jito leader slot distance:', jitoSlotDistance);

      if (jitoSlotDistance <= maxJitoSlotDistance) {
        console.log('Using Jito MEV protection for swap');
        await sendBundle([signedTransaction], [walletKeypair]);
        console.log('Jito bundle sent for transaction:', txHash);
        
        // Wait for transaction confirmation with increased timeout for Jito
        const isConfirmed = await waitForTransactionConfirmation(txHash, 60);
        if (!isConfirmed) {
          console.log('Jito bundle not confirmed, falling back to regular swap');
          throw new Error('Transaction failed to confirm within timeout');
        }

        return { txHash, usedMevProtection: true };
      }

      console.log('Jito leader too far, using regular swap');
    } catch (jitoError) {
      console.warn('Failed to check Jito availability, falling back to regular swap:', jitoError);
    }

    // Fall back to regular Jupiter swap
    console.log('Executing regular Jupiter swap');
    
    // Re-sign the transaction with a new blockhash
    const newSignedTransaction = await signTransaction(
      transaction,
      walletKeypair,
      0.001 * LAMPORTS_PER_SOL
    );
    
    const newTxHash = getSignature(newSignedTransaction);
    console.log('Regular swap transaction signature:', newTxHash);
    
    await connection.sendTransaction(newSignedTransaction, {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
      maxRetries: 3
    });
    
    // Wait for transaction confirmation
    const isConfirmed = await waitForTransactionConfirmation(newTxHash, 45);
    if (!isConfirmed) {
      throw new Error('Transaction failed to confirm within timeout');
    }

    console.log('Regular swap transaction confirmed:', newTxHash);
    return { txHash: newTxHash, usedMevProtection: false };

  } catch (error) {
    console.error('Error executing swap:', error);
    throw error;
  }
} 