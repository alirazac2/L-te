
import React from 'react';
import { Github, Twitter, Linkedin, Home, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
    className?: string;
    hideNew?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ className = "", hideNew = false }) => {
  return (
    <footer className={`w-full bg-white/80 backdrop-blur-md border-t border-gray-100 py-6 px-6 mt-auto z-10 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-lg font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">BioLinker</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-bold tracking-wide border border-indigo-100">ONCHAIN</span>
          </Link>
          <div className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} All rights reserved.
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 bg-gray-50 p-1 rounded-full border border-gray-100">
            <Link to="/" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
            </Link>
            {!hideNew && (
                <Link to="/new" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>New</span>
                </Link>
            )}
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-2">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition-all">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
