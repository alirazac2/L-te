
export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  isLoading?: boolean;
  timestamp: number;
}

export interface ContractMetadata {
  address: string;
  abi: any[];
  sourceCode: string;
  deployedAt: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
  contractData?: ContractMetadata; // Stores the single contract allowed per session
  type?: 'chat' | 'zbaso'; // Distinguish session type
}

export interface ChainConfig {
  chainId: string; // Hex string, e.g., '0x2105'
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export type WalletState = {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
};

// Tool types
export interface TransactionRequest {
  to: string;
  value: string; // in ETH string
}
