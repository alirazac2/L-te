
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Part, Content } from "@google/genai";
import { ethers } from 'ethers';
import { useAppKitAccount, useAppKitProvider, useAppKitNetwork } from "@reown/appkit/react";

import { DefaultChatView } from './components/DefaultChatView';
import { WalletConnect } from './components/WalletConnect';
import { ZbasoView } from './components/ZbasoView';
import { ChatMessage, Role, ChatSession, ContractMetadata } from './types';
import * as GeminiService from './services/geminiService';
import * as ZbasoService from './services/zbasoService';

const App: React.FC = () => {
  // AppKit Hooks
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');
  const { chainId } = useAppKitNetwork();

  // --- View State (Routing) ---
  const [currentView, setCurrentView] = useState<'chat' | 'zbaso'>('chat');

  // --- State Management ---
  
  // 1. Sessions: The master list of all chats
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      const savedSessions = localStorage.getItem('chat_sessions');
      if (savedSessions) {
        try {
          const parsed = JSON.parse(savedSessions);
          // CRITICAL FIX: Ensure parsed is an array AND has at least one item to prevent crashes
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error("Failed to parse chat sessions", e);
        }
      }
    }
    // Default: One empty session
    return [{
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now(),
      type: 'chat'
    }];
  });

  // 2. Active Session ID
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions.length > 0 ? sessions[0].id : ''; 
  });

  // Ensure active session ID is valid for the current view, otherwise switch
  useEffect(() => {
     // We only check this if sessions change significantly (length check to avoid deep loop) or view changes
     const activeSession = sessions.find(s => s.id === activeSessionId);
     const activeType = activeSession?.type || 'chat';
     
     if (activeType !== currentView) {
         // Find most recent session of correct type
         const correctSession = sessions.find(s => (s.type || 'chat') === currentView);
         if (correctSession) {
             setActiveSessionId(correctSession.id);
         } else {
             // Create new if none exists
             const newId = Date.now().toString();
             const newSession: ChatSession = {
                 id: newId,
                 title: 'New Chat',
                 messages: [], // Empty start for both views
                 updatedAt: Date.now(),
                 type: currentView
             };
             setSessions(prev => [newSession, ...prev]);
             setActiveSessionId(newId);
         }
     }
  }, [currentView, activeSessionId]); // Removed 'sessions' from dep array to prevent loop, logic handles internal consistency

  // 3. Messages: The UI state for the CURRENT view.
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const active = sessions.find(s => s.id === activeSessionId) || sessions[0];
    return active ? active.messages : [];
  });
  
  // Sync messages ONLY when active session changes (FIX for glitch loop)
  useEffect(() => {
      const active = sessions.find(s => s.id === activeSessionId);
      if (active) {
          setMessages(active.messages);
      }
  }, [activeSessionId]); 
  
  const [isThinking, setIsThinking] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>(''); // Dynamic status text
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Modals
  const [showDeployWarning, setShowDeployWarning] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showModelSelectModal, setShowModelSelectModal] = useState(false); // New Modal

  const [importAddress, setImportAddress] = useState('');
  const [importAbi, setImportAbi] = useState('');
  const [importError, setImportError] = useState('');

  // Ref to store source code temporarily between compile and deploy
  const lastCompiledCodeRef = useRef<string>('');

  // Setup Gemini
  const [chatSession, setChatSession] = useState<any>(null);

  // --- Effects ---

  // Handle URL Routing simulation
  useEffect(() => {
    const checkUrl = () => {
        const path = window.location.pathname;
        if (path.includes('/zbaseo')) {
            setCurrentView('zbaso');
        } else {
            setCurrentView('chat');
        }
    };
    
    checkUrl();
    window.addEventListener('popstate', checkUrl);
    return () => window.removeEventListener('popstate', checkUrl);
  }, []);

  // Initialize Gemini for the current session context (Only for 'chat' view)
  useEffect(() => {
    if (currentView !== 'chat') return;

    const ai = GeminiService.createGeminiClient();
    
    // Filter history for the model
    const history: Content[] = messages
      .filter(m => !m.content.startsWith('Error:') && !m.content.startsWith('System:') && !m.content.includes('⚠️'))
      .map(m => ({
        role: m.role === Role.USER ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

    // Inject Deployed Contract Context
    const activeSession = sessions.find(s => s.id === activeSessionId);
    let systemInstruction = GeminiService.getSystemInstruction();

    if (activeSession?.contractData) {
        const { address, abi, sourceCode } = activeSession.contractData;
        systemInstruction += `\n\n### 📦 ACTIVE SESSION CONTRACT
        A smart contract is active in this session (either deployed or imported).
        - **Address**: ${address}
        - **Source Code**: \n\`\`\`solidity\n${sourceCode.slice(0, 500)}...\n\`\`\`
        - **ABI**: Available in context.
        
        You can call functions on this contract using the 'call_contract_function' tool without asking for the address/ABI again.
        If the user asks to deploy *another* contract, advise them to start a "New Chat".`;
    }

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: systemInstruction,
        tools: GeminiService.getTools(),
      },
    });
    setChatSession(chat);
  }, [activeSessionId, sessions, currentView]); 

  // Sync Messages -> Active Session -> Local Storage
  useEffect(() => {
    setSessions(prevSessions => {
      const updatedSessions = prevSessions.map(session => {
        if (session.id === activeSessionId) {
          let newTitle = session.title;
          
          // Generate title only if it's "New Chat" and we have a user message
          if (session.title === 'New Chat' && messages.length > 0) {
             // For Zbaso, skip the first model greeting
             const firstUserMsg = messages.find(m => m.role === Role.USER);
             if (firstUserMsg) {
                 const rawText = firstUserMsg.content;
                 newTitle = rawText.slice(0, 30) + (rawText.length > 30 ? '...' : '');
             }
          }
          
          return {
            ...session,
            messages: messages,
            title: newTitle,
            updatedAt: Date.now()
          };
        }
        return session;
      });
      
      localStorage.setItem('chat_sessions', JSON.stringify(updatedSessions));
      return updatedSessions;
    });
  }, [messages, activeSessionId]);

  // --- Handlers ---

  const switchSession = (sessionId: string) => {
    const targetSession = sessions.find(s => s.id === sessionId);
    if (targetSession) {
      setMessages(targetSession.messages); // Immediate UI update
      setActiveSessionId(sessionId);
      setIsSidebarOpen(false);
      
      // Handle View Switch if needed (though list is filtered)
      const type = targetSession.type || 'chat';
      if (type !== currentView) {
          if (type === 'zbaso') {
              setCurrentView('zbaso');
              window.history.pushState({}, '', '/zbaseo');
          } else {
              setCurrentView('chat');
              window.history.pushState({}, '', '/');
          }
      }
    }
  };

  /**
   * Helper to strictly create a new session
   */
  const createNewSession = (type: 'chat' | 'zbaso') => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
        id: newId,
        title: 'New Chat',
        messages: [],
        updatedAt: Date.now(),
        type: type
    };

    // 1. Update View State
    if (type !== currentView) {
        setCurrentView(type);
        if (type === 'zbaso') window.history.pushState({}, '', '/zbaseo');
        else window.history.pushState({}, '', '/');
    }

    // 2. Update Sessions List
    setSessions(prev => [newSession, ...prev]);
    
    // 3. Set Active ID and Clear Messages immediately
    setActiveSessionId(newId);
    setMessages([]);
    setShowDeployWarning(false);
  };

  // Instant New Chat for CURRENT view
  const handleInstantNewChat = () => {
      createNewSession(currentView);
      setIsSidebarOpen(false);
  };

  // Switch Model/Agent via Modal
  const handleModelSelect = (mode: 'default' | 'zbaso') => {
      setShowModelSelectModal(false);
      const type = mode === 'default' ? 'chat' : 'zbaso';
      createNewSession(type);
  };

  const deleteChat = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    
    // 1. Calculate the new list excluding the deleted session
    const newSessions = sessions.filter(s => s.id !== sessionId);
    
    // 2. Check if we deleted the currently active session
    if (sessionId === activeSessionId) {
        // Try to find a fallback session of the SAME TYPE as the current view
        const fallback = newSessions.find(s => (s.type || 'chat') === currentView);
        
        if (fallback) {
            // Found a sibling, switch to it
            setActiveSessionId(fallback.id);
            setMessages(fallback.messages);
            setSessions(newSessions);
        } else {
            // No sessions left for this view. We must create a new empty one immediately.
            const newId = Date.now().toString();
            let newSession: ChatSession;

            if (currentView === 'zbaso') {
                 newSession = {
                    id: newId,
                    title: 'New Chat',
                    messages: [], // Start Empty
                    updatedAt: Date.now(),
                    type: 'zbaso'
                 };
            } else {
                 newSession = {
                    id: newId,
                    title: 'New Chat',
                    messages: [],
                    updatedAt: Date.now(),
                    type: 'chat'
                 };
            }
            
            // IMPORTANT: Prepend new session to the ALREADY filtered newSessions list
            setSessions([newSession, ...newSessions]);
            setActiveSessionId(newId);
            setMessages(newSession.messages);
        }
    } else {
        // We deleted an inactive session, safe to just update state
        setSessions(newSessions);
    }
    setOpenMenuId(null);
  };

  const handleImportContract = (e: React.FormEvent) => {
      e.preventDefault();
      setImportError('');
      
      try {
          if (!ethers.utils.isAddress(importAddress)) {
              throw new Error("Invalid Ethereum Address");
          }
          let parsedAbi;
          try {
              parsedAbi = JSON.parse(importAbi);
          } catch {
              throw new Error("Invalid JSON ABI");
          }

          if (!Array.isArray(parsedAbi)) {
              throw new Error("ABI must be an array");
          }

          const contractMetadata: ContractMetadata = {
              address: importAddress,
              abi: parsedAbi,
              sourceCode: '// Imported via UI',
              deployedAt: Date.now()
          };

          // Update Session
          setSessions(prev => prev.map(s => {
              if (s.id === activeSessionId) {
                  return { ...s, contractData: contractMetadata };
              }
              return s;
          }));

          // Add System Message
          setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: Role.SYSTEM,
              content: `**System**: Contract Imported! Address: \`${importAddress}\`. You can now ask the agent to read or write to this contract.`,
              timestamp: Date.now()
          }]);

          setShowImportModal(false);
          setImportAddress('');
          setImportAbi('');
          setIsSidebarOpen(false);
      } catch (err: any) {
          setImportError(err.message);
      }
  };

  const getEthersContext = useCallback(() => {
    if (!isConnected || !walletProvider) {
      return { provider: null, signer: null, userAddress: null };
    }
    const provider = new ethers.providers.Web3Provider(walletProvider as any);
    const signer = provider.getSigner();
    return { provider, signer, userAddress: address || null };
  }, [isConnected, walletProvider, address]);

  // --- STANDARD CHAT HANDLER ---
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !chatSession || isThinking) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      content: text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    
    setIsThinking(true);
    setLoadingStatus('Processing Request...'); 

    try {
      let response = await chatSession.sendMessage({ message: text });
      let currentResponse = response;
      let loopCount = 0;
      const MAX_LOOPS = 5;

      while (loopCount < MAX_LOOPS) {
        const candidates = currentResponse.candidates;
        const functionResponses: Part[] = [];
        const parts = candidates?.[0]?.content?.parts || [];
        let hasToolCalls = false;
        
        for (const part of parts) {
          if (part.functionCall) {
            hasToolCalls = true;
            const toolCall = part.functionCall;
            const context = getEthersContext();
            
            // --- Intercept Actions ---
            
            // 1. Capture Source Code on Compile
            if (toolCall.name === 'compile_contract') {
                if (toolCall.args.sourceCode) {
                    lastCompiledCodeRef.current = toolCall.args.sourceCode as string;
                }
                setLoadingStatus('Compiling Solidity Code...');
                await new Promise(resolve => setTimeout(resolve, 800));
            }
            // 1b. Capture Template Source if loaded
            if (toolCall.name === 'get_contract_template') {
                setLoadingStatus(`Loading Template: ${toolCall.args.templateName}...`);
            }

            // 2. CHECK: One Contract Per Session
            if (toolCall.name === 'deploy_contract') {
                const activeSession = sessions.find(s => s.id === activeSessionId);
                if (activeSession?.contractData) {
                    // STOP execution
                    setShowDeployWarning(true);
                    setIsThinking(false);
                    setLoadingStatus('');
                    
                    // Add a system message indicating blockage
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        role: Role.SYSTEM,
                        content: "**System Alert**: Deployment blocked. This chat session already has a deployed contract.",
                        timestamp: Date.now()
                    }]);
                    return; // Exit handleSendMessage entirely
                }
                setLoadingStatus('Requesting Wallet Signature for Deployment...');
                await new Promise(resolve => setTimeout(resolve, 800));
            }

            // --- Status Updates ---
            if (toolCall.name === 'request_transaction') setLoadingStatus('Drafting Transaction...');
            else if (toolCall.name === 'switch_network') setLoadingStatus('Switching Network...');
            else if (toolCall.name === 'call_contract_function') setLoadingStatus('Interacting with Smart Contract...');
            else if (toolCall.name === 'get_token_balances') setLoadingStatus('Scanning Blockchain for Assets...');
            
            // Execute Tool
            const functionResponse = await GeminiService.handleToolCall(toolCall, context);
            
            // --- Post-Execution Logic ---

            // 3. PERSIST: Save Deployed Contract Data
            if (toolCall.name === 'deploy_contract' && functionResponse.success) {
                const contractMetadata: ContractMetadata = {
                    address: functionResponse.contractAddress,
                    abi: (typeof toolCall.args.abi === 'string') ? JSON.parse(toolCall.args.abi) : toolCall.args.abi,
                    sourceCode: lastCompiledCodeRef.current || '// Source code unavailable',
                    deployedAt: Date.now()
                };

                // Update Session State immediately
                setSessions(prev => prev.map(s => {
                    if (s.id === activeSessionId) {
                        return { ...s, contractData: contractMetadata };
                    }
                    return s;
                }));
            }

            functionResponses.push({
              functionResponse: {
                name: toolCall.name,
                response: { result: functionResponse }
              }
            });
          }
        }

        if (hasToolCalls && functionResponses.length > 0) {
          setLoadingStatus('Verifying & Finalizing Response...');
          currentResponse = await chatSession.sendMessage({ message: functionResponses });
          loopCount++;
        } else {
          break;
        }
      }

      const modelText = currentResponse.text || '';
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: modelText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, modelMsg]);

    } catch (error: any) {
      console.error("Gemini Error", error);
      
      let customMessage = "Something went wrong. Please try again.";
      const errMsg = error.message?.toLowerCase() || '';

      if (errMsg.includes('429')) {
         customMessage = "⚠️ **API Limit Reached**\nYou are sending messages too quickly. Please wait a moment.";
      } else {
         customMessage = `**Error Encountered**\n${error.message || "An unknown error occurred."}`;
      }

      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: Role.MODEL,
        content: customMessage,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
      setLoadingStatus('');
    }
  };

  // --- ZBASO CHAT HANDLER ---
  const handleZbasoMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: Role.USER,
        content: text,
        timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
        const ai = ZbasoService.createClient();
        
        // Construct history for API (ignoring System/Error messages for safety)
        const apiHistory = messages
            .filter(m => m.role !== Role.SYSTEM)
            .map(m => ({
                role: m.role === Role.USER ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));
        
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: apiHistory,
            config: {
                systemInstruction: ZbasoService.getSystemInstruction(),
            }
        });

        const result = await chat.sendMessage({ message: text });
        
        const modelMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: Role.MODEL,
            content: result.text || "Accessing Base Knowledge Grid...",
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, modelMsg]);

    } catch (error: any) {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: Role.MODEL,
            content: "**Error:** Connection to Knowledge Grid interrupted.",
            timestamp: Date.now()
        }]);
    } finally {
        setIsThinking(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  // Filter sessions for Sidebar
  const sidebarSessions = sessions.filter(s => (s.type || 'chat') === currentView);

  return (
    <div className="flex h-screen bg-[#030712] text-gray-100 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* --- Sidebar --- */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#111827] border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              {currentView === 'zbaso' ? 'ZBASO' : 'ZK3 BASED'}
            </h1>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-2">
            <button
              onClick={handleInstantNewChat}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
            
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => { setShowModelSelectModal(true); setIsSidebarOpen(false); }}
                    className="flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-xl transition-all text-xs border border-gray-700 hover:border-gray-600"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Switch Agent
                </button>
                
                {currentView === 'chat' ? (
                    <button
                    onClick={() => setShowImportModal(true)}
                    className="flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-xl transition-all text-xs border border-gray-700 hover:border-gray-600"
                    >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Import
                    </button>
                ) : (
                    <div className="bg-transparent"></div> // Spacer for Zbaso
                )}
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2">
              Recent Chats
            </div>
            {sidebarSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => switchSession(session.id)}
                className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  activeSessionId === session.id
                    ? currentView === 'zbaso' ? 'bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80]' : 'bg-gray-800 border border-gray-700 text-white'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="truncate text-sm font-medium">{session.title}</span>

                {/* Contract Indicator */}
                {session.contractData && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 absolute right-8 top-1/2 -translate-y-1/2" title="Contract Active"></span>
                )}
                
                {/* Context Menu Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === session.id ? null : session.id);
                  }}
                  className="absolute right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-700 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openMenuId === session.id && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-[#1f2937] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <button
                      onClick={(e) => deleteChat(e, session.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Navigation */}
          <div className="p-4 border-t border-gray-800 bg-[#0b101b]">
              <div className="flex flex-col gap-2">
                  <button 
                      onClick={() => setShowDocsModal(true)}
                      className="text-left text-xs font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Documentation & Guide
                  </button>
                  <a 
                      href="#" 
                      className="text-left text-xs font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About ZK3 Based
                  </a>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                  <a href="#" className="text-gray-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
              </div>
          </div>
        </div>
      </div>

      {/* --- Main Chat Area --- */}
      <div className="flex-1 flex flex-col relative h-full">
        
        {/* Header - Visible on both Mobile and Desktop for Chat View */}
        {currentView === 'chat' && (
            <div className="flex items-center justify-between p-4 bg-[#111827]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-20">
                <div className="flex items-center gap-3">
                     <button 
                        onClick={() => setIsSidebarOpen(true)} 
                        className="md:hidden text-gray-300 hover:text-white"
                     >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                     </button>
                     <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        ZK3 BASED
                     </h1>
                </div>
                
                <div className="flex items-center gap-2">
                     <WalletConnect /> 
                </div>
            </div>
        )}

        {currentView === 'zbaso' ? (
            // --- Zbaso View ---
            <div className="flex-1 flex flex-col h-full relative">
                 <div className="md:hidden absolute top-3.5 right-4 z-20">
                    <button 
                        onClick={() => setIsSidebarOpen(true)} 
                        className="text-[#4ade80] bg-[#0a0a0a]/80 border border-[#4ade80]/30 p-2 rounded backdrop-blur-md hover:bg-[#4ade80]/10 transition-colors"
                    >
                        {/* Data Grid Icon */}
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                 </div>
                <ZbasoView 
                    messages={messages} 
                    onSendMessage={handleZbasoMessage}
                    isLoading={isThinking}
                />
            </div>
        ) : (
            // --- Standard Chat View ---
            <DefaultChatView 
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isThinking}
                loadingStatus={loadingStatus}
            />
        )}
      </div>

      {/* --- Model Selection Modal (Minimal) --- */}
      {showModelSelectModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="bg-[#111827] border border-gray-800 rounded-2xl max-w-sm w-full shadow-2xl p-6 relative">
                <button 
                    onClick={() => setShowModelSelectModal(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-white"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h2 className="text-center text-lg font-bold text-white mb-6">Select Agent</h2>

                <div className="space-y-3">
                    {/* ZK3 Based Option */}
                    <button 
                        onClick={() => handleModelSelect('default')}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-blue-900/10 border border-blue-500/30 hover:border-blue-500 hover:from-blue-900/40 transition-all group text-left"
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                             <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">ZK3 Agent</h3>
                            <p className="text-blue-200/60 text-xs">On-Chain Actions & Deploys</p>
                        </div>
                    </button>

                    {/* Zbaso Option */}
                    <button 
                        onClick={() => handleModelSelect('zbaso')}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-900/20 to-green-900/10 border border-green-500/30 hover:border-green-500 hover:from-green-900/40 transition-all group text-left"
                    >
                        <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform">
                             <span className="font-mono font-bold text-white text-lg">Z</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm font-mono">ZBASO</h3>
                            <p className="text-green-200/60 text-xs">Off-Chain Knowledge Base</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- Warning Modal --- */}
      {showDeployWarning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111827] border border-red-900/50 rounded-2xl max-w-md w-full shadow-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    One Contract Per Chat
                </h3>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    This chat session already has a deployed smart contract. To keep the context clean and avoid conflicts, please start a <b>New Chat</b> to deploy a different contract.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowDeployWarning(false)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            setShowDeployWarning(false);
                            handleInstantNewChat();
                        }}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-900/20 transition-all"
                    >
                        Start New Chat
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- Import Contract Modal --- */}
      {showImportModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#111827] border border-gray-700 rounded-2xl max-w-lg w-full shadow-2xl p-6 relative">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Import Existing Contract
                  </h3>
                  <form onSubmit={handleImportContract} className="space-y-4">
                      <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Contract Address</label>
                          <input 
                              type="text" 
                              value={importAddress}
                              onChange={(e) => setImportAddress(e.target.value)}
                              placeholder="0x..."
                              className="w-full bg-[#0b101b] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Contract ABI (JSON)</label>
                          <textarea 
                              value={importAbi}
                              onChange={(e) => setImportAbi(e.target.value)}
                              placeholder='[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]'
                              className="w-full bg-[#0b101b] border border-gray-700 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 focus:border-purple-500 focus:outline-none h-32 resize-none custom-scrollbar"
                              required
                          />
                      </div>
                      
                      {importError && (
                          <div className="p-2 bg-red-900/20 border border-red-900/50 rounded-lg text-xs text-red-400">
                              {importError}
                          </div>
                      )}

                      <div className="flex gap-3 pt-2">
                          <button 
                              type="button"
                              onClick={() => { setShowImportModal(false); setImportError(''); }}
                              className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit"
                              className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium shadow-lg shadow-purple-900/20 transition-all"
                          >
                              Import Contract
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* --- Documentation Modal --- */}
      {showDocsModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#111827] border border-gray-700 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]">
                  {/* Modal Header */}
                  <div className="p-5 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#111827] rounded-t-2xl z-10">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                         </div>
                         <h3 className="text-xl font-bold text-white">Documentation & Guide</h3>
                      </div>
                      <button 
                          onClick={() => setShowDocsModal(false)}
                          className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>

                  {/* Modal Content - Scrollable */}
                  <div className="p-6 overflow-y-auto custom-scrollbar">
                      <div className="prose prose-invert prose-sm max-w-none">
                          <div className="bg-blue-900/20 border border-blue-900/50 rounded-xl p-4 mb-6">
                              <p className="text-blue-200 m-0 font-medium">
                                  <strong>ZK3 Based</strong> is an AI-powered blockchain assistant designed for the Base ecosystem. 
                                  It bridges the gap between natural language and on-chain interactions.
                              </p>
                          </div>

                          <h4 className="text-white flex items-center gap-2">
                              <span className="text-blue-500">⚡</span> Key Features
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
                              <li>• <strong>Wallet Analysis</strong>: Check balances & stats.</li>
                              <li>• <strong>Smart Contracts</strong>: Write, compile & deploy.</li>
                              <li>• <strong>Interaction</strong>: Read/Write to any contract.</li>
                              <li>• <strong>Transactions</strong>: Send ETH & Tokens safely.</li>
                          </ul>

                          <hr className="border-gray-800 my-6" />

                          <h4 className="text-white flex items-center gap-2">
                              <span className="text-purple-500">🚀</span> How to Deploy Contracts
                          </h4>
                          <ol className="text-gray-300 space-y-2">
                              <li>
                                  <strong className="text-white">1. Describe it:</strong> "Create an ERC20 token named 'BaseCat' with 1M supply."
                              </li>
                              <li>
                                  <strong className="text-white">2. Compile:</strong> The AI will write and compile the Solidity code in your browser.
                              </li>
                              <li>
                                  <strong className="text-white">3. Deploy:</strong> Confirm the transaction in your connected wallet.
                              </li>
                              <li>
                                  <strong className="text-white">4. Interact:</strong> Ask the AI to "Mint tokens" or "Check balance" on your new contract.
                              </li>
                          </ol>
                          
                          <hr className="border-gray-800 my-6" />

                          <h4 className="text-white flex items-center gap-2">
                              <span className="text-green-500">🔥</span> Hardcore Capabilities
                          </h4>
                          <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                              <div>
                                  <strong className="text-white block mb-1">Batch Transactions (MultiSender)</strong>
                                  <p className="text-gray-400 text-xs">
                                      Send ETH or Tokens to multiple recipients in a single transaction. 
                                      Just ask: <em>"Send 0.1 ETH to Alice, Bob, and Charlie."</em>
                                  </p>
                              </div>
                              <div>
                                  <strong className="text-white block mb-1">Burn Tokens</strong>
                                  <p className="text-gray-400 text-xs">
                                      Permanently destroy tokens. 
                                      Ask: <em>"Burn 1000 of my BaseCat tokens."</em>
                                  </p>
                              </div>
                          </div>

                          <div className="bg-gray-800/50 rounded-lg p-3 mt-4 text-xs text-gray-400">
                              Tip: Use the <strong>"Import Contract"</strong> feature in the sidebar to interact with existing contracts by pasting their Address and ABI.
                          </div>

                          <hr className="border-gray-800 my-6" />

                          <h4 className="text-red-400 flex items-center gap-2 uppercase tracking-wide text-xs font-bold">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Disclaimer & Safety
                          </h4>
                          
                          <div className="space-y-3 text-gray-400 text-xs leading-relaxed">
                              <p>
                                  <strong className="text-gray-200">1. Educational Purpose Only:</strong> This tool is for educational and experimental use.
                              </p>
                              <p>
                                  <strong className="text-gray-200">2. No Financial Advice:</strong> Interactions are not financial advice.
                              </p>
                              <p>
                                  <strong className="text-gray-200">3. Use at Your Own Risk:</strong> Smart contracts deployed by AI may have vulnerabilities. Always audit code before using real funds.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;
