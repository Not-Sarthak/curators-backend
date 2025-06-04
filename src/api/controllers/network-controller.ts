import { getNetwork } from '../../modules/solana-module/get-network';
import { NetworkDetails } from '../../types/solana-types';

/**
 * Network Controller
 */
export class NetworkController {
  /**
   * Gets network details
   * @param request The request
   * @param reply The reply
   */
  public getNetworkDetails = async (): Promise<NetworkDetails> => {
    try {
      const networkDetails = await getNetwork();
      console.log('Network Details:', JSON.stringify(networkDetails, null, 2));
      return networkDetails;
    } catch (error) {
      console.error('NetworkController: Error getting Network Details:', error);
      throw error;
    }
  };
}