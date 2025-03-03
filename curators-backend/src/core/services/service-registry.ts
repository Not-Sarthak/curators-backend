import { PrismaClient } from '@prisma/client';
import { SolanaService } from './solana-service';
import { ProfitabilityService } from './profitability-service';
import { UserService } from './user-service';
import { TransactionService } from './transaction-service';
import { LstService } from './lst-service';
import { AuthService } from './auth-service';
import { SanctumService } from './sanctum-service';
import prisma from '../../lib/prisma';
import { Keypair } from '@solana/web3.js';
import { parseSolanaPrivateKey } from '../../lib/utils';

/**
 * Registry for all services
 */
export class ServiceRegistry {
  private readonly solanaService: SolanaService;
  private readonly sanctumService: SanctumService
  private readonly profitabilityService: ProfitabilityService;
  private readonly userService: UserService;
  private readonly transactionService: TransactionService;
  private readonly lstService: LstService;
  private readonly authService: AuthService;
  private readonly walletKeypair: Keypair;

  /**
   * Creates a new ServiceRegistry instance
   */
  constructor() {
    // Initialize services
    this.solanaService = new SolanaService();
    this.sanctumService = new SanctumService();
    this.profitabilityService = new ProfitabilityService();
    this.userService = new UserService(this.sanctumService);
    this.transactionService = new TransactionService();
    this.lstService = new LstService();
    this.authService = new AuthService();

    const privateKeyString = process.env.SOLANA_WALLET_PRIVATE_KEY;
    if (!privateKeyString) {
      throw new Error('SOLANA_WALLET_PRIVATE_KEY environment variable is not set');
    }

    const privateKey = parseSolanaPrivateKey(privateKeyString);
    if (!privateKey) {
      throw new Error('Invalid wallet private key format');
    }

    this.walletKeypair = Keypair.fromSecretKey(privateKey);
  }

  /**
   * Gets the Prisma client
   * @returns The Prisma client
   */
  public getPrisma(): PrismaClient {
    return prisma;
  }

  /**
   * Gets the Solana service
   * @returns The Solana service
   */
  public getSolanaService(): SolanaService {
    return this.solanaService;
  }

  /**
   * Gets the Sanctum service
   * @returns The Sanctum service
   */
  public getSanctumService(): SanctumService {
    return this.sanctumService;
  }

  /**
   * Gets the profitability service
   * @returns The profitability service
   */
  public getProfitabilityService(): ProfitabilityService {
    return this.profitabilityService;
  }

  /**
   * Gets the portfolio service
   * @returns The portfolio service
   */
  public getUserService(): UserService {
    return this.userService;
  }

  /**
   * Gets the transaction service
   * @returns The transaction service
   */
  public getTransactionService(): TransactionService {
    return this.transactionService;
  }

  /**
   * Gets the LST service
   * @returns The LST service
   */
  public getLstService(): LstService {
    return this.lstService;
  }

  /**
   * Gets the auth service
   * @returns The auth service
   */
  public getAuthService(): AuthService {
    return this.authService;
  }

  public getWalletKeypair(): Keypair {
    return this.walletKeypair;
  }

  /**
   * Initializes all services
   */
  public async initialize() {
    try {
      await prisma.$connect();
      console.log('Connected to the Database');

      console.log('All Services Initialized Successfully');
    } catch (error) {
      console.error('Error Initializing Services:', error);
      throw new Error('Failed to Initialize Services');
    }
  }

  /**
   * Shuts down all services
  **/
  public async shutdown() {
    try {
      await prisma.$disconnect();
      console.log('Disconnected from the Database');

      console.log('All Services Shut Down Successfully');
    } catch (error) {
      console.error('Error Shutting Down Services:', error);
      throw new Error('Failed to Shut Down Services');
    }
  }
} 