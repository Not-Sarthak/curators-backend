export const lstItemSchema = {
    type: "object",
    properties: {
      mintAddress: { type: "string" },
      symbol: { type: "string" },
      name: { type: "string" },
      currentApy: { type: ["number", "null"], default: 0 },
      avgApyOverHistory: { type: ["number", "string", "null"] },
      logoUrl: { type: ["string", "null"] },
      websiteUrl: { type: ["string", "null"] },
      description: { type: ["string", "null"] },
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
  