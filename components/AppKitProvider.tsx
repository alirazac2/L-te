'use client';

import React, { ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { kiteAINetwork, PROJECT_ID } from '../services/web3Config';

// 1. Initialize AppKit
const metadata = {
    name: 'BioLinker OnChain',
    description: 'A high-performance Link-in-Bio application driven by on-chain data.',
    url: 'https://biolinker.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

createAppKit({
    adapters: [new Ethers5Adapter()],
    networks: [kiteAINetwork],
    metadata,
    projectId: PROJECT_ID,
    enableEmail: false,
    features: {
        analytics: true,
        email: false,
        socials: []
    }
});

export function AppKitProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
