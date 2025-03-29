import { SystemProgram, VersionedTransaction, TransactionMessage, PublicKey, Keypair } from '@solana/web3.js';
import { deserializeTransaction } from './deserialize-transaction';
import encodeBase64Bytes from '../../lib/utils';
import { connection } from '../../config';

export const signTransaction = async (
  txn: VersionedTransaction,
  userWallet: Keypair,
  chargedFees: number,
) => {
  const TREASURY_ADDRESS = 'FLRW6bC3P8RoyGNsgbgd5wJZmnjN9uPXpnCC5aDMMFbT';
  const { tx, addressLookupTableAccounts } = await deserializeTransaction(
    encodeBase64Bytes(txn.serialize())
  );

  const message = TransactionMessage.decompile(tx.message, {
    addressLookupTableAccounts,
  });

  let newIx = SystemProgram.transfer({
    fromPubkey: userWallet.publicKey,
    toPubkey: new PublicKey(TREASURY_ADDRESS),
    lamports: chargedFees,
  });
  console.log('Charged Fees inside signTransaction:', chargedFees);

  message.instructions.push(newIx);

  const latestBlockhash = await connection.getLatestBlockhashAndContext('confirmed');
  message.recentBlockhash = latestBlockhash.value.blockhash;

  txn = new VersionedTransaction(message.compileToV0Message(addressLookupTableAccounts));

  txn.sign([userWallet]);

  return txn;
};