import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProfile } from '../services/dataService';
import { UserProfile, LinkItem, ThemeType } from '../types';
import { ThemeWrapper, getButtonClasses } from './ThemeWrapper';
import { getSocialIcon, getGenericIcon } from './Icons';
import { BadgeCheck, Share2, AlertCircle, ChevronRight, ExternalLink, Layers, ArrowLeft } from 'lucide-react';

interface ProfileViewProps {
    initialData?: UserProfile;
    disableNavigation?: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ initialData, disableNavigation }) => {
  const { username } = useParams<{ username: string }>();
  const [fetchedProfile, setFetchedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  // Determine which profile data to use: prop (preview) or fetched (live)
  const rawProfile = initialData || fetchedProfile;

  // Ensure robust default values to prevent crashes if on-chain data is partial/broken
  const profile: UserProfile | null = rawProfile ? {
      ...rawProfile,
      theme: rawProfile.theme || { type: ThemeType.ModernBlack },
      socials: Array.isArray(rawProfile.socials) ? rawProfile.socials : [],
      links: Array.isArray(rawProfile.links) ? rawProfile.links : [],
      projects: Array.isArray(rawProfile.projects) ? rawProfile.projects : [],
      projectCard: rawProfile.projectCard || { title: 'Featured Projects', description: 'Explore my portfolio', icon: 'Layers' }
  } : null;

  useEffect(() => {
    // Only fetch if we don't have initialData (preview mode) and we have a username
    if (username && !initialData) {
      setLoading(true);
      const timer = setTimeout(() => {
          fetchProfile(username)
            .then((data) => {
              if (data) {
                setFetchedProfile(data);
              } else {
                setError(true);
              }
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
      }, 800);
      return () => clearTimeout(timer);
    } else if (initialData) {
        setLoading(false);
    }
  }, [username, initialData]);

  const handleShare = async () => {
    if (!profile) return;
    const url = window.location.href;
    const title = profile.displayName || 'Bio Link';

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      alert('Could not share profile.');
    }
  };

  if (loading && !profile) return <ProfileSkeleton />;

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Profile Not Found</h1>
        <a href="/" className="mt-8 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all">Back to Home</a>
      </div>
    );
  }

  const isLightTheme = profile.theme.type === ThemeType.CleanWhite;
  const projectCard = profile.projectCard || { title: 'Featured Projects', description: 'Explore my portfolio', icon: 'Layers' };
  
  // Prevent body scroll when drawer is open
  useEffect(() => {
      if (isProjectsOpen) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = '';
      }
      return () => { document.body.style.overflow = ''; };
  }, [isProjectsOpen]);

  // Helper to get project card theme styles
  const getProjectCardStyles = (type: ThemeType) => {
    switch (type) {
        case ThemeType.CleanWhite:
            return 'bg-white border-gray-200 text-gray-900 shadow-sm hover:border-gray-300 hover:shadow-md';
        case ThemeType.ModernBlack:
            return 'bg-[#1a1a1a] border-[#333] text-white hover:bg-[#222] hover:border-[#444]';
        case ThemeType.ForestGlass:
            return 'bg-black/40 border-white/10 text-white backdrop-blur-md hover:bg-black/50 hover:border-white/20';
        case ThemeType.GradientBlue:
            return 'bg-blue-950/30 border-white/10 text-white backdrop-blur-md hover:bg-blue-900/40 hover:border-white/20';
        case ThemeType.SunsetVibe:
            return 'bg-rose-950/30 border-white/10 text-white backdrop-blur-md hover:bg-rose-900/40 hover:border-white/20';
        default:
             return 'bg-white/10 border-white/10 text-white backdrop-blur-md hover:bg-white/20';
    }
  };

  // Helper for Project Card Icon Container
  const getIconContainerStyles = (type: ThemeType) => {
      if (type === ThemeType.CleanWhite) return 'bg-indigo-50 text-indigo-600';
      if (type === ThemeType.ModernBlack) return 'bg-[#252525] text-white';
      return 'bg-white/10 text-white';
  };

  return (
    <ThemeWrapper theme={profile.theme}>
      <div className="min-h-screen w-full flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[600px] px-6 py-12 md:py-16 flex flex-col items-center animate-fade-in relative">
            
            {/* Top Bar Actions */}
            <div className="absolute top-6 right-6 z-20">
                <button 
                    onClick={handleShare}
                    className="p-2.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 backdrop-blur-md transition-all text-current opacity-80 hover:opacity-100"
                    aria-label="Share Profile"
                >
                    <Share2 className="w-4 h-4" />
                </button>
            </div>

            {/* Profile Header */}
            <header className="flex flex-col items-center mb-10 w-full z-10">
                <div className="relative mb-6">
                    <AvatarWithSkeleton 
                        src={profile.avatarUrl} 
                        alt={profile.displayName} 
                        fallbackChar={profile.displayName.charAt(0)} 
                    />
                </div>

                <div className="text-center space-y-2 max-w-sm w-full px-4">
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center justify-center gap-1.5 truncate">
                        {profile.displayName}
                        {profile.verified && (
                            <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/10 shrink-0" />
                        )}
                    </h1>
                    <p className="opacity-70 text-sm font-medium leading-relaxed break-words">
                        {profile.bio}
                    </p>
                </div>

                {/* Socials - Horizontal Strip */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    {profile.socials.map((social, idx) => (
                        <a
                            key={idx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                                group flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300
                                ${isLightTheme 
                                    ? 'bg-white border border-gray-200 text-gray-600 shadow-sm hover:shadow-md hover:text-black hover:border-gray-300' 
                                    : 'bg-white/10 border border-white/5 text-white/90 shadow-lg backdrop-blur-sm hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:text-white hover:border-white/20'}
                            `}
                            onClick={e => { if(disableNavigation) e.preventDefault(); }}
                        >
                            {getSocialIcon(social.platform, "w-5 h-5 transition-transform duration-300")}
                        </a>
                    ))}
                </div>
            </header>

            {/* Links Section */}
            <main className="w-full space-y-3 z-10">
                {profile.links.map((link, idx) => (
                    <LinkCard 
                        key={link.id} 
                        link={link} 
                        theme={profile.theme} 
                        index={idx}
                        disableNavigation={disableNavigation}
                    />
                ))}
            </main>

            {/* Projects Section - Clearly Separated */}
            {profile.projects && profile.projects.length > 0 && (
                <section className="w-full z-10 mt-10 px-1 relative animate-slide-up delay-100">
                    
                    {/* Visual Separator if needed, or just space */}
                    <div className="flex items-center gap-4 mb-4 opacity-50 px-2">
                        <div className={`h-px flex-1 ${isLightTheme ? 'bg-gray-300' : 'bg-white/20'}`}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isLightTheme ? 'text-gray-400' : 'text-white/40'}`}>Portfolio</span>
                        <div className={`h-px flex-1 ${isLightTheme ? 'bg-gray-300' : 'bg-white/20'}`}></div>
                    </div>

                    <div 
                        onClick={() => setIsProjectsOpen(true)}
                        className={`
                            cursor-pointer w-full group relative transition-all duration-300 ease-out active:scale-[0.98]
                            ${!projectCard.thumbnail ? 'hover:-translate-y-1' : ''}
                        `}
                    >
                        {projectCard.thumbnail ? (
                            // Hero Style Trigger (Image Background)
                            <div className="relative w-full aspect-[2.1/1] rounded-[1.5rem] overflow-hidden shadow-xl hover:shadow-2xl ring-1 ring-black/5">
                                <img 
                                    src={projectCard.thumbnail} 
                                    alt={projectCard.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                
                                <div className="absolute bottom-0 left-0 p-6 w-full text-left flex flex-col items-start gap-1">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 mb-2">
                                        <Layers className="w-3 h-3" /> Projects
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{projectCard.title}</h3>
                                    {projectCard.description && (
                                        <p className="text-white/80 text-xs md:text-sm font-medium line-clamp-1 max-w-[90%]">
                                            {projectCard.description}
                                        </p>
                                    )}
                                </div>

                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        ) : (
                            // Standard Style Trigger (Themed Card)
                            <div className={`
                                relative w-full p-1 rounded-[1.5rem] bg-gradient-to-br from-white/5 to-white/0
                            `}>
                                <div className={`
                                    relative w-full p-5 rounded-[1.3rem] flex items-center justify-between border transition-all duration-300
                                    ${getProjectCardStyles(profile.theme.type)}
                                `}>
                                    <div className="flex items-center gap-5 min-w-0">
                                        <div className={`
                                            w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden
                                            ${getIconContainerStyles(profile.theme.type)}
                                        `}>
                                            {projectCard.icon ? (
                                                getGenericIcon(projectCard.icon, "w-7 h-7")
                                            ) : (
                                                <Layers className="w-7 h-7 opacity-50" />
                                            )}
                                        </div>
                                        <div className="text-left min-w-0">
                                            <h3 className="font-bold text-lg leading-tight">
                                                {projectCard.title}
                                            </h3>
                                            {projectCard.description && (
                                                <p className="text-xs opacity-60 mt-1 truncate">
                                                    {projectCard.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1
                                        ${isLightTheme ? 'bg-gray-100 text-gray-400' : 'bg-white/10 text-white/70'}
                                    `}>
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Branding Footer */}
            <footer className="mt-auto py-8 text-center">
                <a href="/" className="inline-block px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-all">
                    BioLinker © {new Date().getFullYear()}
                </a>
            </footer>

        </div>
      </div>

      {/* Projects Slide Screen / Drawer */}
      {/* 
         The drawer is "fixed" but thanks to the parent container's transform (in PhoneMockup), 
         it will be contained within the phone screen in preview mode.
      */}
      <ProjectsDrawer 
        isOpen={isProjectsOpen} 
        onClose={() => setIsProjectsOpen(false)} 
        profile={profile} 
      />

    </ThemeWrapper>
  );
};

// --- Projects Drawer Component ---

interface ProjectsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    profile: UserProfile;
}

const ProjectsDrawer: React.FC<ProjectsDrawerProps> = ({ isOpen, onClose, profile }) => {
    const isLightTheme = profile?.theme?.type === ThemeType.CleanWhite;
    const projects = Array.isArray(profile?.projects) ? profile.projects : []; // Safety check
    const projectCard = profile?.projectCard || { title: 'Projects' };
    const themeType = profile?.theme?.type || ThemeType.ModernBlack;

    // Theme-specific Drawer Backgrounds
    const getDrawerBg = (type: ThemeType) => {
        switch (type) {
           case ThemeType.CleanWhite: return 'bg-white text-gray-900';
           case ThemeType.ModernBlack: return 'bg-[#121212] text-white';
           case ThemeType.GradientBlue: return 'bg-[#0f172a] text-white'; // Slate-900
           case ThemeType.SunsetVibe: return 'bg-[#2d1b1e] text-white'; // Dark Reddish
           case ThemeType.ForestGlass: return 'bg-[#0a2f1f] text-white'; // Dark Greenish
           default: return 'bg-[#121212] text-white';
       }
    };

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col justify-end transition-all duration-500 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose}
            />
            
            {/* Drawer Content */}
            <div className={`
                relative w-full h-[95%] rounded-t-[2.5rem] overflow-hidden flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform
                ${isOpen ? 'translate-y-0' : 'translate-y-full'}
                ${getDrawerBg(themeType)}
            `}>
                {/* Visual Drag Handle */}
                <div className="w-full flex justify-center pt-4 pb-2 flex-shrink-0 cursor-pointer" onClick={onClose}>
                    <div className={`w-12 h-1.5 rounded-full ${isLightTheme ? 'bg-gray-300' : 'bg-white/20'}`} />
                </div>

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between flex-shrink-0 border-b border-transparent">
                    <button 
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${isLightTheme ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-white/60'}`}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-lg font-bold opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        Portfolio
                    </h2>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-20 no-scrollbar">
                    <div className="max-w-[600px] mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{projectCard.title}</h1>
                            {projectCard.description && (
                                <p className={`opacity-60 text-lg ${isLightTheme ? 'text-gray-600' : 'text-white'}`}>
                                    {projectCard.description}
                                </p>
                            )}
                        </div>

                        <div className="space-y-12">
                            {projects.map((project, idx) => (
                                <div 
                                    key={project.id || idx} 
                                    className="w-full group animate-slide-up"
                                    style={{ animationDelay: `${0.1 + (idx * 0.1)}s`, animationFillMode: 'both' }}
                                >
                                    {/* Project Image */}
                                    {project.thumbnail && (
                                        <div className={`
                                            rounded-2xl overflow-hidden aspect-video w-full shadow-lg mb-5 flex items-center justify-center relative 
                                            ${isLightTheme ? 'bg-gray-100 border border-gray-200' : 'bg-white/5 border border-white/5'}
                                        `}>
                                            <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        </div>
                                    )}
                                    
                                    {/* Project Content */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-2">
                                                {/* Ensure tags is an array before mapping */}
                                                {Array.isArray(project.tags) && project.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.tags.map(tag => (
                                                            <span key={tag} className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md ${isLightTheme ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white/80'}`}>
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <h3 className="text-2xl font-bold leading-tight">{project.title}</h3>
                                            </div>
                                            {project.url && (
                                                <a 
                                                    href={project.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`
                                                        p-3 rounded-full shrink-0 transition-transform hover:scale-110 active:scale-95
                                                        ${isLightTheme ? 'bg-black text-white' : 'bg-white text-black'}
                                                    `}
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                        
                                        {project.description && (
                                            <p className={`text-base leading-relaxed ${isLightTheme ? 'text-gray-600' : 'text-gray-300'}`}>
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* Divider */}
                                    {idx < projects.length - 1 && (
                                        <div className={`h-px w-full mt-10 opacity-10 ${isLightTheme ? 'bg-black' : 'bg-white'}`} />
                                    )}
                                </div>
                            ))}
                            
                            {projects.length === 0 && (
                                <div className={`text-center py-12 border-2 border-dashed rounded-xl opacity-50 ${isLightTheme ? 'border-gray-300' : 'border-white/20'}`}>
                                    No projects to display yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---

const AvatarWithSkeleton: React.FC<{ src: string; alt: string; fallbackChar: string }> = ({ src, alt, fallbackChar }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/10 dark:ring-white/5 bg-gray-200 relative">
            {src ? (
                <>
                    <img 
                        src={src} 
                        alt={alt} 
                        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                    />
                    {isLoading && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-3xl font-bold">
                    {fallbackChar}
                </div>
            )}
        </div>
    );
};

// --- Profile Skeleton Component ---

const ProfileSkeleton: React.FC = () => {
    return (
      <div className="min-h-screen w-full flex justify-center bg-white">
        <div className="w-full max-w-[600px] px-6 py-12 md:py-16 flex flex-col items-center animate-pulse">
            
            {/* Header Section */}
            <div className="flex flex-col items-center mb-10 w-full relative">
                <div className="w-28 h-28 rounded-full bg-gray-200 mb-6 shadow-sm ring-4 ring-gray-50" />
                <div className="h-7 w-40 bg-gray-200 rounded-full mb-4" />
                <div className="space-y-2 w-full max-w-[250px] flex flex-col items-center mb-8">
                    <div className="h-2.5 w-full bg-gray-100 rounded-full" />
                    <div className="h-2.5 w-3/4 bg-gray-100 rounded-full" />
                </div>
                <div className="flex gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-11 h-11 rounded-full bg-gray-100" />
                    ))}
                </div>
            </div>

            {/* Links Section */}
            <div className="w-full space-y-4">
                <div className="w-full aspect-[2/1] rounded-2xl bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 space-y-3">
                         <div className="h-5 w-1/2 bg-gray-300 rounded-lg" />
                         <div className="h-3 w-3/4 bg-gray-300/50 rounded-lg" />
                    </div>
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-full h-[76px] rounded-[1.25rem] bg-gray-50 border border-gray-100 flex items-center px-4 justify-between">
                         <div className="flex items-center gap-4 w-full">
                            <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
                            <div className="flex-1 space-y-2.5">
                                <div className="h-3.5 w-1/3 bg-gray-200 rounded-full" />
                                <div className="h-2.5 w-1/4 bg-gray-100 rounded-full" />
                            </div>
                         </div>
                         <div className="w-5 h-5 rounded-full bg-gray-100 shrink-0" />
                    </div>
                ))}
            </div>

            {/* Projects Section Skeleton */}
             <div className="w-full mt-10">
                <div className="flex items-center gap-4 mb-6 px-4 opacity-50">
                    <div className="h-px bg-gray-200 flex-1" />
                    <div className="h-2 w-16 bg-gray-200 rounded-full" />
                    <div className="h-px bg-gray-200 flex-1" />
                </div>
                 <div className="w-full h-28 rounded-[1.3rem] bg-gray-50 border border-gray-100 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-gray-200" />
                          <div className="space-y-2.5">
                               <div className="h-4 w-32 bg-gray-200 rounded-full" />
                               <div className="h-2.5 w-20 bg-gray-100 rounded-full" />
                          </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-100" />
                 </div>
             </div>

        </div>
      </div>
    );
};

interface LinkCardProps {
  link: LinkItem;
  theme: UserProfile['theme'];
  index: number;
  disableNavigation?: boolean;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, theme, index, disableNavigation }) => {
  const animationStyle = { 
      animationDelay: `${0.1 + (index * 0.05)}s`,
      animationFillMode: 'both' 
  };

  if (link.featured) {
    return <FeaturedLinkItem link={link} theme={theme} style={animationStyle} disableNavigation={disableNavigation} />;
  }

  return <StandardLinkItem link={link} theme={theme} style={animationStyle} disableNavigation={disableNavigation} />;
};

const FeaturedLinkItem: React.FC<{ link: LinkItem; theme: UserProfile['theme']; style: React.CSSProperties; disableNavigation?: boolean }> = ({ link, theme, style, disableNavigation }) => {
  const classes = getButtonClasses(theme, true);
  
  return (
    <a 
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${classes} block group animate-slide-up transform-gpu overflow-hidden`}
      style={style}
      onClick={e => { if(disableNavigation) e.preventDefault(); }}
    >
        <div className="relative aspect-[2/1] md:aspect-[2.4/1] w-full">
          {link.thumbnail ? (
            <>
                <img 
                    src={link.thumbnail} 
                    alt={link.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
            </>
          ) : (
             <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="opacity-10 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
             </div>
          )}
          
          <div className="absolute bottom-0 left-0 w-full p-5 md:p-6 flex flex-row items-end justify-between">
            <div className="flex-1 mr-4 min-w-0">
                <h3 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-sm truncate">{link.title}</h3>
                {link.description && (
                <p className="text-white/80 text-xs md:text-sm line-clamp-2 font-medium drop-shadow-sm break-words">{link.description}</p>
                )}
            </div>
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 shrink-0">
                <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
    </a>
  );
};

const StandardLinkItem: React.FC<{ link: LinkItem; theme: UserProfile['theme']; style: React.CSSProperties; disableNavigation?: boolean }> = ({ link, theme, style, disableNavigation }) => {
  const classes = getButtonClasses(theme, false);
  const isCleanTheme = theme.type === ThemeType.CleanWhite;
  
  return (
    <a 
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${classes} animate-slide-up group py-3.5 px-4`}
      style={style}
      onClick={e => { if(disableNavigation) e.preventDefault(); }}
    >
        {/* Left Slot: Thumbnail or Icon */}
        <div className="flex items-center justify-center w-10 h-10 shrink-0 mr-3">
             {link.thumbnail ? (
                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm ring-1 ring-black/5">
                    <img src={link.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
             ) : link.icon ? (
                <div className={`transition-transform duration-300 group-hover:scale-110 ${isCleanTheme ? 'text-gray-700' : 'text-white/90'}`}>
                    {getGenericIcon(link.icon, "w-6 h-6")}
                </div>
            ) : null}
        </div>

        {/* Center Slot: Title */}
        <div className="flex-1 flex flex-col justify-center text-center sm:text-left min-w-0">
            <span className="font-semibold text-sm md:text-[15px] truncate px-1">
                {link.title}
            </span>
            {link.description && !link.thumbnail && (
                 <span className={`text-[11px] truncate px-1 opacity-70 ${isCleanTheme ? 'text-gray-500' : 'text-white'}`}>
                    {link.description}
                 </span>
            )}
        </div>
      
        {/* Right Slot: Action Icon */}
        <div className={`w-10 h-10 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 ${isCleanTheme ? 'text-gray-400' : 'text-white/50'}`}>
            <ChevronRight className="w-5 h-5" />
        </div>
    </a>
  );
};

export default ProfileView;