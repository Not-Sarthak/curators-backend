import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ServiceRegistry } from "../../services";
import {
  lstListResponseSchema,
  lstDetailResponseSchema,
  mintAddressParamSchema,
} from "../../lib/schema/lst-schema";

/**
 * LST routes
 * @param fastify The Fastify instance
 * @param serviceRegistry The service registry
 */
export const registerLstRoutes = (
  fastify: FastifyInstance,
  serviceRegistry: ServiceRegistry
) => {
  const lstService = serviceRegistry.getLstService();

  fastify.get("/lst/available", {
    schema: {
      response: {
        200: lstListResponseSchema,
      },
    },
    handler: async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const lsts = await lstService.getAllLsts();
        return reply.send(lsts);
      } catch (error) {
        console.error("Error fetching available LSTs:", error);
        return reply.status(500).send({ error: "Failed to fetch available LSTs" });
      }
    },
  });

  fastify.get("/lst/:mintAddress", {
    schema: {
      params: mintAddressParamSchema,
      response: {
        200: lstDetailResponseSchema,
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { mintAddress } = request.params as { mintAddress: string };
        const lst = await lstService.getLstTokenByMintAddress(mintAddress);

        if (!lst) {
          return reply.status(404).send({ error: `LST with mint address ${mintAddress} not found` });
        }

        return reply.send(lst);
      } catch (error) {
        console.error(`Error fetching LST by mint address:`, error);
        return reply.status(500).send({ error: "Failed to fetch LST details" });
      }
    },
  });
};