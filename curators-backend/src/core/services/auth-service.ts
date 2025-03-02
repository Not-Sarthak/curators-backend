import { signIn } from '../../modules/auth-module/sign-in';
import { verifyToken } from '../../modules/auth-module/verify-token';
import { getUserById } from '../../modules/auth-module/get-user-by-id';
import { getUserByWalletAddress } from '../../modules/auth-module/get-user-by-wallet';

export class AuthService {
  public async signIn(walletAddress: string, signature: string) {
    return signIn(walletAddress, signature);
  }

  public verifyToken(token: string) {
    return verifyToken(token);
  }

  public async getUserById(userId: string) {
    return getUserById(userId);
  }

  public async getUserByWalletAddress(walletAddress: string) {
    return getUserByWalletAddress(walletAddress);
  }
}
