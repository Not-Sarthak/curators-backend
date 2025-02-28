export const lstItemSchema = {
    type: "object",
    properties: {
      mintAddress: { type: "string" },
      symbol: { type: "string" },
      name: { type: "string" },
      token_program: { type: "string" },
      decimals: { type: "number" },
      imageUrl: { type: ["string", "null"] },
      currentApy: { type: ["number", "string", "null"] },
      currentPriceSol: { type: ["number", "null"] },
      totalLiquiditySol: { type: ["number", "null"] },
      marketCapSol: { type: ["number", "null"] },
      avgApyOverHistory: { type: ["string", "null"] },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  };
  
  export const lstListResponseSchema = {
    type: "array",
    items: lstItemSchema,
  };
  
  export const lstDetailResponseSchema = lstItemSchema;
  
  export const mintAddressParamSchema = {
    type: "object",
    properties: {
      mintAddress: { type: "string" },
    },
    required: ["mintAddress"],
  };
  