import { Connection } from '@solana/web3.js';

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

export const solanaConnection = new Connection(RPC_URL);
