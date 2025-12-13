import { ethers } from 'ethers';
import { CONTRACTS, kiteAI } from './web3Config';
import { ProfileContractABI, ProfileHubABI } from './abis';
import { UserProfile, ThemeType } from '../types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Read-only provider for fetching data without wallet
const readProvider = new ethers.providers.JsonRpcProvider(kiteAI.rpcUrl);

export const connectWallet = async () => {
  if (!window.ethereum) throw new Error("No wallet found");
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []); // Forces popup if not connected
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();

  // Validate Chain
  if (network.chainId !== kiteAI.chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: kiteAI.chainIdHex }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: kiteAI.chainIdHex,
              chainName: kiteAI.name,
              nativeCurrency: {
                name: kiteAI.currency,
                symbol: kiteAI.currency,
                decimals: 18,
              },
              rpcUrls: [kiteAI.rpcUrl],
              blockExplorerUrls: [kiteAI.explorerUrl],
            },
          ],
        });
      }
    }
  }

  // Persist connection state
  localStorage.setItem('bioLinkerWalletConnected', 'true');

  return { provider, signer, address };
};

/**
 * Checks if wallet was previously connected and tries to reconnect silently.
 */
export const checkWalletConnection = async () => {
    const wasConnected = localStorage.getItem('bioLinkerWalletConnected') === 'true';
    if (!wasConnected || !window.ethereum) return null;

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Get accounts without prompting popup
        const accounts = await provider.listAccounts(); 
        
        if (accounts.length > 0) {
            const signer = provider.getSigner();
            const address = accounts[0];
            return { provider, signer, address };
        }
    } catch (e) {
        console.warn("Silent connect failed", e);
    }
    return null;
};

export const getProfileHubContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  return new ethers.Contract(CONTRACTS.PROFILE_HUB.address, CONTRACTS.PROFILE_HUB.abi, signerOrProvider);
};

export const getProfileContract = (address: string, signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  return new ethers.Contract(address, ProfileContractABI, signerOrProvider);
};

export const fetchAllUsernames = async (): Promise<string[]> => {
    try {
        const hub = getProfileHubContract(readProvider);
        return await hub.getAllUsernames();
    } catch (e) {
        console.error("Error fetching usernames", e);
        return [];
    }
};

export const getProfileAddress = async (username: string): Promise<string | null> => {
    try {
        const hub = getProfileHubContract(readProvider);
        const address = await hub.getProfile(username);
        if (address === ethers.constants.AddressZero) return null;
        return address;
    } catch (e) {
        console.error("Error checking profile", e);
        return null;
    }
};

export const getUsernameByWallet = async (walletAddress: string): Promise<string | null> => {
    try {
        const hub = getProfileHubContract(readProvider);
        const username = await hub.getUserByWallet(walletAddress);
        return username || null;
    } catch (e) {
        console.error("Error checking wallet owner", e);
        return null;
    }
};

export const fetchProfileDataOnChain = async (username: string): Promise<UserProfile | null> => {
    try {
        const address = await getProfileAddress(username);
        if (!address) return null;

        const profileContract = getProfileContract(address, readProvider);
        const jsonString = await profileContract.getUserData();
        
        if (!jsonString) return null;
        
        const rawData = JSON.parse(jsonString);

        // Sanitize data to prevent crashes if on-chain data is old or malformed
        const safeData: UserProfile = {
            username: rawData.username || username,
            displayName: rawData.displayName || username,
            bio: rawData.bio || '',
            avatarUrl: rawData.avatarUrl || '',
            verified: !!rawData.verified,
            theme: rawData.theme || { type: ThemeType.ModernBlack },
            socials: Array.isArray(rawData.socials) ? rawData.socials : [],
            links: Array.isArray(rawData.links) ? rawData.links : [],
            projects: Array.isArray(rawData.projects) ? rawData.projects : [],
            projectCard: rawData.projectCard || { title: 'Featured Projects', description: 'See my work', icon: 'Layers' }
        };

        return safeData;
    } catch (e) {
        console.error(`Failed to fetch on-chain data for ${username}`, e);
        return null;
    }
};

export const publishProfile = async (
    username: string, 
    data: UserProfile, 
    signer: ethers.Signer,
    onStatus: (status: string) => void
) => {
    const hub = getProfileHubContract(signer);
    const existingAddress = await getProfileAddress(username);
    const jsonString = JSON.stringify(data);

    if (existingAddress) {
        // Update existing
        onStatus("Profile found. Updating data...");
        const profileContract = getProfileContract(existingAddress, signer);
        
        // Verify ownership
        const owner = await profileContract.wallet();
        const signerAddress = await signer.getAddress();
        if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
            throw new Error("You do not own this profile.");
        }

        const tx = await profileContract.updateData(jsonString);
        onStatus("Transaction sent. Waiting for confirmation...");
        await tx.wait();
        onStatus("Profile updated successfully!");
        return existingAddress;
    } else {
        // Create New
        onStatus("Creating new profile on-chain (Step 1/2)...");
        const createTx = await hub.createProfile(username);
        onStatus("Minting profile... please wait.");
        const receipt = await createTx.wait();
        
        // Find the ProfileCreated event to get the new contract address
        const event = receipt.events?.find((e: any) => e.event === 'ProfileCreated');
        const newProfileAddress = event?.args?.profileContract;

        if (!newProfileAddress) throw new Error("Could not retrieve new profile address");

        onStatus("Profile minted! Saving data (Step 2/2)...");
        const profileContract = getProfileContract(newProfileAddress, signer);
        const dataTx = await profileContract.addData(jsonString);
        
        onStatus("Saving data... please wait.");
        await dataTx.wait();
        onStatus("Profile created and data saved!");
        return newProfileAddress;
    }
};