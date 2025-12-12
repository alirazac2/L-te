import React from 'react';
import { Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">BioLinker</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">v1.0</span>
        </div>

        <div className="text-sm text-gray-500 flex items-center gap-1.5">
          <span>&copy; {new Date().getFullYear()} BioLinker.</span>
          <span className="hidden sm:inline">Designed for Creators.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};