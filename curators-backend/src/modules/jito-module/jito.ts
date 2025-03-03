import { VersionedTransaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

import { SearcherClient, searcherClient } from 'jito-ts/dist/sdk/block-engine/searcher';
import { Bundle } from 'jito-ts/dist/sdk/block-engine/types';
import { isError } from 'jito-ts/dist/sdk/block-engine/utils';
import { Keypair } from '@solana/web3.js';
import { checkIfTransactionConfirmed, getSignature } from '../../lib/utils';
import { GlobalJitoTipsResponse, TipAccountsResponse, ScheduledLeaderResponse } from '../../types';
import { connection } from '../../config';

class BundleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BundleError';
  }
}

export async function getMinimumJitoTip(): Promise<number> {
  let headersList = {};

  let response = await fetch('https://worker.jup.ag/jito-floor', {
    method: 'GET',
    headers: headersList,
  });

  let data = (await response.json()) as GlobalJitoTipsResponse;

  return data.landed75;
}

async function getTipAccount(client: SearcherClient): Promise<PublicKey> {
  try {
    const allTipAccounts = (await client.getTipAccounts()) as TipAccountsResponse;
    if (!allTipAccounts.value?.length) {
      throw new BundleError('No Tip Accounts Available');
    }
    return new PublicKey(allTipAccounts.value[0]);
  } catch (error) {
    if (error instanceof Error) {
      throw new BundleError(`Failed to get tip account: ${error.message}`);
    } else {
      throw new BundleError('Failed to get tip account: Unknown error');
    }
  }
}

async function waitForLeaderSlot(client: SearcherClient): Promise<void> {
  const maxAttempts = 20;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const nextLeader = (await client.getNextScheduledLeader()) as ScheduledLeaderResponse;
      if (!nextLeader.ok) {
        throw new BundleError('Failed to get Next Leader');
      }

      const numSlots = nextLeader.value.nextLeaderSlot - nextLeader.value.currentSlot;
      if (numSlots <= 2) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    } catch (error) {
      if (error instanceof Error) {
        throw new BundleError(`Failed to check leader slot: ${error.message}`);
      } else {
        throw new BundleError('Failed to check leader slot: Unknown error');
      }
    }
  }
  throw new BundleError('Timeout waiting for Leader Slot');
}

export async function findHowFarJitoLeaderIs(): Promise<number> {
  const blockEngineURL1 = 'mainnet.block-engine.jito.wtf';
  const blockEngineURL2 = 'block-engine.mainnet.frankfurt.jito.wtf';
  const blockEngineURL3 = 'ny.mainnet.block-engine.jito.wtf';
  const blockEngineURL4 = 'tokyo.mainnet.block-engine.jito.wtf';
  const blockEngineURL5 = 'slc.mainnet.block-engine.jito.wtf';

  const blockEngineURLs = [
    blockEngineURL1,
    blockEngineURL2,
    blockEngineURL3,
    blockEngineURL4,
    blockEngineURL5,
  ];

  let lastError: Error | null = null;

  for (const blockEngineURL of blockEngineURLs) {
    try {
      const client = searcherClient(blockEngineURL);
      const nextLeader = (await client.getNextScheduledLeader()) as ScheduledLeaderResponse;

      if (nextLeader.ok) {
        return nextLeader.value.nextLeaderSlot - nextLeader.value.currentSlot;
      }
    } catch (error) {
      lastError = error as Error;
      continue;
    }
  }
  throw new BundleError('Failed to get Next Leader from all available Endpoints');
}

async function createBundle(
  transactions: VersionedTransaction[],
  bundleLimit: number
): Promise<Bundle> {
  const bundle = new Bundle([], bundleLimit);
  const maybeBundle = bundle.addTransactions(...transactions);

  if (isError(maybeBundle)) {
    throw new BundleError(`Failed to create bundle: ${maybeBundle.message}`);
  }

  return maybeBundle;
}

export async function sendBundle(
  transactions: VersionedTransaction[],
  signers: Keypair[]
): Promise<string> {
  const blockEngineURLs = [
    'mainnet.block-engine.jito.wtf',
    'block-engine.mainnet.frankfurt.jito.wtf',
    'ny.mainnet.block-engine.jito.wtf',
    'tokyo.mainnet.block-engine.jito.wtf',
    'slc.mainnet.block-engine.jito.wtf',
  ];

  let lastError: Error | null = null;

  for (const blockEngineURL of blockEngineURLs) {
    try {
      const client = searcherClient(blockEngineURL);

      const tipAccount = await getTipAccount(client);
      await waitForLeaderSlot(client);

      const blockHash = await connection.getLatestBlockhash();
      let bundleWithTransactions = await createBundle(transactions, 5);

      const p75InSol = await getMinimumJitoTip();
      const tipLamports = Math.round(p75InSol * LAMPORTS_PER_SOL);

      const bundleWithTip = bundleWithTransactions.addTipTx(
        signers[0],
        tipLamports,
        tipAccount,
        blockHash.blockhash
      );

      if (isError(bundleWithTip)) {
        throw new BundleError(`Failed to add tip transaction: ${bundleWithTip.message}`);
      }

      const response = await client.sendBundle(bundleWithTip);
      console.log('Bundle sent:', response);

      if (response.ok) {
        return response.value;
      }
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('already processed transaction') ||
          error.toString().includes('already processed transaction') ||
          error.toString().includes('bundle contains an already processed transaction'))
      ) {
        console.log('Transaction was already processed (success case)');

        if (transactions.length > 0) {
          try {
            const txnSignature = getSignature(transactions[0]);
            console.log('Transaction signature (already processed):', txnSignature);

            try {
              const status = await checkIfTransactionConfirmed(txnSignature);
              if (status) {
                console.log('Transaction confirmed (was already processed)');
                return 'Transaction already processed';
              }
            } catch (verifyError) {
              console.error('Error verifying transaction status:', verifyError);
            }
          } catch (signatureError) {
            console.error('Error getting transaction signature:', signatureError);
          }
        }

        return 'Transaction already processed';
      }

      console.error(`Failed with endpoint ${blockEngineURL}:`, error);
      lastError = error as Error;
      continue;
    }
  }

  throw new BundleError('Failed to send Bundle through all available Endpoints');
}

export function setupBundleResultListener(client: SearcherClient): void {
  client.onBundleResult(
    (result) => {
      console.log('Bundle result:', result);
    },
    (error) => {
      console.error('Bundle result error:', error);
    }
  );
}
