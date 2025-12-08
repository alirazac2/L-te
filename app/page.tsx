'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { useTheme } from '@/components/ThemeProvider'
import WalletProfile from '@/components/WalletProfile'

export default function HomePage() {
  const { theme } = useTheme()

  useEffect(() => {
    // Load FontAwesome if not already loaded
    if (typeof document !== 'undefined' && !document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.0/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden animated-gradient ${theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 via-slate-800 to-purple-800'
        : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 via-pink-50 to-blue-100'
        }`}
    >
      {/* Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-link text-white text-xl"></i>
            </div>
            <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
              ZK3 Bio
            </span>
          </div>
          <div>
            <WalletProfile />
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center">
          <div className="container mx-auto px-4 py-20 text-center w-full">
            <div className="max-w-4xl mx-auto">
              <h1 className={`text-5xl lg:text-7xl font-bold mb-6 drop-shadow-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                Create Your Professional
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Link in Bio Page
                </span>
              </h1>
              <p className={`text-xl lg:text-2xl mb-12 max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Share all your important links in one place. Build your professional bio link page in minutes.
              </p>

              {/* Create Your Profile Button */}
              <Link
                href="/me"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg font-semibold shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
              >
                <i className="fas fa-plus text-xl" />
                Create Your Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}