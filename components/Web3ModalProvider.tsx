'use client';

import { createAppKit } from '@reown/appkit/react';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { ReactNode } from 'react';

// 1. Project ID
const projectId = '2bc09c8e71b33c16f19263c1c79f7a69';

// 2. Networks in correct AppKit format

// ------- MAINNET -------
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  chainNamespace: 'eip155' as const,
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://cloudflare-eth.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io'
    }
  }
};

// ------- KITEAI TESTNET -------
const kiteAI = {
  chainId: 2368,
  name: 'KiteAI Testnet',
  chainNamespace: 'eip155' as const,

  nativeCurrency: {
    name: 'KiteAI',
    symbol: 'KITE',
    decimals: 18
  },

  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.gokite.ai']
    }
  },

  blockExplorers: {
    default: {
      name: 'KiteScan',
      url: 'https://testnet.kitescan.ai'
    }
  }
};

// 3. Wallet metadata
const metadata = {
  name: 'ZK3 Bio',
  description: 'Professional Link in Bio with Web3 Features',
  url: 'https://zk3-bio.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 4. Initialize AppKit
try {
  createAppKit({
    adapters: [new Ethers5Adapter()],
    networks: [mainnet, kiteAI],
    defaultNetwork: kiteAI,
    metadata,
    projectId,
    features: {
      analytics: true
    }
  });
} catch (error) {
  console.warn('AppKit initialization failed locally:', error);
}

export default function Web3ModalProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
