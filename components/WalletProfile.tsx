'use client'

import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useState } from 'react'
import Link from 'next/link'

export default function WalletProfile() {
    const { open } = useAppKit()
    const { address, isConnected } = useAppKitAccount()
    const [isOpen, setIsOpen] = useState(false)

    // Format address (e.g., 0x1234...5678)
    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    if (!address || !isConnected) {
        return (
            <button
                onClick={() => open()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all text-sm backdrop-blur-md"
            >
                <i className="fas fa-wallet mr-2"></i>
                Connect Wallet
            </button>
        )
    }

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 pl-3 pr-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all group"
            >
                {/* Avatar Placeholder/Identicon */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                    {address?.slice(2, 4)}
                </div>

                <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-white group-hover:text-blue-200 transition-colors">
                        {formatAddress(address!)}
                    </span>
                </div>

                <i className={`fas fa-chevron-down text-xs text-gray-300 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Popup */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-72 bg-[#1a1b23]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in-down origin-top-right">
                        {/* Header */}
                        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                                {address?.slice(2, 4)}
                            </div>
                            <div>
                                <p className="text-white font-semibold">Connected</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <p className="text-xs text-green-400">KiteAI Testnet</p>
                                </div>
                            </div>
                        </div>

                        {/* Address Copy Box */}
                        <div className="mt-4 p-3 bg-black/20 rounded-xl border border-white/5 flex justify-between items-center group/copy hover:border-white/10 transition-colors">
                            <span className="text-gray-400 text-xs font-mono">{formatAddress(address!)}</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(address!)}
                                className="text-gray-500 hover:text-white transition-colors"
                                title="Copy Address"
                            >
                                <i className="far fa-copy"></i>
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="mt-2 space-y-1">
                            <Link href="/me" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                <i className="fas fa-user-edit w-5 text-center text-blue-400"></i>
                                <span className="text-sm font-medium">Edit Profile</span>
                            </Link>

                            <a href={`https://testnet.kitescan.ai/address/${address}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                <i className="fas fa-external-link-alt w-5 text-center text-purple-400"></i>
                                <span className="text-sm font-medium">View on Explorer</span>
                            </a>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 pt-3 border-t border-white/10">
                            <button
                                onClick={() => open()}
                                className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                Disconnect
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
