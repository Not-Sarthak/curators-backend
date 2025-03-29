import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

/**
 * Generates a JWT token for a user
 * @param user The user
 * @returns The token
 */
export const generateToken = (user: User): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not set in environment variables');
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      userId: user.id,
      walletAddress: user.walletAddress,
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
};
