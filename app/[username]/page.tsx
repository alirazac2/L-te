'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import IconComponent from '@/components/IconComponent'
import ProjectsModal from '@/components/ProjectsModal'
import Footer from '@/components/Footer'
import { useTheme } from '@/components/ThemeProvider'
import WalletProfile from '@/components/WalletProfile'


// FontAwesome CDN
if (typeof window !== 'undefined') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.0/css/all.min.css';
  document.head.appendChild(link);
}

interface ProfileData {
  username: string
  name: string
  bio: string
  avatar: string
  theme: {
    background: string
    cardBg: string
    textPrimary: string
    textSecondary: string
    accent: string
  }
  socialLinks: Array<{
    platform: string
    url: string
    icon: string
  }>
  links: Array<{
    title: string
    url: string
    icon: string
    description: string
  }>
  projects: Array<{
    title: string
    description: string
    tech: string[]
    url: string
    image: string
  }>
}

// Helper function to get platform-specific gradient colors
const getSocialPlatformGradient = (platform: string): string => {
  const platformLower = platform.toLowerCase()
  if (platformLower.includes('github')) {
    return 'from-gray-700/30 to-gray-900/30 hover:from-gray-600/40 hover:to-gray-800/40 border-gray-600/40 hover:border-gray-500/60'
  }
  if (platformLower.includes('twitter') || platformLower.includes('x-twitter')) {
    return 'from-blue-400/30 to-blue-600/30 hover:from-blue-400/40 hover:to-blue-600/40 border-blue-500/40 hover:border-blue-400/60'
  }
  if (platformLower.includes('linkedin')) {
    return 'from-blue-600/30 to-blue-800/30 hover:from-blue-600/40 hover:to-blue-800/40 border-blue-600/40 hover:border-blue-500/60'
  }
  if (platformLower.includes('instagram')) {
    return 'from-pink-500/30 via-purple-500/30 to-yellow-500/30 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-yellow-500/40 border-pink-500/40 hover:border-pink-400/60'
  }
  if (platformLower.includes('youtube')) {
    return 'from-red-500/30 to-red-700/30 hover:from-red-500/40 hover:to-red-700/40 border-red-500/40 hover:border-red-400/60'
  }
  if (platformLower.includes('facebook')) {
    return 'from-blue-600/30 to-blue-800/30 hover:from-blue-600/40 hover:to-blue-800/40 border-blue-600/40 hover:border-blue-500/60'
  }
  if (platformLower.includes('telegram')) {
    return 'from-blue-400/30 to-blue-500/30 hover:from-blue-400/40 hover:to-blue-500/40 border-blue-400/40 hover:border-blue-300/60'
  }
  if (platformLower.includes('whatsapp')) {
    return 'from-green-500/30 to-green-600/30 hover:from-green-500/40 hover:to-green-600/40 border-green-500/40 hover:border-green-400/60'
  }
  return 'from-blue-500/30 to-purple-600/30 hover:from-blue-500/40 hover:to-purple-600/40 border-blue-500/40 hover:border-blue-400/60'
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mobileBackground, setMobileBackground] = useState<string | null>(null)
  const [desktopBackground, setDesktopBackground] = useState<string | null>(null)
  const [fallbackBackground, setFallbackBackground] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showCopiedToast, setShowCopiedToast] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    // Check if Web Share API is available (works on mobile devices)
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const hasShareAPI = 'share' in navigator && typeof navigator.share === 'function'
      setCanShare(hasShareAPI)
    }
  }, [])

  useEffect(() => {
    // Handle ESC key to close modals
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showShareModal) {
          setShowShareModal(false)
        }
        if (isProjectsModalOpen) {
          setIsProjectsModalOpen(false)
        }
      }
    }

    if (showShareModal || isProjectsModalOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [showShareModal, isProjectsModalOpen])

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Load from local only
        const response = await fetch(`/${params.username}/db.json`)
        if (!response.ok) {
          throw new Error('Profile not found')
        }
        const data = await response.json()
        setProfileData(data)

        // Check for background images with priority rules - using global images from /public
        const checkImage = async (url: string) => {
          try {
            const img = new Image()
            img.src = url
            await new Promise((resolve, reject) => {
              img.onload = resolve
              img.onerror = reject
            })
            return url
          } catch {
            return null
          }
        }

        // Use global background images from /public folder (same for all profiles)
        // Check for mobile backgrounds (PNG priority over JPG)
        const mobilePng = await checkImage('/mob-bg.png')
        const mobileJpg = await checkImage('/mob-bg.jpg')
        const mobileImg = mobilePng || mobileJpg

        // Check for desktop backgrounds (PNG priority over JPG)
        const desktopPng = await checkImage('/desktop-bg.png')
        const desktopJpg = await checkImage('/desktop-bg.jpg')
        const desktopImg = desktopPng || desktopJpg

        // Check for fallback background (PNG priority over JPG)
        const fallbackPng = await checkImage('/bg.png')
        const fallbackJpg = await checkImage('/bg.jpg')
        const fallbackImg = fallbackPng || fallbackJpg

        // Apply priority rules
        if (mobileImg && desktopImg) {
          // Both available - use device-specific, skip fallback
          setMobileBackground(mobileImg)
          setDesktopBackground(desktopImg)
        } else if (mobileImg || desktopImg) {
          // Only one available
          if (fallbackImg) {
            // Use available one for its device, fallback for other
            setMobileBackground(mobileImg || fallbackImg)
            setDesktopBackground(desktopImg || fallbackImg)
          } else {
            // Use available one for all devices
            const availableImg = mobileImg || desktopImg
            setMobileBackground(availableImg)
            setDesktopBackground(availableImg)
          }
        } else if (fallbackImg) {
          // Only fallback available
          setFallbackBackground(fallbackImg)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        notFound()
      } finally {
        setLoading(false)
        // Trigger page fade-in after a short delay
        setTimeout(() => setPageLoaded(true), 100)
      }
    }

    loadProfile()
  }, [params.username])

  const handleLinkClick = (url: string, title: string) => {
    if (title.toLowerCase().includes('project')) {
      setIsProjectsModalOpen(true)
      return
    }

    if (url.startsWith('/')) {
      window.location.href = url
    } else if (url.startsWith('mailto:')) {
      window.location.href = url
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="relative z-10">
          {/* Mobile Skeleton */}
          <div className="block lg:hidden">
            <div className="container mx-auto px-4 py-8 max-w-md">
              {/* Avatar Skeleton */}
              <div className="text-center mb-10 animate-fade-in">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 skeleton-pulse border border-white/10 shadow-lg"></div>
                <div className="h-8 rounded-lg mb-3 mx-auto w-48 skeleton-pulse"></div>
                <div className="h-4 rounded-lg w-4/5 mx-auto skeleton-pulse"></div>
                <div className="h-4 rounded-lg w-3/5 mx-auto mt-2 skeleton-pulse"></div>
              </div>

              {/* Social Links Skeleton */}
              <div className="flex justify-center gap-3 mb-10 flex-wrap">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-xl skeleton-pulse border border-white/10"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>

              {/* Links Skeleton */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="h-20 rounded-xl skeleton-pulse backdrop-blur-md border border-white/20 shadow-lg p-4 flex items-center gap-4"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl skeleton-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="h-4 rounded w-3/4 skeleton-pulse"></div>
                      <div className="h-3 rounded w-1/2 skeleton-pulse"></div>
                    </div>
                    <div className="w-5 h-5 rounded skeleton-pulse flex-shrink-0"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Skeleton - Vertical like mobile */}
          <div className="hidden lg:flex min-h-screen items-center justify-center">
            <div className="container mx-auto px-4 py-8 max-w-md">
              {/* Avatar Skeleton */}
              <div className="text-center mb-10 animate-fade-in">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 skeleton-pulse border border-white/10 shadow-lg"></div>
                <div className="h-8 rounded-lg mb-3 mx-auto w-48 skeleton-pulse"></div>
                <div className="h-4 rounded-lg w-4/5 mx-auto skeleton-pulse"></div>
                <div className="h-4 rounded-lg w-3/5 mx-auto mt-2 skeleton-pulse"></div>
              </div>

              {/* Social Links Skeleton */}
              <div className="flex justify-center gap-3 mb-10 flex-wrap">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-xl skeleton-pulse border border-white/10"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>

              {/* Links Skeleton */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="h-20 rounded-xl skeleton-pulse backdrop-blur-md border border-white/20 shadow-lg p-4 flex items-center gap-4"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl skeleton-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="h-4 rounded w-3/4 skeleton-pulse"></div>
                      <div className="h-3 rounded w-1/2 skeleton-pulse"></div>
                    </div>
                    <div className="w-5 h-5 rounded skeleton-pulse flex-shrink-0"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return notFound()
  }

  return (
    <div className={`min-h-screen relative select-none overflow-x-hidden bg-slate-900 ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-white' : 'text-gray-900'}`}>
      {/* Base Background Color - covers entire scroll area */}
      <div
        className="fixed inset-0 bg-slate-900 z-0"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          minHeight: '100vh'
        }}
      />

      {/* Background Images - Fixed attachment so they stay in place when scrolling */}
      {/* Mobile Background */}
      {mobileBackground && (
        <div
          className="lg:hidden fixed inset-0 select-none pointer-events-none z-[1]"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            minHeight: '100vh',
            backgroundImage: `url(${mobileBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            transform: 'translateZ(0)',
            willChange: 'auto',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      )}

      {/* Desktop Background */}
      {desktopBackground && (
        <div
          className="hidden lg:block fixed inset-0 select-none pointer-events-none z-[1]"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            minHeight: '100vh',
            backgroundImage: `url(${desktopBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            transform: 'translateZ(0)',
            willChange: 'auto',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      )}

      {/* Fallback Background */}
      {fallbackBackground && !mobileBackground && !desktopBackground && (
        <div
          className="fixed inset-0 select-none pointer-events-none z-[1]"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            minHeight: '100vh',
            backgroundImage: `url(${fallbackBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            transform: 'translateZ(0)',
            willChange: 'auto',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      )}

      {/* Gradient Overlay with Enhanced Visual Effects */}
      <div
        className={`fixed inset-0 animated-gradient z-[2] ${mobileBackground || desktopBackground || fallbackBackground
          ? 'bg-gradient-to-br from-gray-900/60 via-slate-800/60 to-gray-900/60'
          : theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 via-slate-800 to-purple-800'
            : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 via-pink-50 to-blue-100'
          }`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          minHeight: '100vh'
        }}
      />

      {/* Content */}
      <div className={`relative z-10 ${pageLoaded ? 'page-fade-in' : ''}`}>
        {/* Action Buttons */}
        <button
          onClick={() => setShowShareModal(true)}
          className={`fixed top-4 left-4 z-40 w-14 h-14 ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-black/10 border-black/20 hover:bg-black/20'} backdrop-blur-md rounded-xl border transition-all group flex items-center justify-center focus-visible-ring`}
          title="Share Profile"
          aria-label="Share Profile"
        >
          <i className="fa-solid fa-share-from-square text-blue-400 group-hover:text-blue-300 text-lg" />
        </button>

        <div className="fixed top-4 right-4 z-40">
          <WalletProfile />
        </div>




        {/* Mobile Layout */}
        <div className="block lg:hidden">
          <div className="container mx-auto px-4 py-8 max-w-md">
            {/* Profile Header */}
            <div className="text-center mb-10 animate-fade-in">
              <div className="relative inline-block mb-6 group">
                {/* Avatar Container with Ring */}
                <div className="relative">
                  {/* Animated Ring - positioned around avatar */}
                  <div className="avatar-ring"></div>
                  {/* Loading skeleton */}
                  <div className="w-32 h-32 bg-white/10 rounded-full skeleton-pulse absolute inset-0 -z-10"></div>
                  {/* Avatar Image */}
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-32 h-32 rounded-full border-4 border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative z-10"
                    onLoad={(e) => {
                      const loader = e.currentTarget.previousElementSibling
                      if (loader && loader.classList.contains('skeleton-pulse')) {
                        loader.remove()
                      }
                    }}
                  />
                  {/* Multi-layer shadow effect */}
                  <div className="absolute inset-0 rounded-full shadow-[0_0_0_8px_rgba(255,255,255,0.05),0_0_0_16px_rgba(255,255,255,0.03)] -z-20 pointer-events-none"></div>
                </div>
              </div>
              <h1 className={`text-4xl font-bold ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-white' : 'text-gray-900'} mb-3 drop-shadow-lg tracking-tight`}>
                {profileData.name}
              </h1>
              <p className={`${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed max-w-sm mx-auto`}>
                {profileData.bio}
              </p>
            </div>

            {/* Social Links Section */}
            {profileData.socialLinks.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-center gap-3 flex-wrap max-w-xs mx-auto">
                  {profileData.socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${getSocialPlatformGradient(social.platform)} backdrop-blur-md rounded-xl border transition-all focus-visible-ring`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      aria-label={`Visit ${social.platform} profile`}
                      title={social.platform}
                    >
                      <IconComponent name={social.icon as any} className={`text-base ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-white' : 'text-gray-900'}`} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Links Section */}
            {profileData.links.length > 0 ? (
              <div className="space-y-4">
                {profileData.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => handleLinkClick(link.url, link.title)}
                    className={`w-full py-5 px-5 ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-black/10 border-black/20 hover:bg-black/20'} backdrop-blur-md rounded-xl border transition-all duration-300 gradient-border-hover focus-visible-ring group animate-stagger-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    aria-label={`Visit ${link.title}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                        <IconComponent
                          name={link.title.toLowerCase().includes('project') ? 'folder' : link.icon as any}
                          className="w-5 h-5 text-white"
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h3 className={`font-semibold text-base ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-white' : 'text-gray-900'} mb-1 truncate`}>
                          {link.title}
                        </h3>
                        <p className={`text-sm ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>
                          {link.description}
                        </p>
                      </div>
                      <i className={`fas fa-external-link-alt ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-gray-300' : 'text-gray-700'} hover-slide-right transition-transform flex-shrink-0`} />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 px-4 ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-gray-400' : 'text-gray-600'}`}>
                <i className="fas fa-link text-4xl mb-4 opacity-50"></i>
                <p className="text-sm">No links available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout - Vertical like mobile */}
        <div className="hidden lg:flex min-h-screen items-center justify-center">
          <div className="container mx-auto px-4 py-8 max-w-md">
            {/* Profile Header */}
            <div className="text-center mb-10 animate-fade-in">
              <div className="relative inline-block mb-6 group">
                {/* Avatar Container with Ring */}
                <div className="relative">
                  {/* Animated Ring - positioned around avatar */}
                  <div className="avatar-ring"></div>
                  {/* Loading skeleton */}
                  <div className="w-32 h-32 bg-white/10 rounded-full skeleton-pulse absolute inset-0 -z-10"></div>
                  {/* Avatar Image */}
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-32 h-32 rounded-full border-4 border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative z-10"
                    onLoad={(e) => {
                      const loader = e.currentTarget.previousElementSibling
                      if (loader && loader.classList.contains('skeleton-pulse')) {
                        loader.remove()
                      }
                    }}
                  />
                  {/* Multi-layer shadow effect */}
                  <div className="absolute inset-0 rounded-full shadow-[0_0_0_8px_rgba(255,255,255,0.05),0_0_0_16px_rgba(255,255,255,0.03)] -z-20 pointer-events-none"></div>
                </div>
              </div>
              <h1 className={`text-4xl font-bold ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-white' : 'text-gray-900'} mb-3 drop-shadow-lg tracking-tight`}>
                {profileData.name}
              </h1>
              <p className={`${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed max-w-sm mx-auto`}>
                {profileData.bio}
              </p>
            </div>

            {/* Social Links Section */}
            {profileData.socialLinks.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-center gap-3 flex-wrap max-w-xs mx-auto">
                  {profileData.socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${getSocialPlatformGradient(social.platform)} backdrop-blur-md rounded-xl border transition-all focus-visible-ring`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      aria-label={`Visit ${social.platform} profile`}
                      title={social.platform}
                    >
                      <IconComponent name={social.icon as any} className={`text-base ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-white' : 'text-gray-900'}`} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Links Section */}
            {profileData.links.length > 0 ? (
              <div className="space-y-4">
                {profileData.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => handleLinkClick(link.url, link.title)}
                    className={`w-full py-5 px-5 ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-black/10 border-black/20 hover:bg-black/20'} backdrop-blur-md rounded-xl border transition-all duration-300 gradient-border-hover focus-visible-ring group animate-stagger-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    aria-label={`Visit ${link.title}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                        <IconComponent
                          name={link.title.toLowerCase().includes('project') ? 'folder' : link.icon as any}
                          className="w-5 h-5 text-white"
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h3 className={`font-semibold text-base ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-white' : 'text-gray-900'} mb-1 truncate`}>
                          {link.title}
                        </h3>
                        <p className={`text-sm ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>
                          {link.description}
                        </p>
                      </div>
                      <i className={`fas fa-external-link-alt ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-gray-300' : 'text-gray-700'} hover-slide-right transition-transform flex-shrink-0`} />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 px-4 ${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-gray-400' : 'text-gray-600'}`}>
                <i className="fas fa-link text-4xl mb-4 opacity-50"></i>
                <p className="text-sm">No links available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer
          className={`${theme === 'dark' || mobileBackground || desktopBackground || fallbackBackground ? 'text-gray-400' : 'text-gray-600'}`}
          hideThemeSwitcher={!!(mobileBackground || desktopBackground || fallbackBackground)}
        />
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
          aria-describedby="share-modal-description"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowShareModal(false)} aria-hidden="true" />

          <div
            className="relative w-full sm:max-w-md bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-2xl border-t border-x border-white/20 shadow-2xl animate-slide-up touch-none"
            onTouchStart={(e) => {
              const touch = e.touches[0]
              const startY = touch.clientY
              const modal = e.currentTarget

              const onTouchMove = (moveEvent: TouchEvent) => {
                const currentY = moveEvent.touches[0].clientY
                const diff = currentY - startY

                if (diff > 0) {
                  modal.style.transform = `translateY(${diff}px)`
                  modal.style.opacity = `${1 - diff / 300}`
                }
              }

              const onTouchEnd = (endEvent: TouchEvent) => {
                const endY = endEvent.changedTouches[0].clientY
                const diff = endY - startY

                if (diff > 100) {
                  setShowShareModal(false)
                } else {
                  modal.style.transform = ''
                  modal.style.opacity = ''
                }

                document.removeEventListener('touchmove', onTouchMove)
                document.removeEventListener('touchend', onTouchEnd)
              }

              document.addEventListener('touchmove', onTouchMove)
              document.addEventListener('touchend', onTouchEnd)
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-white/40 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pt-2 pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 id="share-modal-title" className="text-xl font-bold text-white">Share Profile</h3>
                <p id="share-modal-description" className="text-xs text-gray-400 mt-1">Share this profile with others</p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors focus-visible-ring"
                aria-label="Close share modal"
              >
                <i className="fas fa-times text-white text-lg" />
              </button>
            </div>

            <div className="px-6 py-6">
              {/* Copy Link Section */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Copy Link</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm font-mono truncate">
                    {typeof window !== 'undefined' ? window.location.href : ''}
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const url = window.location.href
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                          await navigator.clipboard.writeText(url)
                          setShowCopiedToast(true)
                          setTimeout(() => setShowCopiedToast(false), 2000)
                        } else {
                          const textArea = document.createElement('textarea')
                          textArea.value = url
                          textArea.style.position = 'fixed'
                          textArea.style.opacity = '0'
                          document.body.appendChild(textArea)
                          textArea.select()
                          document.execCommand('copy')
                          document.body.removeChild(textArea)
                          setShowCopiedToast(true)
                          setTimeout(() => setShowCopiedToast(false), 2000)
                        }
                      } catch (err) {
                        console.error('Failed to copy:', err)
                      }
                    }}
                    className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl focus-visible-ring"
                    aria-label="Copy link to clipboard"
                  >
                    <i className="fas fa-copy text-white text-sm" />
                    <span className="text-white font-medium text-sm">Copy</span>
                  </button>
                </div>
              </div>

              {/* Social Share Icons */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">Share on Social Media</label>
                <div className="grid grid-cols-4 gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=Check out my profile!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 sm:p-5 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-500/30 hover:border-blue-400/50 hover:from-blue-500/30 hover:to-blue-600/20 transition-all flex items-center justify-center focus-visible-ring"
                    title="Share on Twitter"
                    aria-label="Share on Twitter"
                  >
                    <i className="fab fa-x-twitter text-blue-400 text-xl sm:text-2xl group-hover:text-blue-300 transition-colors" />
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 sm:p-5 bg-gradient-to-br from-blue-600/20 to-blue-700/10 rounded-xl border border-blue-600/30 hover:border-blue-500/50 hover:from-blue-600/30 hover:to-blue-700/20 transition-all flex items-center justify-center focus-visible-ring"
                    title="Share on Facebook"
                    aria-label="Share on Facebook"
                  >
                    <i className="fab fa-facebook text-blue-500 text-xl sm:text-2xl group-hover:text-blue-400 transition-colors" />
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=Check out my profile!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 sm:p-5 bg-gradient-to-br from-blue-400/20 to-blue-500/10 rounded-xl border border-blue-400/30 hover:border-blue-300/50 hover:from-blue-400/30 hover:to-blue-500/20 transition-all flex items-center justify-center focus-visible-ring"
                    title="Share on Telegram"
                    aria-label="Share on Telegram"
                  >
                    <i className="fab fa-telegram text-blue-400 text-xl sm:text-2xl group-hover:text-blue-300 transition-colors" />
                  </a>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 sm:p-5 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl border border-green-500/30 hover:border-green-400/50 hover:from-green-500/30 hover:to-green-600/20 transition-all flex items-center justify-center focus-visible-ring"
                    title="Share on WhatsApp"
                    aria-label="Share on WhatsApp"
                  >
                    <i className="fab fa-whatsapp text-green-400 text-xl sm:text-2xl group-hover:text-green-300 transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copied Toast */}
      {showCopiedToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl toast-enter flex items-center gap-2 backdrop-blur-sm border border-green-400/30">
          <i className="fas fa-check-circle" />
          <span className="font-medium">Link Copied!</span>
        </div>
      )}

      {/* Projects Modal */}
      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        projects={profileData.projects}
        accentColor="bg-blue-600"
      />
    </div>
  )
}