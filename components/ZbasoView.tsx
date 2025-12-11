
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';
import { ChatMessage, Role } from '../types';

const SUGGESTIONS = [
    "Explain ERC-20 Standard",
    "How to mint tokens on Base?",
    "Token Vesting Contracts",
    "Liquidity Pool Setup",
    "OP Stack Architecture",
    "Bridging Assets Guide"
];

interface Props {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

export const ZbasoView: React.FC<Props> = ({ messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages, isLoading]);

    const handleSearch = (e?: React.FormEvent, term?: string) => {
        e?.preventDefault();
        const query = term || input;
        if (!query.trim() || isLoading) return;

        setInput('');
        onSendMessage(query);
    };

    const handleCopyText = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const renderContent = useCallback((content: string) => {
        const renderer = new marked.Renderer();
    
        renderer.code = (code, language) => {
            const validLang = language || 'DATA';
            return `
            <div class="code-block-wrapper relative my-4 border border-[#4ade80]/30 bg-[#050505]">
                <div class="flex items-center justify-between px-3 py-1 bg-[#4ade80]/10 border-b border-[#4ade80]/30">
                    <span class="text-[10px] text-[#4ade80] font-mono tracking-wider uppercase">${validLang}</span>
                    <button type="button" class="copy-code-btn flex items-center gap-1 text-[10px] text-[#4ade80] hover:text-white hover:bg-[#4ade80]/20 px-2 py-0.5 rounded transition-colors uppercase font-mono">
                        [COPY]
                    </button>
                </div>
                <div class="overflow-x-auto p-3">
                     <pre><code class="language-${validLang}">${code}</code></pre>
                </div>
            </div>`;
        };

        try {
            const html = marked.parse(content, { renderer, async: false }) as string;
            return { __html: html };
        } catch {
            return { __html: content };
        }
    }, []);

    const handleMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const copyBtn = target.closest('.copy-code-btn');
        
        if (copyBtn) {
            const wrapper = copyBtn.closest('.code-block-wrapper');
            const codeElement = wrapper?.querySelector('code');
            if (codeElement && codeElement.textContent) {
                navigator.clipboard.writeText(codeElement.textContent);
                
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = `[COPIED]`;
                setTimeout(() => {
                    if (copyBtn) copyBtn.innerHTML = originalText;
                }, 2000);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#050505] text-gray-200 font-sans selection:bg-[#4ade80] selection:text-black relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-5" 
                style={{ backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            
            {/* Header (HUD Style) */}
            <header className="px-4 py-3 border-b border-[#4ade80]/20 bg-[#0a0a0a]/95 backdrop-blur-xl sticky top-0 z-10 shadow-[0_4px_20px_rgba(74,222,128,0.05)]">
                <div className="flex items-center justify-between">
                    {/* Left Branding */}
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                             <div className="absolute -inset-1 bg-[#4ade80]/20 rounded blur-sm group-hover:bg-[#4ade80]/40 transition-all"></div>
                             <div className="relative h-8 w-8 bg-[#050505] border border-[#4ade80] flex items-center justify-center">
                                 <span className="font-mono font-bold text-[#4ade80] text-lg">Z</span>
                             </div>
                             {/* Decorative corner accent */}
                             <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#4ade80]"></div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-mono font-bold text-white tracking-[0.2em] leading-none">
                                ZBASO<span className="text-[#4ade80]">_KERNEL</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-mono text-[#4ade80]/60 uppercase tracking-widest">
                                    SYS.VER.2.4.0
                                </span>
                                <span className="w-1 h-1 bg-[#4ade80]/40 rounded-full"></span>
                                <span className="text-[9px] font-mono text-[#4ade80]/60 uppercase tracking-widest">
                                    BASE_MAINNET
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Status Indicators (Hidden on small mobile) */}
                    <div className="hidden sm:flex items-center gap-6 text-[10px] font-mono tracking-widest text-[#4ade80]/70">
                        <div className="flex flex-col items-end">
                            <span className="opacity-50">LATENCY</span>
                            <span className="text-[#4ade80] font-bold">12ms</span>
                        </div>
                        <div className="h-6 w-px bg-[#4ade80]/20"></div>
                        <div className="flex flex-col items-end">
                            <span className="opacity-50">MEM_POOL</span>
                            <span className="text-[#4ade80] font-bold">SYNCED</span>
                        </div>
                        <div className="h-6 w-px bg-[#4ade80]/20"></div>
                        <div className="flex items-center gap-2 border border-[#4ade80]/30 px-2 py-1 bg-[#4ade80]/5 rounded">
                             <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse shadow-[0_0_5px_#4ade80]"></span>
                             <span className="font-bold text-[#4ade80]">ONLINE</span>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#4ade80]/50 to-transparent"></div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-0 custom-scrollbar">
                
                {messages.length === 0 ? (
                    // Empty State
                    <div className="h-full flex flex-col items-center justify-center opacity-80">
                        <div className="w-24 h-24 mb-8 relative group">
                            {/* Rotating Rings */}
                            <div className="absolute inset-0 border border-[#4ade80]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-2 border border-[#4ade80]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-16 h-16 border-2 border-[#4ade80] bg-[#050505] flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-700">
                                     <div className="-rotate-45 group-hover:-rotate-90 transition-transform duration-700">
                                        <span className="font-mono text-3xl font-bold text-[#4ade80]">Z</span>
                                     </div>
                                 </div>
                            </div>
                        </div>
                        
                        <h2 className="text-xl font-bold text-white tracking-[0.3em] mb-2 font-mono">COMMAND READY</h2>
                        <p className="text-[#4ade80]/60 font-mono text-xs tracking-wider mb-8">AWAITING INPUT SEQUENCE...</p>
                        
                        <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-lg">
                            {SUGGESTIONS.map(s => (
                                <button 
                                    key={s}
                                    onClick={() => handleSearch(undefined, s)}
                                    className="relative px-3 py-2 border border-[#4ade80]/20 bg-[#4ade80]/5 text-[#4ade80] text-xs font-mono hover:bg-[#4ade80] hover:text-black transition-all group overflow-hidden"
                                >
                                    <span className="relative z-10 uppercase tracking-wider">{s}</span>
                                    {/* Hover Fill Effect */}
                                    <div className="absolute inset-0 bg-[#4ade80] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Chat Area
                    <div className="max-w-4xl mx-auto space-y-8">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] md:max-w-[85%] relative group min-w-0 flex flex-col`}>
                                    {/* Role Label */}
                                    <div className={`text-[9px] font-mono tracking-widest mb-1 opacity-70 flex items-center gap-2 ${msg.role === Role.USER ? 'justify-end text-blue-400' : 'justify-start text-[#4ade80]'}`}>
                                        {msg.role === Role.USER ? (
                                            <>
                                                <span>USR_ID_01</span>
                                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-1 h-1 bg-[#4ade80] rounded-full"></div>
                                                <span>KERNEL_RESPONSE</span>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className={`p-5 rounded-sm border backdrop-blur-sm overflow-hidden w-full relative ${
                                        msg.role === Role.USER
                                        ? 'border-blue-500/30 bg-blue-900/10 text-blue-100' 
                                        : 'border-[#4ade80]/30 bg-[#4ade80]/5 text-gray-200'
                                    }`}>
                                        {/* Corner Accents */}
                                        <div className={`absolute top-0 w-2 h-2 border-t border-l ${msg.role === Role.USER ? 'border-blue-500 right-0 border-r border-l-0' : 'border-[#4ade80] left-0'}`}></div>
                                        <div className={`absolute bottom-0 w-2 h-2 border-b border-r ${msg.role === Role.USER ? 'border-blue-500 left-0 border-l border-r-0' : 'border-[#4ade80] right-0'}`}></div>

                                        {/* Copy Message Button */}
                                        <button 
                                            onClick={() => handleCopyText(msg.content)}
                                            className={`absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity border ${
                                                msg.role === Role.USER 
                                                ? 'border-blue-500/50 text-blue-400 hover:bg-blue-900/50' 
                                                : 'border-[#4ade80]/50 text-[#4ade80] hover:bg-[#4ade80]/10'
                                            }`}
                                            title="Copy Data"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>

                                        <div className="w-full overflow-hidden" onClick={handleMessageClick}>
                                            <div 
                                                className="prose prose-invert prose-sm max-w-none w-full 
                                                break-words [word-break:break-word] [overflow-wrap:anywhere]
                                                
                                                prose-p:text-inherit prose-headings:font-mono prose-headings:text-white prose-headings:tracking-wider
                                                prose-a:text-[#4ade80] prose-a:underline hover:prose-a:text-white
                                                
                                                /* Inline Code */
                                                prose-code:font-mono prose-code:bg-black/50 prose-code:px-1 prose-code:py-0.5 
                                                prose-code:rounded prose-code:text-[#4ade80] 
                                                prose-code:break-all prose-code:whitespace-pre-wrap
                                                prose-code:before:content-[''] prose-code:after:content-['']
                                                
                                                /* Block Code (Custom Renderer handles container) */
                                                prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-none"
                                                dangerouslySetInnerHTML={renderContent(msg.content)} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-3 p-3 border border-[#4ade80]/20 bg-[#4ade80]/5 rounded-sm">
                                    <div className="flex space-x-1">
                                         <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-none animate-bounce delay-0"></div>
                                         <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-none animate-bounce delay-150"></div>
                                         <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-none animate-bounce delay-300"></div>
                                    </div>
                                    <span className="text-xs font-mono text-[#4ade80] tracking-wider animate-pulse">PROCESSING_DATA...</span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                )}
            </main>

            {/* Input Footer */}
            <div className="p-4 md:p-6 bg-gradient-to-t from-[#050505] to-transparent z-10">
                 <div className="max-w-4xl mx-auto">
                    <form onSubmit={(e) => handleSearch(e)} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4ade80]/20 to-blue-500/20 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative flex items-center bg-[#0a0a0a] border border-gray-800 rounded-lg overflow-hidden focus-within:border-[#4ade80]/50 transition-colors">
                            <div className="pl-4 pr-2 text-[#4ade80] font-mono select-none flex items-center gap-2">
                                <span className="text-[10px] text-gray-500">INPUT:</span>
                                <span>{'>'}</span>
                            </div>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-transparent border-none p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-0 font-mono text-sm"
                                placeholder="ENTER_COMMAND..."
                                autoFocus
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="px-6 py-4 text-[#4ade80] hover:bg-[#4ade80]/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-xs font-mono font-bold tracking-wider border-l border-gray-800"
                            >
                                EXECUTE
                            </button>
                        </div>
                    </form>
                 </div>
            </div>
        </div>
    );
};
