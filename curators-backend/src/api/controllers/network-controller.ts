import { FastifyRequest, FastifyReply } from 'fastify';
import { getNetwork } from '../../modules/solana-module/get-network';
import { NetworkDetails } from '../../types/solana-types';

/**
 * Network controller
 */
export class NetworkController {
  /**
   * Gets network details
   * @param request The request
   * @param reply The reply
   */
  public getNetworkDetails = async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<NetworkDetails> => {
    try {
      const networkDetails = await getNetwork();
      console.log('Network Details:', JSON.stringify(networkDetails, null, 2));
      
      // Validate that we have all required fields
      if (!this.isValidNetworkDetails(networkDetails)) {
        throw new Error('Invalid network details response structure');
      }

      return networkDetails;
    } catch (error) {
      console.error('NetworkController: Error getting network details:', error);
      throw error;
    }
  };

  private isValidNetworkDetails(data: any): data is NetworkDetails {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.version === 'string' &&
      typeof data.cluster === 'string' &&
      data.epochInfo &&
      typeof data.epochInfo === 'object' &&
      data.epochInfo.current &&
      typeof data.epochInfo.current === 'object' &&
      typeof data.epochInfo.progress === 'number' &&
      typeof data.epochInfo.timeRemaining === 'string' &&
      data.inflation &&
      typeof data.inflation === 'object' &&
      data.inflation.current &&
      typeof data.inflation.current === 'object' &&
      typeof data.inflation.baseSolStakingApy === 'number' &&
      data.stats &&
      typeof data.stats === 'object' &&
      data.supply &&
      typeof data.supply === 'object' &&
      data.performance &&
      typeof data.performance === 'object' &&
      data.health &&
      typeof data.health === 'object' &&
      typeof data.health.status === 'string' &&
      ['healthy', 'degraded', 'down'].includes(data.health.status) &&
      typeof data.health.lastUpdated === 'string'
    );
  }
}