import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import * as Web3Service from './web3Service';
import * as ExplorerService from './explorerService';
import * as CompilerService from './compilerService';
import { TEMPLATES } from './contracts/templates';
import { BASE_MAINNET_ID, BASE_SEPOLIA_ID, TOKEN_MANAGER_ADDRESS_MAINNET, TOKEN_MANAGER_ADDRESS_SEPOLIA } from "../constants";
import { TOKEN_MANAGER_ABI, STANDARD_TOKEN_ABI } from "../config/abis";
import { ethers } from "ethers";

// Tool Definitions
const getBalanceTool: FunctionDeclaration = {
  name: 'get_balance',
  description: 'Get the native ETH balance of a specific wallet address or the currently connected user.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: {
        type: Type.STRING,
        description: 'The wallet address to check. If checking the user\'s own balance, use "user_current".',
      },
    },
    required: ['address'],
  },
};

const getBlockNumberTool: FunctionDeclaration = {
  name: 'get_block_number',
  description: 'Get the current block number (height) of the blockchain.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const switchNetworkTool: FunctionDeclaration = {
  name: 'switch_network',
  description: 'Switch the wallet network to either Base Mainnet or Base Sepolia.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      network: {
        type: Type.STRING,
        enum: ['mainnet', 'sepolia'],
        description: 'The target network.',
      },
    },
    required: ['network'],
  },
};

const sendTransactionTool: FunctionDeclaration = {
  name: 'request_transaction',
  description: 'Propose a transaction to send ETH. This initiates the wallet prompt for the user.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      to: {
        type: Type.STRING,
        description: 'The recipient address.',
      },
      amount: {
        type: Type.STRING,
        description: 'The amount of ETH to send (e.g., "0.01").',
      },
    },
    required: ['to', 'amount'],
  },
};

const getTokenBalancesTool: FunctionDeclaration = {
  name: 'get_token_balances',
  description: 'Get a list of tokens held by an address. You MUST specify the type.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: {
        type: Type.STRING,
        description: 'The wallet address. Use "user_current" for the connected user.',
      },
      type: {
        type: Type.STRING,
        enum: ['ERC-20', 'ERC-721', 'ERC-1155'],
        description: 'REQUIRED. Use "ERC-20" for normal tokens/currencies. Use "ERC-721" for NFTs/Collectibles.',
      },
    },
    required: ['address', 'type'],
  },
};

const getWalletStatsTool: FunctionDeclaration = {
  name: 'get_wallet_stats',
  description: 'Get statistical counters for a wallet address, such as total transactions, and token transfers.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: {
        type: Type.STRING,
        description: 'The wallet address. Use "user_current" for the connected user.',
      },
    },
    required: ['address'],
  },
};

// --- Smart Contract Tools ---

const getContractTemplateTool: FunctionDeclaration = {
    name: 'get_contract_template',
    description: 'Get the source code for the TokenManager contract.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            templateName: {
                type: Type.STRING,
                enum: ['TokenManager'],
                description: 'The name of the template.',
            }
        },
        required: ['templateName']
    }
};

const compileContractTool: FunctionDeclaration = {
    name: 'compile_contract',
    description: 'Compiles Solidity source code and returns the ABI and Bytecode.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            sourceCode: {
                type: Type.STRING,
                description: 'The complete Solidity source code.',
            }
        },
        required: ['sourceCode']
    }
};

const deployContractTool: FunctionDeclaration = {
    name: 'deploy_contract',
    description: 'Deploys a compiled smart contract to the network.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            abi: {
                type: Type.STRING, // Passing as stringified JSON to avoid schema complexity
                description: 'The JSON stringified ABI of the contract.',
            },
            bytecode: {
                type: Type.STRING,
                description: 'The compiled contract bytecode.',
            },
            constructorArgs: {
                type: Type.ARRAY,
                description: 'Array of arguments for the constructor.',
                items: { type: Type.STRING } // Simplified to strings for now
            }
        },
        required: ['abi', 'bytecode']
    }
};

const callContractTool: FunctionDeclaration = {
    name: 'call_contract_function',
    description: 'Calls a function on a deployed smart contract (read or write).',
    parameters: {
        type: Type.OBJECT,
        properties: {
            address: {
                type: Type.STRING,
                description: 'The contract address.',
            },
            abi: {
                type: Type.STRING, // Passing as stringified JSON
                description: 'The JSON stringified ABI of the contract.',
            },
            functionName: {
                type: Type.STRING,
                description: 'The name of the function to call.',
            },
            args: {
                type: Type.ARRAY,
                description: 'Array of arguments for the function.',
                items: { type: Type.STRING }
            }
        },
        required: ['address', 'abi', 'functionName']
    }
};

const tools: Tool[] = [{
  functionDeclarations: [
    getBalanceTool, 
    getBlockNumberTool, 
    switchNetworkTool, 
    sendTransactionTool,
    getTokenBalancesTool,
    getWalletStatsTool,
    getContractTemplateTool,
    compileContractTool,
    deployContractTool,
    callContractTool
  ]
}];

// System Instruction Construction
const systemInstruction = `
You are "ZK3 Based", an advanced AI assistant living on the Base Blockchain.
Your goal is to help users interact with Base Mainnet and Base Sepolia.

### 🌐 EXPLORER LINKS (MANDATORY)
For EVERY transaction (send ETH, deploy contract, contract call), you MUST provide a direct Markdown link to the block explorer.
- **Base Mainnet**: \`https://basescan.org/tx/{txHash}\`
- **Base Sepolia**: \`https://sepolia.basescan.org/tx/{txHash}\`

### 📝 SMART CONTRACT WORKFLOW
1. **Writing/Deploying**: You can write and compile **ANY** valid Solidity smart contract.
   - **One Contract Per Session**: You can only deploy **ONE** new contract per chat session.
   - **Flattened Code**: The compiler runs in the browser. **YOU MUST WRITE FLATTENED CODE**. Do not use external imports.

### 🔥 HARDCORE ACTIONS (Batch Send & Burn)
If the user asks to **Send Tokens**, **Batch Send**, **Send Native ETH**, or **Burn Tokens** and they are NOT referring to a contract they just deployed in this chat, you MUST use the **Official TokenManager Contract**.

**Official TokenManager Addresses:**
- **Base Mainnet**: \`${TOKEN_MANAGER_ADDRESS_MAINNET}\`
- **Base Sepolia**: \`${TOKEN_MANAGER_ADDRESS_SEPOLIA}\`

**Action Map:**

1. **Send ETH (Native)**:
   - Single: Call \`sendNative(recipient)\` (Value = amount)
   - Batch: Call \`sendNativeMultiple(recipients[])\` (Value = total amount)
   - Batch Custom: Call \`sendNativeMultipleCustom(recipients[], amounts[])\` (Value = total amount)

2. **Send Tokens (ERC20)**:
   - **Step 1**: Call \`approve(TokenManagerAddress, amount)\` on the token contract.
   - **Step 2**: 
     - Single: \`sendToken(token, recipient, amount)\`
     - Batch: \`sendTokensMultiple(token, recipients[], amount)\`
     - Batch Custom: \`sendTokensMultipleCustom(token, recipients[], amounts[])\`

3. **Burn Tokens**:
   - **Step 1**: Call \`approve(TokenManagerAddress, amount)\` on the token contract.
   - **Step 2**: Call \`burnToken(token, amount)\` on TokenManager.

**IMPORTANT**: 
- Determine the correct **TokenManager Address** based on the user's current network.
- The system automatically provides the ABI for these addresses, so you can pass \`[]\` or \`null\` for the ABI parameter in \`call_contract_function\` when using these specific addresses.

### 🛡️ TOKEN DISPLAY RULES
1. **Malicious Names/Symbols**: URLs, "Claim", "Reward", "Voucher", "Airdrop" -> **SPAM**.
2. **Impersonation**: Fake stablecoins (e.g., "USDC-Reward").
3. **Suspicious Supply**: > 1B with 0 value.
4. **Output Format**:
   **💰 Assets**
   [Legit tokens]
   **🗑️ Potential Spam**
   [Spam tokens]

Be concise, helpful, and use a cyberpunk/tech persona.
`;

export interface ToolContext {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  userAddress: string | null;
}

// Helper to execute tools
export const handleToolCall = async (
  functionCall: any, 
  context: ToolContext
): Promise<any> => {
  const { name, args } = functionCall;
  
  // Basic validation
  if (!context.provider && name !== 'compile_contract' && name !== 'get_contract_template') { 
    return { error: "Wallet not connected. Please connect your wallet first." };
  }

  // Resolve address helper
  const getAddress = (input: string) => input === 'user_current' ? context.userAddress : input;

  switch (name) {
    case 'get_balance':
      const balanceAddr = getAddress(args.address);
      if (!balanceAddr) return { error: "No address provided or wallet not connected." };
      return { balance: await Web3Service.getBalance(context.provider!, balanceAddr) };
    
    case 'get_block_number':
      return { blockNumber: await Web3Service.getBlockNumber(context.provider!) };
      
    case 'switch_network':
      const targetId = args.network === 'mainnet' ? BASE_MAINNET_ID : BASE_SEPOLIA_ID;
      const switchSuccess = await Web3Service.switchNetwork(context.provider!, targetId);
      return { success: switchSuccess, message: switchSuccess ? `Switched to ${args.network}` : `Failed to switch to ${args.network}` };
    
    case 'request_transaction':
      if (!context.signer) return { error: "Wallet connected but signer not available." };
      try {
        const txHash = await Web3Service.sendTransaction(context.signer, args.to, args.amount);
        return { success: true, txHash };
      } catch (e: any) {
        return { success: false, error: e.message };
      }

    case 'get_token_balances': {
      const tokenAddr = getAddress(args.address);
      if (!tokenAddr) return { error: "Address required." };
      const network = await context.provider!.getNetwork();
      const type = args.type || 'ERC-20';
      return await ExplorerService.fetchAddressTokens(network.chainId, tokenAddr, type);
    }

    case 'get_wallet_stats': {
      const statsAddr = getAddress(args.address);
      if (!statsAddr) return { error: "Address required." };
      const network = await context.provider!.getNetwork();
      return await ExplorerService.fetchAddressCounters(network.chainId, statsAddr);
    }

    case 'get_contract_template':
        const template = TEMPLATES[args.templateName];
        if (!template) return { error: `Template '${args.templateName}' not found.` };
        return { sourceCode: template, message: `Loaded template: ${args.templateName}` };

    case 'compile_contract':
        try {
            return await CompilerService.compileSource(args.sourceCode);
        } catch (e: any) {
            return { error: e.message };
        }

    case 'deploy_contract':
        if (!context.signer) return { error: "Wallet signer required." };
        try {
            const abi = typeof args.abi === 'string' ? JSON.parse(args.abi) : args.abi;
            const argsList = args.constructorArgs || [];
            const deployedAddress = await Web3Service.deployContract(context.signer, abi, args.bytecode, argsList);
            return { success: true, contractAddress: deployedAddress, message: "Contract deployed successfully!" };
        } catch (e: any) {
            return { success: false, error: e.message };
        }

    case 'call_contract_function':
        if (!context.signer) return { error: "Wallet signer required." };
        try {
            // Check if AI is trying to use the predefined TokenManager or a custom one
            let abiToUse = args.abi;
            
            // Auto-inject TokenManager ABI for known addresses (Case Insensitive)
            if (args.address && (
                args.address.toLowerCase() === TOKEN_MANAGER_ADDRESS_MAINNET.toLowerCase() ||
                args.address.toLowerCase() === TOKEN_MANAGER_ADDRESS_SEPOLIA.toLowerCase()
            )) {
                 abiToUse = TOKEN_MANAGER_ABI;
            } else if (typeof abiToUse === 'string') {
                 abiToUse = JSON.parse(abiToUse);
            }
            
            const argsList = args.args || [];
            const result = await Web3Service.executeContractFunction(context.signer, args.address, abiToUse, args.functionName, argsList);
            return { success: true, result };
        } catch (e: any) {
            return { success: false, error: e.message };
        }

    default:
      return { error: 'Unknown tool' };
  }
};

export const createGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getSystemInstruction = () => systemInstruction;
export const getTools = () => tools;