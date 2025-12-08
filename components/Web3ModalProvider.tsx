'use client'

import { createAppKit } from '@reown/appkit/react'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import { ReactNode } from 'react'

// 1. Get projectId
const projectId = '2bc09c8e71b33c16f19263c1c79f7a69'

// 2. Set the networks
const kiteAI = {
    chainId: 2368,
    name: 'KiteAI Testnet',
    currency: 'KITE',
    explorerUrl: 'https://testnet.kitescan.ai',
    rpcUrl: 'https://rpc-testnet.gokite.ai',
    chainNamespace: 'eip155' as const // Ensure this is cast to const
}

// Add Mainnet as a fallback/standard network to ensure wallet compatibility
const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com',
    chainNamespace: 'eip155' as const
}

// 3. Create a metadata object
const metadata = {
    name: 'ZK3 Bio',
    description: 'Professional Link in Bio with Web3 Features',
    url: 'https://zk3-bio.vercel.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 4. Create the AppKit instance
try {
    createAppKit({
        adapters: [new Ethers5Adapter()],
        networks: [mainnet, kiteAI], // Add mainnet first to ensure initialization success
        defaultNetwork: kiteAI, // Set KiteAI as default
        metadata,
        projectId,
        features: {
            analytics: true
        }
    })
} catch (error) {
    console.warn('AppKit initialization failed locally:', error)
}

export default function Web3ModalProvider({ children }: { children: ReactNode }) {
    return <>{children}</>
}
