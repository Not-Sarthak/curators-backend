export interface SignInRequestDto {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface SignInResponseDto {
  token: string;
  user: {
    id: string;
    walletAddress: string;
  };
}

export interface VerifyTokenRequestDto {
  token: string;
}

export interface VerifyTokenResponseDto {
  valid: boolean;
  user?: {
    id: string;
    walletAddress: string;
  };
}
