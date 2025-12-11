import { getExplorerApiUrl } from '../config/apiConfig';

/**
 * Fetch tokens held by an address
 * @param chainId Current chain ID (number)
 * @param address Wallet address
 * @param type Optional token type: 'ERC-20' | 'ERC-721' | 'ERC-1155'
 */
export const fetchAddressTokens = async (chainId: number, address: string, type?: string) => {
  const baseUrl = getExplorerApiUrl(chainId);
  if (!baseUrl) {
    return { error: "Explorer API not available for this network." };
  }

  try {
    // Construct URL: {baseUrl}/{address_hash}/tokens?type={type}
    const query = type ? `?type=${type}` : '';
    const url = `${baseUrl}/${address}/tokens${query}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.status === 429) {
      throw new Error("Explorer API usage limit reached. Please try again in a minute.");
    }

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Explorer Service Error (Tokens):", error);
    return { error: error.message || "Failed to fetch tokens" };
  }
};

/**
 * Fetch counters/stats for an address (txn count, token balances count, etc)
 * @param chainId Current chain ID (number)
 * @param address Wallet address
 */
export const fetchAddressCounters = async (chainId: number, address: string) => {
  const baseUrl = getExplorerApiUrl(chainId);
  if (!baseUrl) {
    return { error: "Explorer API not available for this network." };
  }

  try {
    // Construct URL: {baseUrl}/{address_hash}/counters
    const url = `${baseUrl}/${address}/counters`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.status === 429) {
      throw new Error("Explorer API usage limit reached. Please try again in a minute.");
    }

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Explorer Service Error (Counters):", error);
    return { error: error.message || "Failed to fetch counters" };
  }
};