
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { Wallet, ChevronDown, User } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const router = useRouter();
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const handleConnect = async () => {
    try {
      await open();
    } catch (e) {
      console.error("Connection Error:", e);
    }
  };

  return (
    <header className={`sticky top-0 z-[60] w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 transition-all ${className}`}>
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group select-none"
          onClick={() => router.push('/')}
        >
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            BioLinker <span className="text-xs text-gray-400 font-normal">OnChain</span>
          </div>
        </div>

        {/* Wallet Action */}
        <div>
          {isConnected && address ? (
            <button
              onClick={() => open()}
              className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md rounded-full transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Connected</span>
                <span className="text-sm font-bold text-gray-800 font-mono">
                  {address.slice(0, 4)}...{address.slice(-4)}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm font-bold"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
