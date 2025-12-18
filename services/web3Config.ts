
import { MainRegistryABI, ProfileHubABI } from './abis';
import { AppKitNetwork } from '@reown/appkit/networks';

export const PROJECT_ID = '50fb989b5ef30d9441add56d35aa87d6';

export const kiteAI = {
    chainId: 2368,
    chainIdHex: '0x940',
    name: 'KiteAI Testnet',
    currency: 'KITE',
    explorerUrl: 'https://testnet.kitescan.ai',
    rpcUrl: 'https://rpc-testnet.gokite.ai'
};

// Reown Network Definition
export const kiteAINetwork = {
  id: 2368,
  name: 'KiteAI Testnet',
  network: 'kiteai-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'KITE',
    symbol: 'KITE',
  },
  rpcUrls: {
    default: { http: ['https://rpc-testnet.gokite.ai'] },
    public: { http: ['https://rpc-testnet.gokite.ai'] },
  },
  blockExplorers: {
    default: { name: 'KiteScan', url: 'https://testnet.kitescan.ai' },
  },
  testnet: true,
} as const; 

export const CONTRACTS = {
    MAIN_REGISTRY: {
        address: '0xC6144A7a09E633F902B6A407db9788A0f40E6f25',
        abi: MainRegistryABI
    },
    PROFILE_HUB: {
        // Current Hub for new user registrations
        address: '0x85BD36C574837FD01A024E3f8D242f97E55a836A',
        abi: ProfileHubABI
    },
    LEGACY_PROFILE_HUBS: [
        '0x668fd4332a072AF26589157d6B13472BDd2B025c',
        '0xE453eD52f4787B891EEF2817a3B8EBd94e9F0cee'
    ]
};
