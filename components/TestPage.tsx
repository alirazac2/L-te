import React, { useState } from 'react';

export const TestPage: React.FC = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-lg w-full bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
        
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h1 className="text-2xl font-bold text-white">Test Page</h1>
                <p className="text-gray-400 text-sm font-mono">/test • Isolated Environment</p>
            </div>
        </div>

        <p className="text-gray-300 mb-8 leading-relaxed text-sm">
            This page is completely standalone. It does not connect to Gemini, Reown, Ethers, or any environment variables. It verifies that the React rendering engine is healthy.
        </p>

        <div className="bg-[#0b101b] rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">State Check</label>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-green-500 font-medium">System Active</span>
                </div>
            </div>
            
            <div className="flex items-center justify-between bg-[#111827] p-2 rounded-lg border border-gray-700/50">
                <button 
                    onClick={() => setCounter(c => c - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors border border-gray-700"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </button>
                <span className="text-3xl font-mono font-bold text-white tabular-nums">{counter}</span>
                <button 
                    onClick={() => setCounter(c => c + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-900/20"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>
        </div>

        <a
            href="/"
            className="block w-full text-center py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors border border-gray-700 hover:border-gray-600 text-sm"
        >
            Return to Main App
        </a>
      </div>
    </div>
  );
};
