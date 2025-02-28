import { VersionedTransaction, Keypair, Connection } from "@solana/web3.js";

// Load private key from env (JSON array format)
const PRIVATE_KEY = process.env.USER_PRIVATE_KEY ?? '';
const userKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(PRIVATE_KEY)));

/**
 * Signs and sends a Jupiter swap transaction.
 */
export const signAndSendTransaction = async (connection: Connection, swapTransaction: string) => {
  try {
    const transactionBuf = Buffer.from(swapTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(transactionBuf);

    transaction.sign([userKeypair]);

    const txid = await connection.sendTransaction(transaction);
    const latestBlockhash = await connection.getLatestBlockhash();
    const confirmation = await connection.confirmTransaction({
      signature: txid,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    }, 'confirmed');

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err}`);
    }

    return txid;
  } catch (error) {
    throw new Error("Failed to sign and send transaction");
  }
}
