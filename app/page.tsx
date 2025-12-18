'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ProfileView from '../components/ProfileView';
import CreateProfilePage from '../components/CreateProfilePage';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { searchProfiles } from '../services/dataService';
import { Search, ArrowRight, Loader2, Zap, ChevronRight, UserPlus } from 'lucide-react';
import { Toast, ToastType } from '../components/Toast';

const Landing: React.FC = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const [toast, setToast] = useState<{ msg: string; type: ToastType; visible: boolean }>({
        msg: '', type: 'info', visible: false
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length > 0) {
                setIsSearching(true);
                searchProfiles(query)
                    .then((results) => {
                        setSuggestions(results);
                    })
                    .catch(err => console.error(err))
                    .finally(() => setIsSearching(false));
            } else {
                setSuggestions([]);
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setShowSuggestions(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1014] flex flex-col font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            <Toast message={toast.msg} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />

            <div className="relative z-20 bg-white w-full rounded-b-[3.5rem] md:rounded-b-[5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] pb-16 md:pb-24 transition-all duration-700">

                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-b-[4rem] md:rounded-b-[5rem]"></div>

                <Header />

                <main className="w-full relative">
                    <section className="pt-12 pb-12 md:pt-28 md:pb-20 px-6 flex flex-col items-center text-center">

                        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 shadow-sm animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">KiteAI Testnet Live</span>
                        </div>

                        <div className="relative mb-8 animate-slide-up inline-block">
                            <h1 className="text-6xl md:text-8xl font-black text-[#0f1014] tracking-tighter leading-none relative z-10 px-4">
                                Your Web3
                            </h1>
                            <div className="absolute bottom-1 left-0 right-0 h-10 md:h-16 bg-gradient-to-r from-indigo-300/60 to-purple-300/60 -z-0"></div>
                        </div>

                        <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed mb-12 font-medium tracking-tight px-4">
                            The decentralized registry for the new internet. Search profiles, verify ownership, and connect.
                        </p>

                        <div className="w-full max-w-xl relative group z-30 px-4" ref={searchRef}>
                            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full -z-10 group-hover:bg-indigo-500/15 transition-all duration-500 scale-90"></div>

                            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white rounded-3xl p-1.5 md:p-3 shadow-[0_20px_60px_-10px_rgba(79,70,229,0.15)] border border-gray-100 transition-all group-hover:scale-[1.01] group-hover:border-indigo-100 group-hover:shadow-[0_25px_70px_-10px_rgba(79,70,229,0.2)]">
                                <div className="pl-3 md:pl-4 text-gray-300 shrink-0">
                                    {isSearching ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-indigo-500" /> : <Search className="w-5 h-5 md:w-6 md:h-6" />}
                                </div>
                                <input
                                    type="text"
                                    className="flex-1 px-2 md:px-4 py-3 md:py-4 text-lg md:text-2xl font-black text-gray-900 placeholder:text-gray-200 bg-transparent outline-none tracking-tight min-w-0"
                                    placeholder="Find a profile..."
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                <button type="submit" className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#0f1014] text-white rounded-full hover:bg-indigo-600 transition-all shadow-xl hover:scale-105 active:scale-95 shrink-0 ml-1">
                                    <ArrowRight className="w-5 h-5 md:w-7 md:h-7" />
                                </button>
                            </form>

                            {showSuggestions && (query.length > 0 || isSearching) && (
                                <div className="absolute top-[calc(100%+16px)] left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in p-2">
                                    {isSearching ? (
                                        <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Scanning Network</span>
                                        </div>
                                    ) : suggestions.length > 0 ? (
                                        <>
                                            <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-50">Profiles Found</div>
                                            {suggestions.map((s) => (
                                                <Link
                                                    key={s.username}
                                                    href={`/${s.username}`}
                                                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group/item"
                                                    onClick={() => setShowSuggestions(false)}
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-black border border-indigo-100">
                                                        {s.username.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <div className="font-bold text-gray-900 text-lg leading-none group-hover/item:text-indigo-600 transition-colors">{s.username}</div>
                                                        <div className="text-xs text-gray-400 font-mono mt-1 opacity-60">kitenet://{s.username}</div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-gray-300" />
                                                </Link>
                                            ))}
                                        </>
                                    ) : (
                                        query.length > 1 && (
                                            <div className="p-8 text-center">
                                                <p className="text-gray-900 font-bold mb-1">No results for "{query}"</p>
                                                <p className="text-sm text-gray-400">Try searching for 'vitalik' or 'satoshi'</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-10 flex flex-wrap justify-center items-center gap-3">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mr-1">Trending:</span>
                            {['vitalik', 'satoshi', 'hayden', 'brian'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setQuery(tag)}
                                    className="px-5 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>

                    </section>

                    <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-bounce opacity-20">
                        <ChevronRight className="w-6 h-6 rotate-90 text-gray-400" />
                    </div>

                </main>
            </div>

            <div className="relative z-10 w-full pt-20 pb-20 md:pt-32 md:pb-32 px-6 bg-[#0f1014] text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span>Early Access Minting</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight drop-shadow-2xl">
                        Claim your spot <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">on the chain.</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-xl mx-auto mb-12 font-medium leading-relaxed opacity-70">
                        Don't let your username be taken. Mint your decentralized profile now on the KiteAI Testnet. Gas fees are sponsored.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/new"
                            className="group relative flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:scale-105 transition-transform duration-300 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)]"
                        >
                            <UserPlus className="w-6 h-6" />
                            <span>Mint Profile</span>
                        </Link>
                        <a
                            href="https://testnet.kitescan.ai"
                            target="_blank"
                            rel="noreferrer"
                            className="px-8 py-5 rounded-2xl font-bold text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition-all"
                        >
                            View Explorer
                        </a>
                    </div>
                </div>
            </div>

            <Footer className="border-t border-white/5 bg-[#0f1014] text-white/50" />
        </div>
    );
};

export default Landing;
