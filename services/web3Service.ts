import { ethers } from 'ethers';
import { BASE_MAINNET_ID, BASE_SEPOLIA_ID, CHAINS } from '../constants';

/**
 * Helper to extract a readable error message from various RPC/Ethers error objects.
 */
const getRpcErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;

  // Rate Limiting (HTTP 429)
  if (error?.code === 429 || error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
    return "RPC Rate Limit Exceeded. Please try again later.";
  }

  // User rejected the request (e.g., in Wallet)
  if (error?.code === 4001 || error?.code === 'ACTION_REJECTED') {
      return "User rejected the transaction.";
  }

  // Ethers.js Revert Reason
  if (error?.reason) {
      return `Transaction failed: ${error.reason}`;
  }

  // Ethers.js Argument Errors (e.g. invalid ABI or args)
  if (error?.code === 'INVALID_ARGUMENT') {
      return `Invalid Argument: ${error.argument} (Value: ${error.value})`;
  }

  // Standard Error Message
  if (error?.message) {
      return error.message;
  }

  // JSON-RPC Nested Data
  if (error?.data?.message) {
      return error.data.message;
  }

  // Fallback: Attempt to stringify if it's an object
  try {
      return JSON.stringify(error);
  } catch {
      return "Unknown RPC Error occurred.";
  }
};

/**
 * Checks balance using the provided Ethers provider
 */
export const getBalance = async (provider: ethers.providers.Provider, address: string): Promise<string> => {
  try {
    const balance = await provider.getBalance(address);
    // Return full resolution for formatting
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return '0';
  }
};

/**
 * Gets current block number
 */
export const getBlockNumber = async (provider: ethers.providers.Provider): Promise<number> => {
  try {
    return await provider.getBlockNumber();
  } catch (error) {
    console.error("Error fetching block number:", error);
    return 0;
  }
};

/**
 * Switch network using the provider's JSON-RPC interface
 */
export const switchNetwork = async (provider: ethers.providers.JsonRpcProvider, targetChainId: string): Promise<boolean> => {
  try {
    await provider.send('wallet_switchEthereumChain', [{ chainId: targetChainId }]);
    return true;
  } catch (error: any) {
    const errorMsg = getRpcErrorMessage(error);
    console.error("Failed to switch network:", errorMsg);

    // If the error indicates the chain is not added (code 4902) or other common issues, try adding it
    if (error?.code === 4902 || errorMsg.includes('Unrecognized chain') || errorMsg.includes('Missing or invalid')) {
      const chainConfig = CHAINS[targetChainId];
      if (chainConfig) {
        try {
          console.log(`Attempting to add chain ${targetChainId}...`);
          await provider.send('wallet_addEthereumChain', [{
            chainId: chainConfig.chainId,
            chainName: chainConfig.chainName,
            nativeCurrency: chainConfig.nativeCurrency,
            rpcUrls: chainConfig.rpcUrls,
            blockExplorerUrls: chainConfig.blockExplorerUrls
          }]);
          return true;
        } catch (addError: any) {
          console.error("Failed to add network:", getRpcErrorMessage(addError));
          return false;
        }
      }
    }
    return false;
  }
};

/**
 * Sends a transaction using the Ethers Signer
 */
export const sendTransaction = async (signer: ethers.Signer, to: string, amount: string): Promise<string> => {
  try {
    const tx = await signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount)
    });
    return tx.hash;
  } catch (error: any) {
    const msg = getRpcErrorMessage(error);
    console.error("Transaction failed:", msg);
    throw new Error(msg);
  }
};

/**
 * Deploys a smart contract
 */
export const deployContract = async (
    signer: ethers.Signer, 
    abi: any[], 
    bytecode: string, 
    args: any[]
): Promise<string> => {
    try {
        const factory = new ethers.ContractFactory(abi, bytecode, signer);
        const contract = await factory.deploy(...args);
        await contract.deployed();
        return contract.address;
    } catch (error: any) {
        const msg = getRpcErrorMessage(error);
        console.error("Deployment failed:", msg);
        throw new Error(msg);
    }
};

/**
 * Executes a function on a deployed smart contract
 */
export const executeContractFunction = async (
    signer: ethers.Signer,
    address: string,
    abi: any[],
    functionName: string,
    args: any[]
): Promise<string> => {
    try {
        const contract = new ethers.Contract(address, abi, signer);
        
        if (typeof contract[functionName] !== 'function') {
            throw new Error(`Function "${functionName}" not found in contract ABI.`);
        }

        const tx = await contract[functionName](...args);
        
        // If it's a write transaction, wait for it
        if (tx.wait) {
            await tx.wait();
            return `Transaction successful: ${tx.hash}`;
        }
        
        // If it's a read function, return the result
        return String(tx);
    } catch (error: any) {
        const msg = getRpcErrorMessage(error);
        console.error("Contract Execution failed:", msg);
        throw new Error(msg);
    }
};