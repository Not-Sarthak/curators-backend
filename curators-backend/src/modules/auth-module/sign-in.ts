import prisma from '../../lib/prisma';
import { generateToken } from './generate-token';
import { User } from '@prisma/client';

/**
 * Signs in a user with their wallet address and signature
 * @param walletAddress The wallet address
 * @param signature The signature
 * @returns The user and token
 */
export const signIn = async (
  walletAddress: string,
  signature: string
): Promise<{ user: User; token: string }> => {
  try {
    console.log('TESTING MODE: Bypassing Signature Verification');

    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      console.log(`Creating new user for wallet: ${walletAddress}`);
      user = await prisma.user.create({
        data: { walletAddress },
      });
    }

    const token = generateToken(user);

    return { user, token };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};
