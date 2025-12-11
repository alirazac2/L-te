
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, Role } from '../types';
import { marked } from 'marked';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  loadingStatus: string;
}

export const DefaultChatView: React.FC<Props> = ({ messages, onSendMessage, isLoading, loadingStatus }) => {
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading, loadingStatus]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim() || isLoading) return;
      onSendMessage(inputValue);
      setInputValue('');
  };

  const handleCopyText = (text: string) => {
      navigator.clipboard.writeText(text);
      // Optional: Could add a toast notification here
  };

  // Custom Renderer for Code Blocks to add Copy Button
  const renderContent = useCallback((content: string) => {
    const renderer = new marked.Renderer();
    
    renderer.code = (code, language) => {
        const validLang = language || 'plaintext';
        // We encode the code to ensure it doesn't break the HTML attribute, 
        // but for the click handler we'll grab the text content of the code block to be safe.
        return `
        <div class="code-block-wrapper relative my-4 rounded-lg overflow-hidden border border-gray-700 bg-[#0d1117]">
            <div class="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-gray-700">
                <span class="text-xs text-gray-400 font-mono">${validLang}</span>
                <button type="button" class="copy-code-btn flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
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
    } catch (e) {
        return { __html: content };
    }
  }, []);

  // Event Delegation for clicking "Copy" inside the DangerouslySetHTML
  const handleMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const copyBtn = target.closest('.copy-code-btn');
      
      if (copyBtn) {
          const wrapper = copyBtn.closest('.code-block-wrapper');
          const codeElement = wrapper?.querySelector('code');
          if (codeElement && codeElement.textContent) {
              navigator.clipboard.writeText(codeElement.textContent);
              
              // Visual feedback hack
              const originalText = copyBtn.innerHTML;
              copyBtn.innerHTML = `<span class="text-green-400 text-xs font-bold">Copied!</span>`;
              setTimeout(() => {
                  if (copyBtn) copyBtn.innerHTML = originalText;
              }, 2000);
          }
      }
  };

  return (
    <div className="flex flex-col h-full bg-[#030712] relative">
      
      {/* Messages Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 opacity-50 min-h-[50vh]">
            <svg className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p className="text-sm font-mono text-center">
              ZK3 BASED INITIALIZED<br />
              Ready for on-chain interaction
            </p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative group max-w-[90%] sm:max-w-[85%] min-w-0 rounded-2xl px-5 py-3 shadow-sm flex flex-col ${
                msg.role === Role.USER
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-none'
              }`}
            >
              {/* Copy Message Button (Visible on Hover) */}
              <button 
                  onClick={() => handleCopyText(msg.content)}
                  className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                      msg.role === Role.USER 
                      ? 'bg-blue-700 hover:bg-blue-800 text-blue-100' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                  title="Copy message"
              >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
              </button>

              {msg.role === Role.MODEL && (
                <div className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-2 shrink-0">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  ZK3 Based
                </div>
              )}
              
              <div 
                className="w-full overflow-hidden" 
                onClick={handleMessageClick} // Attach delegator here
              >
                  <div 
                      className={`prose prose-sm prose-invert max-w-none w-full
                          break-words [word-break:break-word] [overflow-wrap:anywhere]
                          [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                          
                          /* Code Block Styling (Handled by custom renderer + overflow fix) */
                          prose-pre:bg-transparent 
                          prose-pre:border-none 
                          prose-pre:p-0 
                          prose-pre:m-0
                          
                          /* Inline Code Styling */
                          prose-code:break-all prose-code:whitespace-pre-wrap
                          prose-code:bg-black/20 prose-code:rounded prose-code:px-1
                          prose-code:text-xs md:prose-code:text-sm
                          prose-code:before:content-[''] prose-code:after:content-['']

                          prose-a:break-all
                          ${msg.role === Role.USER 
                              ? 'text-white prose-p:text-white prose-headings:text-white prose-strong:text-white prose-a:text-white prose-code:text-white' 
                              : 'prose-a:text-blue-400 hover:prose-a:text-blue-300'
                          }
                      `}
                      dangerouslySetInnerHTML={renderContent(msg.content)}
                  />
              </div>

              {/* Timestamp */}
              <div className="mt-2 text-[10px] opacity-50 flex items-center justify-end gap-1 shrink-0 select-none">
                {msg.isLoading ? (
                   <span className="flex space-x-1">
                      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                   </span>
                ) : (
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800 bg-[#030712] z-10">
          <div className="max-w-4xl mx-auto relative">
              {loadingStatus && (
                  <div className="absolute -top-14 left-0 right-0 flex justify-center z-10 pointer-events-none">
                      <div className="bg-[#111827]/90 backdrop-blur-md border border-blue-500/30 text-blue-100 text-xs px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center gap-3 transition-all animate-in slide-in-from-bottom-2 duration-300">
                          <div className="relative w-3 h-3 flex items-center justify-center shrink-0">
                               <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"></div>
                          </div>
                          <span className="font-medium tracking-wide truncate max-w-[200px] sm:max-w-none">{loadingStatus}</span>
                      </div>
                  </div>
              )}

              <form onSubmit={handleSubmit} className="relative">
                  <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask ZK3 Based to check balances, deploy contracts, or send ETH..."
                      className="w-full bg-[#111827] border border-gray-700 text-gray-100 rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-lg text-sm sm:text-base"
                      disabled={isLoading}
                  />
                  <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
                  >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                  </button>
              </form>
              <div className="text-center mt-2 text-[10px] sm:text-xs text-gray-500 select-none">
                  ZK3 Based can make mistakes. Always verify transactions on Basescan.
              </div>
          </div>
      </div>
    </div>
  );
};
