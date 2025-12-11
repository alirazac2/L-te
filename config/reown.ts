import { createAppKit } from '@reown/appkit/react';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { base, baseSepolia } from '@reown/appkit/networks';

// 1. Get projectId
export const projectId = '50fb989b5ef30d9441add56d35aa87d6';

// 2. Set networks
export const networks = [base, baseSepolia];

// 3. Create a metadata object
const metadata = {
  name: 'ZK3 Based',
  description: 'On-chain AI agent on Base',
  url: 'https://zk3-based.app', // Update with your actual URL
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 4. Create the AppKit instance
export const appKit = createAppKit({
  adapters: [new Ethers5Adapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
    email: false, // Disable Email Login
    socials: [],  // Disable Social Logins (Google, X, etc.)
  }
});