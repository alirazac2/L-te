export const API_CONFIG = {
  BASE_MAINNET: {
    CHAIN_ID: 8453,
    BLOCKSCOUT_URL: 'https://base.blockscout.com/api/v2/addresses',
  },
  BASE_SEPOLIA: {
    CHAIN_ID: 84532,
    BLOCKSCOUT_URL: 'https://base-sepolia.blockscout.com/api/v2/addresses',
  }
};

export const getExplorerApiUrl = (chainId: number): string | null => {
  if (chainId === API_CONFIG.BASE_MAINNET.CHAIN_ID) return API_CONFIG.BASE_MAINNET.BLOCKSCOUT_URL;
  if (chainId === API_CONFIG.BASE_SEPOLIA.CHAIN_ID) return API_CONFIG.BASE_SEPOLIA.BLOCKSCOUT_URL;
  return null;
};
