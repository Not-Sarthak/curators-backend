import jwt from 'jsonwebtoken';

/**
 * Verifies a JWT token
 * @param token The token to verify
 * @returns The decoded token payload
 */
export const verifyToken = (token: string): any => {
  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET is not set in environment variables');
      throw new Error('JWT_SECRET is not configured');
    }

    return jwt.verify(token, jwtSecret);
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid token');
  }
};
