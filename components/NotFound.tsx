
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import { Footer } from './Footer';
import { Header } from './Header';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>
        
        <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-indigo-100 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center relative shadow-lg border border-indigo-50 rotate-3 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
              <FileQuestion className="w-10 h-10 text-indigo-600" />
            </div>
        </div>
        
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 tracking-tighter drop-shadow-sm">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Page Not Found</h2>
        
        <p className="text-gray-500 max-w-md mb-10 leading-relaxed text-lg">
          The block you are looking for hasn't been minted yet, or you may have taken a wrong turn on the chain.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
        
        <div className="absolute bottom-8 text-gray-300 text-xs font-mono">
          ERROR_CODE: 0x404_NOT_FOUND
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
