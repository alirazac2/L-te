'use client'

import IconComponent from './IconComponent'
import { useTheme } from './ThemeProvider'

interface FooterProps {
  className?: string
  hideThemeSwitcher?: boolean
}

export default function Footer({ className = "", hideThemeSwitcher = false }: FooterProps) {
  const { theme, toggleTheme } = useTheme()
  const socialLinks = [
    { name: 'github', url: 'https://github.com/zk3-bio/zk3-bio', icon: 'github' },
    { name: 'twitter', url: 'https://twitter.com/zk3bio', icon: 'twitter' },
    { name: 'linkedin', url: 'https://linkedin.com/company/zk3', icon: 'linkedin' },
    { name: 'instagram', url: 'https://instagram.com/zk3bio', icon: 'instagram' },
  ]
  
  // Determine text color - use className if provided, otherwise use theme
  const textColor = className.includes('text-gray') ? className : (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')
  
  return (
    <footer className={`w-full py-8 mt-12 border-t ${theme === 'dark' ? 'border-white/10 bg-black/10' : 'border-gray-300/20 bg-white/5'} backdrop-blur-sm ${textColor}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Brand */}
          <div className="text-center">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              ZK3 Bio
            </h3>
            <p className={`text-xs ${theme === 'dark' ? 'opacity-70' : 'opacity-60'}`}>
               zk3 bio
            </p>
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 flex items-center justify-center ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-gray-900/10 border-gray-900/20'} backdrop-blur-md rounded-full border hover:opacity-80 transition-all duration-300`}
                title={social.name.charAt(0).toUpperCase() + social.name.slice(1)}
              >
                <IconComponent name={social.icon as any} className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:scale-110 transition-transform`} />
              </a>
            ))}
          </div>
          
          {/* Links */}
          <div className={`flex items-center gap-6 text-sm flex-wrap justify-center`}>
            <a 
              href="https://github.com/zk3-bio/zk3-bio" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <IconComponent name="github" className="text-xs" />
              See GitHub
            </a>
            <span className="opacity-30">•</span>
            <a href="/service" className="hover:text-purple-400 transition-colors">
              Terms & Privacy
            </a>
            {!hideThemeSwitcher && (
              <>
                <span className="opacity-30">•</span>
                <button
                  onClick={toggleTheme}
                  className="hover:text-yellow-400 transition-colors flex items-center gap-1"
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? (
                    <>
                      <i className="fas fa-lightbulb text-sm" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-moon text-sm" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
          
          {/* Copyright */}
          <p className={`text-xs opacity-50 text-center`}>
            © 2024 ZK3 Bio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}