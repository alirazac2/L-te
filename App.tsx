import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ProfileView from './components/ProfileView';
import CreateProfilePage from './components/CreateProfilePage';
import { Footer } from './components/Footer';
import { searchProfiles } from './services/dataService';
import { Search, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSuggestions(searchProfiles(query));
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          BioLinker
        </div>
        <div className="flex gap-4">
           {/* Navigation Items */}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pb-20 w-full">
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold tracking-wide uppercase">
          No Database. Pure Performance.
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8">
          One link to rule <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            them all.
          </span>
        </h1>

        {/* Search Section */}
        <div className="w-full max-w-md mx-auto relative mb-12" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative z-10">
            <input 
              type="text" 
              className="w-full px-6 py-4 pl-12 rounded-full border border-gray-200 shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Find a profile (e.g. demo, nature_lens)..."
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
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 mt-2">Suggestions</div>
                  {suggestions.map((s) => (
                    <Link 
                      key={s.username} 
                      to={`/${s.username}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <img src={s.avatarUrl} alt={s.username} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 leading-tight">{s.displayName}</div>
                        <div className="text-xs text-gray-500">@{s.username}</div>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                query.length > 1 && (
                  <div className="px-4 py-4 text-center text-gray-500 text-sm mt-2">
                    No demo profiles found for "{query}". <br/>
                    <span className="text-xs opacity-75">Try "demo", "tech", "yoga", "nature"</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
          The open-source, static-file based link-in-bio tool. 
          Host your own profile with a simple JSON file. No recurring fees, no data harvesting.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
                to="/new"
                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all hover:border-gray-400"
            >
                Create Your Own
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