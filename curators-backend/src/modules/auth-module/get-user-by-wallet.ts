import prisma from '../../lib/prisma';
import { User } from '@prisma/client';

/**
 * Gets a user by wallet address
 * @param walletAddress The wallet address
 * @returns The user
 */
export const getUserByWalletAddress = async (
  walletAddress: string
): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { walletAddress } });

  if (!user) {
    throw new Error(`User with wallet address ${walletAddress} not found`);
  }

  return user;
};
