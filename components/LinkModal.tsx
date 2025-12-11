import React, { useState } from 'react';
import { X, ExternalLink, RefreshCw } from 'lucide-react';

interface LinkModalProps {
  url: string | null;
  onClose: () => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({ url, onClose }) => {
  const [loading, setLoading] = useState(true);

  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 overflow-hidden">
            <h3 className="font-semibold text-gray-800 truncate max-w-md" title={url}>
              {url}
            </h3>
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <ExternalLink size={18} />
              <span className="hidden sm:inline">Open in Browser</span>
            </a>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-gray-100">
           {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-10">
              <RefreshCw className="animate-spin mb-2" size={32} />
              <p>Loading preview...</p>
            </div>
          )}
          
          <iframe 
            src={url} 
            className="w-full h-full border-0 relative z-20"
            title="Link Preview"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
          
          {/* Fallback overlay if iframe is blocked (can't easily detect X-Frame-Options, but this is a UX hint) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-gray-200 px-4 py-2 rounded-full shadow-lg text-xs text-gray-500 z-30 pointer-events-none">
            If the site refuses to connect, use "Open in Browser"
          </div>
        </div>
      </div>
    </div>
  );
};