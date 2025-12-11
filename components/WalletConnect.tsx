import React, { useState, useRef, useEffect } from 'react';
import { useAppKit, useAppKitAccount, useDisconnect, useAppKitNetwork, useAppKitProvider } from "@reown/appkit/react";
import { ethers } from 'ethers';
import { CHAINS, BASE_MAINNET_ID, BASE_SEPOLIA_ID } from '../constants';

export const WalletConnect: React.FC = () => {
  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { chainId } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider('eip155');
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // State for multiple balances
  const [balances, setBalances] = useState<{ [key: string]: string }>({
    [BASE_MAINNET_ID]: '0.0000',
    [BASE_SEPOLIA_ID]: '0.0000'
  });
  
  // Default to Mainnet, but will update based on actual chainId
  const [activeTab, setActiveTab] = useState<string>(BASE_MAINNET_ID);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sync active tab with current chain
  useEffect(() => {
    if (chainId) {
        // Convert number to hex if needed to match constants
        const hexId = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
        if (hexId === BASE_MAINNET_ID || hexId === BASE_SEPOLIA_ID) {
            setActiveTab(hexId);
        }
    }
  }, [chainId]);

  // Fetch balances for display
  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout>;

    const fetchBalances = async () => {
        if (!isConnected || !address || !ethers.utils.isAddress(address)) return;

        // Helper to fetch balance for a specific chain
        const fetchForChain = async (targetChainId: string, rpcUrl: string) => {
            try {
                // Determine current connected chain ID in hex
                const currentChainIdHex = chainId 
                    ? (typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId)
                    : undefined;

                let bal: ethers.BigNumber;

                // Use Wallet Provider if we are connected to this specific chain (usually faster/more accurate)
                if (walletProvider && currentChainIdHex === targetChainId) {
                    const provider = new ethers.providers.Web3Provider(walletProvider as any);
                    bal = await provider.getBalance(address);
                } else {
                    // Otherwise use Public RPC
                    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
                    bal = await provider.getBalance(address);
                }
                
                // Format the raw balance string
                const etherString = ethers.utils.formatEther(bal);
                return parseFloat(etherString).toFixed(4);

            } catch (e) {
                console.warn(`Failed to fetch balance for ${targetChainId}`, e);
                return '0.0000';
            }
        };

        try {
            // Fetch both in parallel
            const [mainnetBal, sepoliaBal] = await Promise.all([
                fetchForChain(BASE_MAINNET_ID, CHAINS[BASE_MAINNET_ID].rpcUrls[0]),
                fetchForChain(BASE_SEPOLIA_ID, CHAINS[BASE_SEPOLIA_ID].rpcUrls[0])
            ]);

            if (isMounted) {
                setBalances({
                    [BASE_MAINNET_ID]: mainnetBal,
                    [BASE_SEPOLIA_ID]: sepoliaBal
                });
            }
        } catch (e: any) {
            if (isMounted) {
                const errorMessage = e instanceof Error ? e.message : JSON.stringify(e);
                console.error("Failed to fetch balances for UI:", errorMessage);
            }
        }
    };

    // Add a delay to allow provider stabilization
    timer = setTimeout(fetchBalances, 1000);

    return () => {
        isMounted = false;
        clearTimeout(timer);
    };
  }, [isConnected, address, chainId, walletProvider]);

  // Handle loading states (connecting or reconnecting)
  if (status === 'connecting' || status === 'reconnecting') {
     return (
        <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-gray-700 rounded-full cursor-wait opacity-80">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-400">Connecting...</span>
        </button>
     );
  }

  if (isConnected && address) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="group relative flex items-center gap-2 pr-4 pl-1 py-1 bg-[#111827] hover:bg-[#1f2937] border border-gray-700 rounded-full transition-all duration-200"
        >
          {/* Profile Icon / Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-[2px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
             <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center overflow-hidden">
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
             </div>
          </div>
          
          {/* Address truncate */}
          <span className="text-xs font-mono text-gray-300 group-hover:text-white transition-colors">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          
          {/* Status Dot */}
          <div className="absolute right-0 top-0 -mr-1 -mt-1 w-3 h-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-[#030712]"></span>
          </div>
        </button>

        {/* Custom Profile Dropdown */}
        {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-[#0b101b] border border-gray-700 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden transform transition-all">
                {/* Header */}
                <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Connected Account</p>
                    <div className="flex items-center justify-between">
                         <div className="text-white font-mono text-sm font-semibold truncate">
                             {address.slice(0, 10)}...{address.slice(-8)}
                         </div>
                         <button 
                           onClick={() => navigator.clipboard.writeText(address)}
                           className="text-gray-400 hover:text-white p-1 rounded"
                           title="Copy Address"
                         >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                         </button>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {/* Network Tabs */}
                    <div className="flex p-1 bg-[#111827] border border-gray-800 rounded-xl">
                        <button 
                            onClick={() => setActiveTab(BASE_MAINNET_ID)} 
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                                activeTab === BASE_MAINNET_ID 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                            }`}
                        >
                            Mainnet
                        </button>
                        <button 
                            onClick={() => setActiveTab(BASE_SEPOLIA_ID)} 
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                                activeTab === BASE_SEPOLIA_ID 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                            }`}
                        >
                            Sepolia
                        </button>
                    </div>

                    {/* Balance Display */}
                    <div className="bg-[#111827] rounded-xl p-4 border border-gray-800 text-center relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === BASE_MAINNET_ID ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">
                            {activeTab === BASE_MAINNET_ID ? 'Base Mainnet Balance' : 'Base Sepolia Balance'}
                        </p>
                        <div className="flex items-center justify-center gap-1.5">
                            <span className="text-3xl font-bold text-white tracking-tight">
                                {balances[activeTab]}
                            </span>
                            <span className={`text-sm font-bold ${activeTab === BASE_MAINNET_ID ? 'text-blue-400' : 'text-purple-400'}`}>ETH</span>
                        </div>
                    </div>

                    {/* Connection Status Indicator */}
                    <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-gray-500">Active Connection</span>
                        <div className="flex items-center gap-2">
                            {/* Check if currently connected chain matches the active tab */}
                            {(chainId && 
                              (typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId) === activeTab) ? (
                                <>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]"></div>
                                    <span className="text-green-400 font-medium">Connected</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                                    <span className="text-gray-500">Not Connected</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-2 border-t border-gray-800 bg-[#030712]/50">
                    <button 
                        onClick={() => disconnect()}
                        className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 py-3 rounded-xl transition-colors font-medium"
                    >
                        Disconnect Wallet
                    </button>
                </div>
            </div>
        )}
      </div>
    );
  }

  // Disconnected State
  return (
    <button 
      onClick={() => open()} 
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-full transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Connect Wallet
    </button>
  );
};
