'use client';

import { useState, useEffect } from 'react';
import IconComponent from '@/components/IconComponent';
import Footer from '@/components/Footer';
import WalletProfile from '@/components/WalletProfile';


interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface Link {
  title: string;
  url: string;
  icon: string;
  description: string;
}

interface Project {
  title: string;
  description: string;
  tech: string[];
  url: string;
  image: string;
}

interface ProfileData {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  theme: {
    background: string;
    cardBg: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
  };
  socialLinks: SocialLink[];
  links: Link[];
  projects: Project[];
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

export default function CreatePage() {
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    name: '',
    bio: '',
    avatar: '',
    theme: {
      background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900',
      cardBg: 'bg-white/10 backdrop-blur-md',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      accent: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    socialLinks: [],
    links: [],
    projects: []
  });

  const [mobileBackground, setMobileBackground] = useState<string | null>(null)
  const [desktopBackground, setDesktopBackground] = useState<string | null>(null)
  const [fallbackBackground, setFallbackBackground] = useState<string | null>(null)

  const [showSocialModal, setShowSocialModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [socialUrl, setSocialUrl] = useState('');
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingSocial, setEditingSocial] = useState<number | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingLink, setEditingLink] = useState<number | null>(null);
  const [linkForm, setLinkForm] = useState({ title: '', url: '', description: '', icon: 'globe' });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importMethod, setImportMethod] = useState<'file' | 'text' | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showProjectsView, setShowProjectsView] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', tech: '', url: '', image: '' });
  const [techTags, setTechTags] = useState<string[]>([]);
  const [currentTech, setCurrentTech] = useState('');
  const [editingProject, setEditingProject] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [showToast, setShowToast] = useState(false);

  const linkIcons = [
    { name: 'globe', icon: 'fas fa-globe' },
    { name: 'envelope', icon: 'fas fa-envelope' },
    { name: 'Phone', icon: 'fas fa-phone' },
    { name: 'Location', icon: 'fas fa-map-marker-alt' },
    { name: 'Calendar', icon: 'fas fa-calendar' },
    { name: 'Clock', icon: 'fas fa-clock' },
    { name: 'User', icon: 'fas fa-user' },
    { name: 'Users', icon: 'fas fa-users' },
    { name: 'Heart', icon: 'fas fa-heart' },
    { name: 'Star', icon: 'fas fa-star' },
    { name: 'Bookmark', icon: 'fas fa-bookmark' },
    { name: 'Tag', icon: 'fas fa-tag' },
    { name: 'Flag', icon: 'fas fa-flag' },
    { name: 'Award', icon: 'fas fa-award' },
    { name: 'Trophy', icon: 'fas fa-trophy' },
    { name: 'Gift', icon: 'fas fa-gift' },
    { name: 'Camera', icon: 'fas fa-camera' },
    { name: 'Image', icon: 'fas fa-image' },
    { name: 'Video', icon: 'fas fa-video' },
    { name: 'Music', icon: 'fas fa-music' },
    { name: 'Headphones', icon: 'fas fa-headphones' },
    { name: 'Microphone', icon: 'fas fa-microphone' },
    { name: 'Volume', icon: 'fas fa-volume-up' },
    { name: 'Play', icon: 'fas fa-play' },
    { name: 'Download', icon: 'fas fa-download' },
    { name: 'Upload', icon: 'fas fa-upload' },
    { name: 'Share', icon: 'fas fa-share' },
    { name: 'Link', icon: 'fas fa-link' },
    { name: 'External', icon: 'fas fa-external-link-alt' },
    { name: 'Copy', icon: 'fas fa-copy' },
    { name: 'Edit', icon: 'fas fa-edit' },
    { name: 'Delete', icon: 'fas fa-trash' },
    { name: 'Settings', icon: 'fas fa-cog' },
    { name: 'Tools', icon: 'fas fa-tools' },
    { name: 'Wrench', icon: 'fas fa-wrench' },
    { name: 'Hammer', icon: 'fas fa-hammer' },
    { name: 'Lightning', icon: 'fas fa-bolt' },
    { name: 'Battery', icon: 'fas fa-battery-full' },
    { name: 'Wifi', icon: 'fas fa-wifi' },
    { name: 'Bluetooth', icon: 'fab fa-bluetooth' },
    { name: 'Monitor', icon: 'fas fa-desktop' },
    { name: 'Mobile', icon: 'fas fa-mobile-alt' },
    { name: 'Tablet', icon: 'fas fa-tablet-alt' },
    { name: 'Laptop', icon: 'fas fa-laptop' },
    { name: 'Storage', icon: 'fas fa-hdd' },
    { name: 'Database', icon: 'fas fa-database' },
    { name: 'Server', icon: 'fas fa-server' },
    { name: 'Cloud', icon: 'fas fa-cloud' },
    { name: 'github', icon: 'fab fa-github' },
    { name: 'linkedin', icon: 'fab fa-linkedin' },
    { name: 'twitter', icon: 'fab fa-x-twitter' },
    { name: 'instagram', icon: 'fab fa-instagram' },
    { name: 'facebook', icon: 'fab fa-facebook' },
    { name: 'youtube', icon: 'fab fa-youtube' },
    { name: 'Twitch', icon: 'fab fa-twitch' },
    { name: 'Discord', icon: 'fab fa-discord' }
  ];

  const socialPlatforms = [
    { name: 'Email', icon: 'fas fa-envelope', placeholder: 'your@email.com', baseUrl: '', color: '#EA4335' },
    { name: 'X (Twitter)', icon: 'fab fa-x-twitter', placeholder: 'https://x.com/', baseUrl: 'https://x.com/', color: '#000000' },
    { name: 'instagram', icon: 'fab fa-instagram', placeholder: 'https://instagram.com/', baseUrl: 'https://instagram.com/', color: '#E4405F' },
    { name: 'youtube', icon: 'fab fa-youtube', placeholder: 'https://youtube.com/@', baseUrl: 'https://youtube.com/@', color: '#FF0000' },
    { name: 'facebook', icon: 'fab fa-facebook', placeholder: 'https://facebook.com/', baseUrl: 'https://facebook.com/', color: '#1877F2' },
    { name: 'Discord', icon: 'fab fa-discord', placeholder: 'https://discord.gg/', baseUrl: 'https://discord.gg/', color: '#5865F2' },
    { name: 'Telegram', icon: 'fab fa-telegram', placeholder: 'https://t.me/', baseUrl: 'https://t.me/', color: '#0088CC' },
    { name: 'TikTok', icon: 'fab fa-tiktok', placeholder: 'https://tiktok.com/@', baseUrl: 'https://tiktok.com/@', color: '#000000' },
    { name: 'Spotify', icon: 'fab fa-spotify', placeholder: 'https://open.spotify.com/user/', baseUrl: 'https://open.spotify.com/user/', color: '#1DB954' },
    { name: 'Snapchat', icon: 'fab fa-snapchat', placeholder: 'https://snapchat.com/add/', baseUrl: 'https://snapchat.com/add/', color: '#FFFC00' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', placeholder: 'https://wa.me/', baseUrl: 'https://wa.me/', color: '#25D366' },
    { name: 'linkedin', icon: 'fab fa-linkedin', placeholder: 'https://linkedin.com/in/', baseUrl: 'https://linkedin.com/in/', color: '#0A66C2' },
    { name: 'github', icon: 'fab fa-github', placeholder: 'https://github.com/', baseUrl: 'https://github.com/', color: '#181717' },
    { name: 'Twitch', icon: 'fab fa-twitch', placeholder: 'https://twitch.tv/', baseUrl: 'https://twitch.tv/', color: '#9146FF' },
    { name: 'Reddit', icon: 'fab fa-reddit', placeholder: 'https://reddit.com/u/', baseUrl: 'https://reddit.com/u/', color: '#FF4500' }
  ];

  const handlePlatformSelect = (platform: any) => {
    setSelectedPlatform(platform);
    setSocialUrl(platform.baseUrl || '');
  };

  const addSocialLink = () => {
    if (selectedPlatform && socialUrl.trim()) {
      let finalUrl = socialUrl.trim();

      // Auto add mailto: for email
      if (selectedPlatform.name === 'Email' && !finalUrl.startsWith('mailto:')) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(finalUrl)) {
          finalUrl = `mailto:${finalUrl}`;
        } else {
          setToastMessage('Please enter a valid email address')
          setToastType('error')
          setShowToast(true)
          setTimeout(() => setShowToast(false), 3000)
          return;
        }
      }

      setProfile(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, {
          platform: selectedPlatform.name,
          url: finalUrl,
          icon: selectedPlatform.icon.replace('fab fa-', '').replace('fas fa-', '')
        }]
      }));
      setShowSocialModal(false);
      setSelectedPlatform(null);
      setSocialUrl('');
    }
  };

  const deleteSocialLink = (index: number) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
    setEditingSocial(null);
  };

  const moveSocialLink = (fromIndex: number, toIndex: number) => {
    setProfile(prev => {
      const newLinks = [...prev.socialLinks];
      const [moved] = newLinks.splice(fromIndex, 1);
      newLinks.splice(toIndex, 0, moved);
      return { ...prev, socialLinks: newLinks };
    });
  };

  const moveLink = (fromIndex: number, toIndex: number) => {
    setProfile(prev => {
      const newLinks = [...prev.links];
      const [moved] = newLinks.splice(fromIndex, 1);
      newLinks.splice(toIndex, 0, moved);
      return { ...prev, links: newLinks };
    });
  };

  const moveProject = (fromIndex: number, toIndex: number) => {
    setProfile(prev => {
      const newProjects = [...prev.projects];
      const [moved] = newProjects.splice(fromIndex, 1);
      newProjects.splice(toIndex, 0, moved);
      return { ...prev, projects: newProjects };
    });
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `db.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    navigator.clipboard.writeText(dataStr);
    setToastMessage('JSON copied to clipboard!')
    setToastType('success')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
    setShowExportModal(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setProfile(data);
          setShowImportModal(false);
          setImportMethod(null);
        } catch (error) {
          setToastMessage('Invalid JSON file')
          setToastType('error')
          setShowToast(true)
          setTimeout(() => setShowToast(false), 3000)
        }
      };
      reader.readAsText(file);
    }
  };

  const handleJsonImport = () => {
    try {
      const data = JSON.parse(jsonText);
      setProfile(data);
      setShowImportModal(false);
      setImportMethod(null);
      setJsonText('');
    } catch (error) {
      setToastMessage('Invalid JSON format')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  };

  const addTechTag = () => {
    if (currentTech.trim() && !techTags.includes(currentTech.trim())) {
      setTechTags([...techTags, currentTech.trim()]);
      setCurrentTech('');
    }
  };

  const removeTechTag = (index: number) => {
    setTechTags(techTags.filter((_, i) => i !== index));
  };

  // Load background images on mount
  useEffect(() => {
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

    const loadBackgrounds = async () => {
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
    }

    loadBackgrounds()
  }, [])

  const addProject = () => {
    if (projectForm.title && projectForm.description && projectForm.url && techTags.length > 0) {
      if (editingProject !== null) {
        setProfile(prev => ({
          ...prev,
          projects: prev.projects.map((project, i) =>
            i === editingProject ? {
              title: projectForm.title,
              description: projectForm.description,
              tech: techTags,
              url: projectForm.url,
              image: projectForm.image || 'https://via.placeholder.com/400x200'
            } : project
          )
        }));
      } else {
        setProfile(prev => ({
          ...prev,
          projects: [...prev.projects, {
            title: projectForm.title,
            description: projectForm.description,
            tech: techTags,
            url: projectForm.url,
            image: projectForm.image || 'https://via.placeholder.com/400x200'
          }]
        }));
      }
      setProjectForm({ title: '', description: '', tech: '', url: '', image: '' });
      setTechTags([]);
      setEditingProject(null);
      setShowProjectModal(false);
    }
  };

  const deleteProject = (index: number) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.0/css/all.min.css" />
      <div className="min-h-screen relative select-none overflow-x-hidden bg-slate-900 text-white">
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
            : 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 via-slate-800 to-purple-800'
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
        <div className="relative z-10">
          {/* Import/Export Buttons */}
          <div className="fixed top-4 right-4 z-40 flex gap-2 items-center">
            <WalletProfile />
            <div className="w-px h-8 bg-white/20 mx-2" />
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <i className="fas fa-upload text-white" />
              <span className="text-white text-sm font-medium">Import</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <i className="fas fa-download text-white" />
              <span className="text-white text-sm font-medium">Export</span>
            </button>
          </div>

          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="container mx-auto px-4 pt-20 pb-8 max-w-md">
              {/* Profile Header */}
              <div className="text-center mb-10 animate-fade-in">
                <div className="relative inline-block mb-6 group">
                  {/* Avatar Container with Ring */}
                  <div className="relative">
                    {/* Animated Ring */}
                    <div className="avatar-ring"></div>
                    {/* Loading skeleton */}
                    <div className="w-32 h-32 bg-white/10 rounded-full animate-pulse absolute inset-0 -z-10"></div>
                    {/* Avatar Image */}
                    <img
                      src={profile.avatar || 'https://via.placeholder.com/128'}
                      alt={profile.name || 'Profile'}
                      className="w-32 h-32 rounded-full border-4 border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative z-10"
                      onLoad={(e) => {
                        const loader = e.currentTarget.previousElementSibling
                        if (loader && loader.classList.contains('animate-pulse')) {
                          loader.remove()
                        }
                      }}
                    />
                    {/* Multi-layer shadow effect */}
                    <div className="absolute inset-0 rounded-full shadow-[0_0_0_8px_rgba(255,255,255,0.05),0_0_0_16px_rgba(255,255,255,0.03)] -z-20 pointer-events-none"></div>
                    {/* Edit button */}
                    <button
                      onClick={() => setEditingBasic(true)}
                      className="absolute -top-1 -right-1 w-9 h-9 flex items-center justify-center bg-blue-500 rounded-full border-2 border-white shadow-lg focus-visible-ring z-20"
                      aria-label="Edit profile"
                    >
                      <i className="fas fa-edit text-white text-xs" />
                    </button>
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg tracking-tight">
                  {profile.name || 'Your Name'}
                </h1>
                <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
                  {profile.bio || 'Your bio here...'}
                </p>
              </div>

              {/* Social Links Section */}
              <div className="mb-10">
                <div className="flex justify-center gap-3 flex-wrap max-w-xs mx-auto">
                  {profile.socialLinks.map((social, index) => (
                    <div key={index} className="relative group">
                      <button
                        onClick={() => setEditingSocial(index)}
                        className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${getSocialPlatformGradient(social.platform)} backdrop-blur-md rounded-xl border transition-all focus-visible-ring`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        aria-label={`Edit ${social.platform} link`}
                      >
                        <IconComponent name={social.icon as any} className="text-base text-white" />
                      </button>
                      <div className="absolute -top-1 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {index > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveSocialLink(index, index - 1)
                            }}
                            className="w-5 h-5 flex items-center justify-center bg-green-500 rounded-full shadow-lg focus-visible-ring"
                            aria-label="Move left"
                          >
                            <i className="fas fa-arrow-left text-white text-xs" />
                          </button>
                        )}
                        {index < profile.socialLinks.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveSocialLink(index, index + 1)
                            }}
                            className="w-5 h-5 flex items-center justify-center bg-green-500 rounded-full shadow-lg focus-visible-ring"
                            aria-label="Move right"
                          >
                            <i className="fas fa-arrow-right text-white text-xs" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingSocial(index)
                          }}
                          className="w-5 h-5 flex items-center justify-center bg-blue-500 rounded-full shadow-lg focus-visible-ring"
                          aria-label="Edit"
                        >
                          <i className="fas fa-edit text-white text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowSocialModal(true)}
                    className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all focus-visible-ring"
                    aria-label="Add social link"
                  >
                    <i className="fas fa-plus text-white text-base" />
                  </button>
                </div>
              </div>

              {/* Links & Projects */}
              <div className="space-y-4">
                {profile.links.map((link, index) => (
                  <div key={index} className="relative group animate-stagger-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <button
                      className="w-full py-5 px-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 gradient-border-hover focus-visible-ring"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <IconComponent
                            name={link.title.toLowerCase().includes('project') ? 'folder' : link.icon}
                            className="w-5 h-5 text-white"
                          />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <h3 className="font-semibold text-base text-white mb-1 truncate">
                            {link.title || 'Link Title'}
                          </h3>
                          <p className="text-sm text-gray-300 line-clamp-2">
                            {link.description || 'Description'}
                          </p>
                        </div>
                        <i className="fas fa-external-link-alt text-gray-300 hover-slide-right transition-transform flex-shrink-0" />
                      </div>
                    </button>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {index > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveLink(index, index - 1)
                          }}
                          className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-full shadow-lg focus-visible-ring"
                          aria-label="Move up"
                        >
                          <i className="fas fa-arrow-up text-white text-xs" />
                        </button>
                      )}
                      {index < profile.links.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveLink(index, index + 1)
                          }}
                          className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-full shadow-lg focus-visible-ring"
                          aria-label="Move down"
                        >
                          <i className="fas fa-arrow-down text-white text-xs" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setLinkForm({
                            title: link.title,
                            url: link.url,
                            description: link.description,
                            icon: link.icon
                          });
                          setEditingLink(index);
                          setShowLinkModal(true);
                        }}
                        className="w-6 h-6 flex items-center justify-center bg-blue-500 rounded-full shadow-lg focus-visible-ring"
                        aria-label="Edit link"
                      >
                        <i className="fas fa-edit text-white text-xs" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Projects Trigger Link */}
                {profile.projects.length > 0 && (
                  <div className="relative group animate-stagger-fade-in">
                    <button
                      onClick={() => setShowProjectsView(true)}
                      className="w-full py-5 px-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 gradient-border-hover focus-visible-ring"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <IconComponent name="folder" className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-base text-white mb-1">My Projects</h3>
                          <p className="text-sm text-gray-300">View my latest work ({profile.projects.length})</p>
                        </div>
                        <i className="fas fa-external-link-alt text-gray-300 hover-slide-right transition-transform flex-shrink-0" />
                      </div>
                    </button>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setLinkForm({ title: '', url: '', description: '', icon: 'globe' });
                      setEditingLink(null);
                      setShowLinkModal(true);
                    }}
                    className="flex-1 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 focus-visible-ring"
                  >
                    <i className="fas fa-plus text-white" />
                    <span className="text-white font-medium">Add Link</span>
                  </button>
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="flex-1 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 focus-visible-ring"
                  >
                    <i className="fas fa-folder text-white" />
                    <span className="text-white font-medium">Add Project</span>
                  </button>
                </div>
              </div>


            </div>
          </div>

          {/* Desktop Layout - Vertical like mobile */}
          <div className="hidden lg:flex min-h-screen items-center justify-center">
            <div className="container mx-auto px-4 pt-20 pb-8 max-w-md">
              {/* Profile Header */}
              <div className="text-center mb-10 animate-fade-in">
                <div className="relative inline-block mb-6 group">
                  {/* Avatar Container with Ring */}
                  <div className="relative">
                    {/* Animated Ring */}
                    <div className="avatar-ring"></div>
                    {/* Loading skeleton */}
                    <div className="w-32 h-32 bg-white/10 rounded-full animate-pulse absolute inset-0 -z-10"></div>
                    {/* Avatar Image */}
                    <img
                      src={profile.avatar || 'https://via.placeholder.com/128'}
                      alt={profile.name || 'Profile'}
                      className="w-32 h-32 rounded-full border-4 border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative z-10"
                      onLoad={(e) => {
                        const loader = e.currentTarget.previousElementSibling
                        if (loader && loader.classList.contains('animate-pulse')) {
                          loader.remove()
                        }
                      }}
                    />
                    {/* Multi-layer shadow effect */}
                    <div className="absolute inset-0 rounded-full shadow-[0_0_0_8px_rgba(255,255,255,0.05),0_0_0_16px_rgba(255,255,255,0.03)] -z-20 pointer-events-none"></div>
                    {/* Edit button */}
                    <button
                      onClick={() => setEditingBasic(true)}
                      className="absolute -top-1 -right-1 w-9 h-9 flex items-center justify-center bg-blue-500 rounded-full border-2 border-white shadow-lg focus-visible-ring z-20"
                      aria-label="Edit profile"
                    >
                      <i className="fas fa-edit text-white text-xs" />
                    </button>
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg tracking-tight">
                  {profile.name || 'Your Name'}
                </h1>
                <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
                  {profile.bio || 'Your bio here...'}
                </p>
              </div>

              {/* Social Links Section */}
              <div className="mb-10">
                <div className="flex justify-center gap-3 flex-wrap max-w-xs mx-auto">
                  {profile.socialLinks.map((social, index) => (
                    <div key={index} className="relative group">
                      <button
                        onClick={() => setEditingSocial(index)}
                        className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${getSocialPlatformGradient(social.platform)} backdrop-blur-md rounded-xl border transition-all focus-visible-ring`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        aria-label={`Edit ${social.platform} link`}
                      >
                        <IconComponent name={social.icon as any} className="text-base text-white" />
                      </button>
                      <div className="absolute -top-1 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {index > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveSocialLink(index, index - 1)
                            }}
                            className="w-5 h-5 flex items-center justify-center bg-green-500 rounded-full shadow-lg focus-visible-ring"
                            aria-label="Move left"
                          >
                            <i className="fas fa-arrow-left text-white text-xs" />
                          </button>
                        )}
                        {index < profile.socialLinks.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveSocialLink(index, index + 1)
                            }}
                            className="w-5 h-5 flex items-center justify-center bg-green-500 rounded-full shadow-lg focus-visible-ring"
                            aria-label="Move right"
                          >
                            <i className="fas fa-arrow-right text-white text-xs" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingSocial(index)
                          }}
                          className="w-5 h-5 flex items-center justify-center bg-blue-500 rounded-full shadow-lg focus-visible-ring"
                          aria-label="Edit"
                        >
                          <i className="fas fa-edit text-white text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowSocialModal(true)}
                    className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all focus-visible-ring"
                    aria-label="Add social link"
                  >
                    <i className="fas fa-plus text-white text-base" />
                  </button>
                </div>
              </div>

              {/* Links & Projects */}
              <div className="space-y-4">
                {profile.links.map((link, index) => (
                  <div key={index} className="relative group animate-stagger-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <button
                      className="w-full py-5 px-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 gradient-border-hover focus-visible-ring"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <IconComponent
                            name={link.title.toLowerCase().includes('project') ? 'folder' : link.icon}
                            className="w-5 h-5 text-white"
                          />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <h3 className="font-semibold text-base text-white mb-1 truncate">
                            {link.title || 'Link Title'}
                          </h3>
                          <p className="text-sm text-gray-300 line-clamp-2">
                            {link.description || 'Description'}
                          </p>
                        </div>
                        <i className="fas fa-external-link-alt text-gray-300 hover-slide-right transition-transform flex-shrink-0" />
                      </div>
                    </button>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {index > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveLink(index, index - 1)
                          }}
                          className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-full shadow-lg focus-visible-ring"
                          aria-label="Move up"
                        >
                          <i className="fas fa-arrow-up text-white text-xs" />
                        </button>
                      )}
                      {index < profile.links.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveLink(index, index + 1)
                          }}
                          className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-full shadow-lg focus-visible-ring"
                          aria-label="Move down"
                        >
                          <i className="fas fa-arrow-down text-white text-xs" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setLinkForm({
                            title: link.title,
                            url: link.url,
                            description: link.description,
                            icon: link.icon
                          });
                          setEditingLink(index);
                          setShowLinkModal(true);
                        }}
                        className="w-6 h-6 flex items-center justify-center bg-blue-500 rounded-full shadow-lg focus-visible-ring"
                        aria-label="Edit link"
                      >
                        <i className="fas fa-edit text-white text-xs" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Projects Trigger Link */}
                {profile.projects.length > 0 && (
                  <div className="relative group animate-stagger-fade-in">
                    <button
                      onClick={() => setShowProjectsView(true)}
                      className="w-full py-5 px-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 gradient-border-hover focus-visible-ring"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <IconComponent name="folder" className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-base text-white mb-1">My Projects</h3>
                          <p className="text-sm text-gray-300">View my latest work ({profile.projects.length})</p>
                        </div>
                        <i className="fas fa-external-link-alt text-gray-300 hover-slide-right transition-transform flex-shrink-0" />
                      </div>
                    </button>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setLinkForm({ title: '', url: '', description: '', icon: 'globe' });
                      setEditingLink(null);
                      setShowLinkModal(true);
                    }}
                    className="flex-1 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 focus-visible-ring"
                  >
                    <i className="fas fa-plus text-white" />
                    <span className="text-white font-medium">Add Link</span>
                  </button>
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="flex-1 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 focus-visible-ring"
                  >
                    <i className="fas fa-folder text-white" />
                    <span className="text-white font-medium">Add Project</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <Footer
            className="text-gray-400"
            hideThemeSwitcher={!!(mobileBackground || desktopBackground || fallbackBackground)}
          />
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className={`fixed bottom-6 left-6 z-50 px-4 py-2 rounded-full shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}>
            <i className={`${toastType === 'success' ? 'fas fa-check' : 'fas fa-exclamation-triangle'} mr-2`} />
            {toastMessage}
          </div>
        )}
      </div>

      {/* Basic Info Edit Modal */}
      {editingBasic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
              <button
                onClick={() => setEditingBasic(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={profile.username}
                onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />

              <input
                type="text"
                placeholder="Full Name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />

              <textarea
                placeholder="Bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full p-3 border rounded-lg h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />

              <input
                type="url"
                placeholder="Avatar URL"
                value={profile.avatar}
                onChange={(e) => setProfile(prev => ({ ...prev, avatar: e.target.value }))}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />

              <button
                onClick={() => setEditingBasic(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Edit Modal */}
      {editingSocial !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Social Link</h3>
              <button
                onClick={() => setEditingSocial(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg dark:border-gray-600">
                <IconComponent name={profile.socialLinks[editingSocial].icon as any} className="text-blue-500 text-lg" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {profile.socialLinks[editingSocial].platform}
                </span>
              </div>

              <input
                type="url"
                placeholder="URL"
                value={profile.socialLinks[editingSocial].url}
                onChange={(e) => {
                  const newLinks = [...profile.socialLinks];
                  newLinks[editingSocial].url = e.target.value;
                  setProfile(prev => ({ ...prev, socialLinks: newLinks }));
                }}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => deleteSocialLink(editingSocial)}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-trash text-sm" />
                  Delete
                </button>
                <button
                  onClick={() => setEditingSocial(null)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Modal */}
      {showSocialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedPlatform ? 'Enter URL' : 'Select Platform'}
              </h3>
              <button
                onClick={() => {
                  setShowSocialModal(false);
                  setSelectedPlatform(null);
                  setSocialUrl('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            <div className="p-6">
              {!selectedPlatform ? (
                <div className="grid grid-cols-3 gap-3">
                  {socialPlatforms.map((platform, index) => (
                    <button
                      key={index}
                      onClick={() => handlePlatformSelect(platform)}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 flex flex-col items-center gap-2"
                    >
                      <i className={`${platform.icon} text-lg`} style={{ color: platform.color }}></i>
                      <span className="text-xs text-gray-900 dark:text-white text-center">{platform.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg dark:border-gray-600">
                    <i className={`${selectedPlatform.icon} text-lg`} style={{ color: selectedPlatform.color }}></i>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedPlatform.name}</span>
                  </div>

                  <input
                    type={selectedPlatform.name === 'Email' ? 'email' : 'url'}
                    placeholder={selectedPlatform.placeholder}
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                    onKeyPress={(e) => e.key === 'Enter' && addSocialLink()}
                    autoFocus
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedPlatform(null);
                        setSocialUrl('');
                      }}
                      className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                    >
                      Back
                    </button>
                    <button
                      onClick={addSocialLink}
                      disabled={!socialUrl.trim()}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Add Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export JSON Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Export Profile</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <button
                onClick={downloadJSON}
                className="w-full p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 flex items-center gap-3"
              >
                <i className="fas fa-file-download text-blue-500 text-lg" />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">Download JSON File</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Save as db.json file to your device</div>
                </div>
              </button>
              <button
                onClick={copyToClipboard}
                className="w-full p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 flex items-center gap-3"
              >
                <i className="fas fa-copy text-green-500 text-lg" />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">Copy JSON Data</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Copy JSON content to clipboard</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {importMethod ? (importMethod === 'file' ? 'Upload JSON File' : 'Paste JSON Data') : 'Import Profile'}
              </h3>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportMethod(null);
                  setJsonText('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            <div className="p-6">
              {!importMethod ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setImportMethod('file')}
                    className="w-full p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 flex items-center gap-3"
                  >
                    <i className="fas fa-file-upload text-blue-500 text-lg" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">Upload JSON File</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Select a db.json file from your device</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setImportMethod('text')}
                    className="w-full p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 flex items-center gap-3"
                  >
                    <i className="fas fa-paste text-green-500 text-lg" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">Paste JSON Data</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Copy and paste JSON content directly</div>
                    </div>
                  </button>
                </div>
              ) : importMethod === 'file' ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Choose a JSON file to upload</p>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="json-upload"
                    />
                    <label
                      htmlFor="json-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
                    >
                      Select File
                    </label>
                  </div>
                  <button
                    onClick={() => setImportMethod(null)}
                    className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                  >
                    Back
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    placeholder="Paste your JSON data here..."
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className="w-full p-3 border rounded-lg h-40 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setImportMethod(null)}
                      className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleJsonImport}
                      disabled={!jsonText.trim()}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Import
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Link Add/Edit Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingLink !== null ? 'Edit Link' : 'Add Link'}
              </h3>
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setEditingLink(null);
                  setLinkForm({ title: '', url: '', description: '', icon: 'globe' });
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Link Title"
                value={linkForm.title}
                onChange={(e) => setLinkForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />

              <input
                type="url"
                placeholder="https://example.com"
                value={linkForm.url}
                onChange={(e) => setLinkForm(prev => ({ ...prev, url: e.target.value }))}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />

              <textarea
                placeholder="Description (max 50 characters)"
                value={linkForm.description}
                onChange={(e) => {
                  if (e.target.value.length <= 50) {
                    setLinkForm(prev => ({ ...prev, description: e.target.value }));
                  }
                }}
                className="w-full p-3 border rounded-lg h-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                {linkForm.description.length}/50
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Icon</label>
                <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto border rounded-lg p-2 dark:border-gray-600">
                  {linkIcons.map((iconObj) => (
                    <button
                      key={iconObj.name}
                      type="button"
                      onClick={() => setLinkForm(prev => ({ ...prev, icon: iconObj.name }))}
                      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${linkForm.icon === iconObj.name ? 'bg-blue-100 dark:bg-blue-900' : ''
                        }`}
                    >
                      <i className={`${iconObj.icon} text-gray-700 dark:text-gray-300`}></i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {editingLink !== null && (
                  <button
                    onClick={() => {
                      setProfile(prev => ({
                        ...prev,
                        links: prev.links.filter((_, i) => i !== editingLink)
                      }));
                      setShowLinkModal(false);
                      setEditingLink(null);
                      setLinkForm({ title: '', url: '', description: '', icon: 'globe' });
                    }}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-trash text-sm" />
                    Delete
                  </button>
                )}
                <button
                  onClick={() => {
                    const isValidUrl = linkForm.url && (linkForm.url.startsWith('http://') || linkForm.url.startsWith('https://') || linkForm.url.startsWith('mailto:'));
                    if (linkForm.title && isValidUrl) {
                      if (editingLink !== null) {
                        // Edit existing link
                        setProfile(prev => ({
                          ...prev,
                          links: prev.links.map((link, i) =>
                            i === editingLink ? { ...linkForm } : link
                          )
                        }));
                      } else {
                        // Add new link
                        setProfile(prev => ({
                          ...prev,
                          links: [...prev.links, { ...linkForm }]
                        }));
                      }
                      setShowLinkModal(false);
                      setEditingLink(null);
                      setLinkForm({ title: '', url: '', description: '', icon: 'globe' });
                    }
                  }}
                  disabled={!linkForm.title || !linkForm.url || (!linkForm.url.startsWith('http://') && !linkForm.url.startsWith('https://') && !linkForm.url.startsWith('mailto:'))}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {editingLink !== null ? 'Save Changes' : 'Add Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add Project</h3>
              <button
                onClick={() => {
                  setShowProjectModal(false);
                  setProjectForm({ title: '', description: '', tech: '', url: '', image: '' });
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                value={projectForm.title}
                onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />

              <textarea
                placeholder="Project Description"
                value={projectForm.description}
                onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border rounded-lg h-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">TAGS</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {techTags.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
                    >
                      {tech}
                      <button
                        onClick={() => removeTechTag(index)}
                        className="text-blue-600 dark:text-blue-300 hover:text-red-500"
                      >
                        <i className="fas fa-times text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
                <textarea
                  placeholder="Type TAG and press Enter"
                  value={currentTech}
                  onChange={(e) => setCurrentTech(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechTag();
                    }
                  }}
                  className="w-full p-3 border rounded-lg h-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                />
              </div>

              <input
                type="url"
                placeholder="Project URL"
                value={projectForm.url}
                onChange={(e) => setProjectForm(prev => ({ ...prev, url: e.target.value }))}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />

              <input
                type="url"
                placeholder="Image URL (optional)"
                value={projectForm.image}
                onChange={(e) => setProjectForm(prev => ({ ...prev, image: e.target.value }))}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />

              <button
                onClick={addProject}
                disabled={!projectForm.title || !projectForm.description || !projectForm.url || techTags.length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {editingProject !== null ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Projects Modal */}
      {showProjectsView && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowProjectsView(false)} />

          <div
            className="relative w-full sm:max-w-4xl max-h-[90vh] bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-2xl border-t border-x border-white/20 shadow-2xl animate-slide-up overflow-hidden"
          >
            {/* Drag Handle & Header - Swipeable Area */}
            <div
              className="cursor-grab active:cursor-grabbing"
              onTouchStart={(e) => {
                const touch = e.touches[0]
                const startY = touch.clientY
                const modal = e.currentTarget.closest('[class*="relative"]') as HTMLElement
                let hasMoved = false

                const onTouchMove = (moveEvent: TouchEvent) => {
                  const currentY = moveEvent.touches[0].clientY
                  const diffY = currentY - startY

                  // Only allow downward swipe
                  if (diffY > 0) {
                    hasMoved = true
                    if (modal) {
                      moveEvent.preventDefault()
                      modal.style.transform = `translateY(${diffY}px)`
                      modal.style.opacity = `${1 - diffY / 300}`
                    }
                  }
                }

                const onTouchEnd = (endEvent: TouchEvent) => {
                  const endY = endEvent.changedTouches[0].clientY
                  const diffY = endY - startY

                  if (hasMoved && diffY > 100 && modal) {
                    setShowProjectsView(false)
                  } else if (modal) {
                    modal.style.transform = ''
                    modal.style.opacity = ''
                  }

                  document.removeEventListener('touchmove', onTouchMove)
                  document.removeEventListener('touchend', onTouchEnd)
                }

                document.addEventListener('touchmove', onTouchMove, { passive: false })
                document.addEventListener('touchend', onTouchEnd)
              }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 bg-white/40 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 pt-2 pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">My Projects</h3>
                <p className="text-xs text-gray-400 mt-1">View my latest work ({profile.projects.length})</p>
              </div>
            </div>

            {/* Projects Grid - Scrollable Area */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-150px)]" style={{ touchAction: 'pan-y' }}>
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {profile.projects.map((project, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden shadow-lg relative group">
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      {index > 0 && (
                        <button
                          onClick={() => moveProject(index, index - 1)}
                          className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center"
                        >
                          <i className="fas fa-arrow-up text-xs" />
                        </button>
                      )}
                      {index < profile.projects.length - 1 && (
                        <button
                          onClick={() => moveProject(index, index + 1)}
                          className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center"
                        >
                          <i className="fas fa-arrow-down text-xs" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setProjectForm({
                            title: project.title,
                            description: project.description,
                            tech: '',
                            url: project.url,
                            image: project.image
                          });
                          setTechTags(project.tech);
                          setEditingProject(index);
                          setShowProjectModal(true);
                          setShowProjectsView(false);
                        }}
                        className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center"
                      >
                        <i className="fas fa-edit text-xs" />
                      </button>
                      <button
                        onClick={() => deleteProject(index)}
                        className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <i className="fas fa-trash text-xs" />
                      </button>
                    </div>

                    <div className="aspect-video overflow-hidden relative">
                      <div className="w-full h-full bg-white/10 animate-pulse absolute"></div>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover relative z-10"
                        onLoad={(e) => {
                          const loader = e.currentTarget.previousElementSibling as HTMLElement;
                          if (loader) loader.remove();
                        }}
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 text-xs bg-white/20 text-gray-200 rounded-full backdrop-blur-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-medium shadow-lg w-full justify-center"
                      >
                        View Project
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}