import prisma from '../../lib/prisma';
import { User } from '@prisma/client';

/**
 * Gets a user by ID
 * @param userId The user ID
 * @returns The user
 */
export const getUserById = async (userId: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  return user;
};
