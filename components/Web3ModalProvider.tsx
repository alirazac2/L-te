"use client";

import { createContext, ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { mainnet } from "@reown/appkit/networks";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";

// ---------------------
// 🔥 Fixed KiteAI Testnet Chain
// ---------------------
export const kiteAI = {
  id: 2368,
  caipNetworkId: "eip155:2368",
  chainNamespace: "eip155",

  chainId: 2368,
  name: "KiteAI Testnet",
  nativeCurrency: {
    name: "KAI",
    symbol: "KAI",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.gokite.ai/"],
    },
  },
  blockExplorers: {
    default: {
      name: "KiteAI Explorer",
      url: "https://explorer.gokite.ai/",
    },
  },
};

// ---------------------

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error("❌ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID missing in .env");
}

// Metadata
const metadata = {
  name: "ZK3.xyz",
  description: "ZK3.xyz Web3 App",
  url: "https://zk3.xyz",
  icons: ["https://zk3.xyz/icon.png"],
};

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  // Initialize Web3Modal AppKit
  createAppKit({
    adapters: [new Ethers5Adapter()],

    // IMPORTANT: Fixed networks array
    networks: [mainnet, kiteAI],

    defaultNetwork: kiteAI,
    metadata,
    projectId,
  });

  return <>{children}</>;
}
