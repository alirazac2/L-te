import { createAppKit } from '@reown/appkit/react'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'

// 1. Get projectId from https://cloud.reown.com
export const projectId = '2bc09c8e71b33c16f19263c1c79f7a69'

// 2. Define the KiteAI Testnet Network
export const kiteAI = {
    chainId: 2368,
    name: 'KiteAI Testnet',
    currency: 'KITE',
    explorerUrl: 'https://testnet.kitescan.ai', // Removed trailing slash
    rpcUrl: 'https://rpc-testnet.gokite.ai' // Removed trailing slash
}

// 3. Create a metadata object
const metadata = {
    name: 'ZK3 Bio',
    description: 'Professional Link in Bio with Web3 Features',
    url: 'https://zk3-bio.vercel.app', // Update with production URL
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 4. Create the AppKit instance
export const appKit = createAppKit({
    adapters: [new Ethers5Adapter()],
    networks: [kiteAI],
    metadata,
    projectId,
    features: {
        analytics: true
    }
})

// Export commonly used Web3 constants
export const ACTIVE_CHAIN = kiteAI
export const RPC_URL = kiteAI.rpcUrl
export const EXPLORER_URL = kiteAI.explorerUrl
