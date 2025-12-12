import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ProfileView from './components/ProfileView';
import CreateProfilePage from './components/CreateProfilePage';
import { Footer } from './components/Footer';
import { searchProfiles } from './services/dataService';
import { connectWallet } from './services/blockchain';
import { Search, ArrowRight, Wallet } from 'lucide-react';

const Landing: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [walletAddr, setWalletAddr] = useState<string | null>(null);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 2) {
        searchProfiles(query).then(setSuggestions);
    } else {
        setSuggestions([]);
    }
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/${query.trim()}`);
    }
  };

  const handleConnect = async () => {
    try {
        const { address } = await connectWallet();
        setWalletAddr(address);
    } catch (e) {
        console.error(e);
        alert("Failed to connect wallet");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer" onClick={() => navigate('/')}>
          BioLinker <span className="text-xs text-gray-400 font-normal">OnChain</span>
        </div>
        <div>
            {walletAddr ? (
                <div className="px-4 py-2 bg-gray-100 rounded-full text-sm font-mono text-gray-700">
                    {walletAddr.slice(0,6)}...{walletAddr.slice(-4)}
                </div>
            ) : (
                <button 
                    onClick={handleConnect}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                    <Wallet className="w-4 h-4" /> Connect Wallet
                </button>
            )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pb-20 w-full">
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold tracking-wide uppercase">
          KiteAI Testnet Live
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8">
          Your identity,<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            immortalized on-chain.
          </span>
        </h1>

        {/* Search Section */}
        <div className="w-full max-w-md mx-auto relative mb-12" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative z-10">
            <input 
              type="text" 
              className="w-full px-6 py-4 pl-12 rounded-full border border-gray-200 shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Find an on-chain profile..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || query.length > 0) && (
            <div className="absolute top-10 left-0 right-0 pt-8 pb-2 bg-white rounded-b-2xl shadow-xl border-x border-b border-gray-100 overflow-hidden z-0 text-left animate-fade-in">
              {suggestions.length > 0 ? (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 mt-2">On-Chain Users</div>
                  {suggestions.map((s) => (
                    <Link 
                      key={s.username} 
                      to={`/${s.username}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                         <span className="text-indigo-600 font-bold text-xs">{s.username.substring(0,2).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 leading-tight">{s.username}</div>
                        <div className="text-xs text-gray-500">KiteAI Testnet</div>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                query.length > 1 && (
                  <div className="px-4 py-4 text-center text-gray-500 text-sm mt-2">
                    No users found starting with "{query}".
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
          The decentralized link-in-bio tool. 
          Mint your profile on KiteAI Testnet. Fully on-chain data. Censorship resistant.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
                to="/new"
                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all hover:border-gray-400 shadow-sm"
            >
                Mint Profile
            </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/new" element={<CreateProfilePage />} />
        <Route path="/:username" element={<ProfileView />} />
      </Routes>
    </HashRouter>
  );
};

export default App;