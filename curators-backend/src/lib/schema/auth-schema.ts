export const signInBodySchema = {
  type: 'object',
  required: ['walletAddress', 'signature'],
  properties: {
    walletAddress: { type: 'string' },
    signature: { type: 'string' },
  },
};

export const verifyTokenBodySchema = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string' },
  },
};

export const authResponseSchema = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        walletAddress: { type: 'string' },
        status: { type: 'string' },
      },
    },
    token: { type: 'string' },
  },
}; 