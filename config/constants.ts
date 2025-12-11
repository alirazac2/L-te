
import { ChainConfig } from './types';

export const BASE_MAINNET_ID = '0x2105'; // 8453
export const BASE_SEPOLIA_ID = '0x14a34'; // 84532

// Official Hardcore Contract Addresses
export const TOKEN_MANAGER_ADDRESS_SEPOLIA = '0xD4Fc541236927E2EAf8F27606bD7309C1Fc2cbee';
export const TOKEN_MANAGER_ADDRESS_MAINNET = '0x75A41df3FB663f737b0972B9f84ce61e623FE46F';

export const CHAINS: Record<string, ChainConfig> = {
  [BASE_MAINNET_ID]: {
    chainId: BASE_MAINNET_ID,
    chainName: 'Base Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
  },
  [BASE_SEPOLIA_ID]: {
    chainId: BASE_SEPOLIA_ID,
    chainName: 'Base Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
  },
};
