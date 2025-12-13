
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProfile } from '../services/dataService';
import { UserProfile, LinkItem, ThemeType, ProfileTheme, SectionConfig } from '../types';
import { ThemeWrapper, getCardClasses, getThemeClasses } from './ThemeWrapper';
import { getSocialIcon, getGenericIcon } from './Icons';
import { BadgeCheck, Share2, AlertCircle, ChevronRight, ExternalLink, Layers, X } from 'lucide-react';

interface ProfileViewProps {
    initialData?: UserProfile;
    disableNavigation?: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ initialData, disableNavigation }) => {
  const { username } = useParams<{ username: string }>();
  const [fetchedProfile, setFetchedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(false);
  
  // Track open section by ID to ensure updates from the editor reflect immediately
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Determine which profile data to use: prop (preview) or fetched (live)
  const rawProfile = initialData || fetchedProfile;

  // Helper to filter valid objects
  const validObjects = (arr: any) => Array.isArray(arr) ? arr.filter(i => i && typeof i === 'object') : [];

  // Robust default values
  const profile: UserProfile | null = rawProfile ? {
      ...rawProfile,
      theme: (rawProfile.theme && typeof rawProfile.theme === 'object') ? rawProfile.theme : { type: ThemeType.ModernBlack },
      socials: validObjects(rawProfile.socials),
      links: validObjects(rawProfile.links),
      sections: validObjects(rawProfile.sections)
  } : null;

  // Derive the active section object from the current profile state
  const activeSection = activeSectionId && profile?.sections 
      ? profile.sections.find(s => s.id === activeSectionId) || null 
      : null;

  useEffect(() => {
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
      // Fallback
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

  // Get Dynamic Styles
  const themeStyles = getThemeClasses(profile.theme);
  
  // Filter sections: Hide empty sections in LIVE mode, show ALL in PREVIEW mode
  const visibleSections = profile.sections 
      ? profile.sections.filter(s => {
          const hasItems = Array.isArray(s.items) && s.items.length > 0;
          return hasItems || disableNavigation;
      })
      : [];
  
  return (
    <>
      <ThemeWrapper theme={profile.theme} className={disableNavigation ? 'min-h-full' : 'min-h-screen'}>
        <div className="w-full flex justify-center min-h-[inherit]">
          {/* Main Content Container */}
          <div className="w-full max-w-2xl px-5 py-12 md:py-20 flex flex-col items-center animate-fade-in relative z-10">
              
              {/* Share Button (Floating Top Right) */}
              <div className="absolute top-4 right-4 md:right-0 md:top-8 z-20">
                  <button 
                      onClick={handleShare}
                      className={`
                          p-2.5 rounded-full backdrop-blur-xl transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-110
                          ${profile.theme.type === ThemeType.CleanWhite ? 'bg-black/5 hover:bg-black/10 text-black' : 'bg-white/10 hover:bg-white/20 text-white'}
                      `}
                      aria-label="Share Profile"
                  >
                      <Share2 className="w-5 h-5" />
                  </button>
              </div>

              {/* --- Profile Header --- */}
              <header className="flex flex-col items-center mb-10 w-full">
                  {/* Avatar */}
                  <div className="relative mb-6 group cursor-pointer">
                      <AvatarWithSkeleton 
                          src={profile.avatarUrl} 
                          alt={profile.displayName} 
                          fallbackChar={(profile.displayName || '?').charAt(0)} 
                          className={`w-28 h-28 md:w-32 md:h-32 object-cover relative z-10 ${themeStyles.avatarClass}`}
                      />
                  </div>

                  {/* Name & Bio */}
                  <div className="text-center space-y-3 max-w-md w-full px-2">
                      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
                          {profile.displayName || profile.username}
                          {profile.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                      </h1>
                      {profile.bio && (
                           <p className="text-sm md:text-base font-medium leading-relaxed opacity-80 whitespace-pre-wrap">
                              {profile.bio}
                          </p>
                      )}
                  </div>

                  {/* Social Icons Row */}
                  {profile.socials.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-3 mt-6">
                          {profile.socials.map((social, idx) => (
                              <a
                                  key={idx}
                                  href={social.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`
                                      group flex items-center justify-center w-10 h-10 transition-all duration-300 transform hover:-translate-y-1
                                      ${themeStyles.socialClass}
                                  `}
                                  onClick={e => { if(disableNavigation) e.preventDefault(); }}
                              >
                                  {getSocialIcon(social.platform, "w-5 h-5")}
                              </a>
                          ))}
                      </div>
                  )}
              </header>

              {/* --- Links & Content --- */}
              <main className="w-full max-w-[600px] space-y-4 z-10 pb-10">
                  {/* Links */}
                  {profile.links.map((link, idx) => (
                      <LinkCard 
                          key={link.id || idx} 
                          link={link} 
                          theme={profile.theme} 
                          index={idx}
                          disableNavigation={disableNavigation}
                      />
                  ))}

                  {/* Sections / Projects Triggers */}
                  {visibleSections.length > 0 && (
                      <div className="pt-6 animate-slide-up space-y-4" style={{ animationDelay: '0.2s' }}>
                          <div className={`flex items-center gap-4 mb-2 opacity-40 px-2`}>
                              <div className={`h-px flex-1 bg-current`}></div>
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Collections</span>
                              <div className={`h-px flex-1 bg-current`}></div>
                          </div>

                          {visibleSections.map((section, sIdx) => {
                              // Ensure we have a valid key, fallback to index if id is missing during creation
                              const key = section.id || `section-${sIdx}`;
                              
                              return (
                                  <button 
                                      key={key}
                                      onClick={() => setActiveSectionId(section.id)}
                                      className="w-full outline-none focus:outline-none text-left"
                                  >
                                       {section.thumbnail ? (
                                          // Hero Image Trigger
                                          <div className={`w-full aspect-[2/1] relative overflow-hidden shadow-2xl group cursor-pointer ring-1 ring-black/5 ${themeStyles.cardBase.split('p-4')[0]} p-0 ${themeStyles.cardColors}`}>
                                              <img 
                                                  src={section.thumbnail} 
                                                  alt={section.title} 
                                                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                                              />
                                              <div className={`absolute inset-0 bg-gradient-to-t ${themeStyles.featuredCardOverlay}`} />
                                              
                                              <div className="absolute bottom-0 left-0 p-6 text-left w-full z-10">
                                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 mb-2">
                                                      <Layers className="w-3 h-3" /> Section
                                                  </div>
                                                  <h3 className="text-xl font-bold text-white mb-1">{section.title}</h3>
                                                  <div className="flex items-center justify-between">
                                                      <p className="text-white/80 text-xs font-medium line-clamp-1">{section.description}</p>
                                                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                                                          <ChevronRight className="w-4 h-4" />
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      ) : (
                                          // Styled Card Trigger
                                          <div className={`
                                              group w-full ${themeStyles.cardBase} ${themeStyles.cardColors} ${themeStyles.cardHover}
                                          `}>
                                              <div className="flex items-center gap-4">
                                                  <div className={`
                                                      w-12 h-12 flex items-center justify-center shrink-0 opacity-80
                                                      ${themeStyles.avatarClass.includes('rounded-full') ? 'rounded-full' : 'rounded-lg'}
                                                      border border-current
                                                  `}>
                                                      {section.icon ? getGenericIcon(section.icon, "w-6 h-6") : <Layers className="w-6 h-6" />}
                                                  </div>
                                                  <div className="text-left flex-1">
                                                      <h3 className="font-bold text-lg">{section.title}</h3>
                                                      {section.description && (
                                                          <p className="text-xs opacity-70">{section.description}</p>
                                                      )}
                                                  </div>
                                              </div>
                                              <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                                  <ChevronRight className="w-5 h-5" />
                                              </div>
                                          </div>
                                      )}
                                  </button>
                              );
                          })}
                      </div>
                  )}
              </main>

              {/* Footer */}
              <footer className="mt-auto py-6 text-center z-10">
                  <a href="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors opacity-50 hover:opacity-100 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10">
                      BioLinker On-Chain
                  </a>
              </footer>

          </div>
        </div>
      </ThemeWrapper>

      {/* Dynamic Projects Drawer for Active Section */}
      <ProjectsDrawer 
        isOpen={activeSection !== null} 
        onClose={() => setActiveSectionId(null)} 
        section={activeSection}
        themeStyles={themeStyles}
      />
    </>
  );
};

// --- Sub Components ---

const LinkCard: React.FC<{ link: LinkItem; theme: ProfileTheme; index: number; disableNavigation?: boolean }> = ({ link, theme, index, disableNavigation }) => {
    const themeStyles = getThemeClasses(theme);
    const cardClasses = getCardClasses(theme, link.featured);
    
    return (
        <a 
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardClasses} animate-slide-up`}
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
            onClick={e => { if(disableNavigation) e.preventDefault(); }}
        >
            {link.featured ? (
                <>
                   {/* Featured Layout (Big Card) */}
                   <div className="w-full aspect-[2/1] relative">
                        {link.thumbnail ? (
                             <img src={link.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                             <div className="w-full h-full flex items-center justify-center opacity-50">
                                 {getGenericIcon(link.icon, "w-12 h-12")}
                             </div>
                        )}
                        <div className={`absolute inset-0 bg-gradient-to-t ${themeStyles.featuredCardOverlay}`} />
                        <div className="absolute bottom-0 left-0 p-5 w-full z-10 text-white">
                            <h3 className="text-lg font-bold mb-0.5">{link.title}</h3>
                            {link.description && <p className="text-xs opacity-80 line-clamp-1">{link.description}</p>}
                        </div>
                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4" />
                        </div>
                   </div>
                </>
            ) : (
                <>
                   {/* Standard Layout (Row) */}
                   <div className="flex items-center gap-4 min-w-0">
                       <div className={`
                          w-10 h-10 flex items-center justify-center transition-colors shrink-0 opacity-80 overflow-hidden
                          ${themeStyles.avatarClass.includes('rounded-full') ? 'rounded-full' : 'rounded-lg'}
                       `}>
                           {/* Render Thumbnail Image if available, else Icon */}
                           {link.thumbnail ? (
                               <img src={link.thumbnail} alt="" className="w-full h-full object-cover" />
                           ) : (
                               getGenericIcon(link.icon)
                           )}
                       </div>
                       <span className="font-semibold text-sm md:text-base pr-2 truncate">{link.title}</span>
                   </div>
                   <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                       <ChevronRight className="w-5 h-5 opacity-50" />
                   </div>
                </>
            )}
        </a>
    );
};

const AvatarWithSkeleton: React.FC<{ src: string; alt: string; fallbackChar: string; className?: string }> = ({ src, alt, fallbackChar, className }) => {
    const [loaded, setLoaded] = useState(false);
    const [err, setErr] = useState(false);

    return (
        <div className={`overflow-hidden bg-gray-200 ${className}`}>
             {!loaded && !err && (
                 <div className="absolute inset-0 bg-gray-200 animate-pulse" />
             )}
             {src && !err ? (
                 <img 
                    src={src} 
                    alt={alt} 
                    className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setLoaded(true)}
                    onError={() => setErr(true)}
                 />
             ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-3xl">
                     {fallbackChar.toUpperCase()}
                 </div>
             )}
        </div>
    );
};

const ProfileSkeleton = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="w-full max-w-md p-6 space-y-8 flex flex-col items-center">
             <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
             <div className="space-y-3 w-full flex flex-col items-center">
                 <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                 <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
             </div>
             <div className="w-full space-y-4 pt-4">
                 {[1,2,3].map(i => (
                     <div key={i} className="h-16 w-full bg-gray-200 rounded-2xl animate-pulse"></div>
                 ))}
             </div>
         </div>
    </div>
);

// --- Projects Drawer Component ---

interface ProjectsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    section: SectionConfig | null;
    themeStyles: any;
}

const ProjectsDrawer: React.FC<ProjectsDrawerProps> = ({ isOpen, onClose, section, themeStyles }) => {
    // Dynamically get projects from props to ensure live updates from editor
    const projects = section ? Array.isArray(section.items) ? section.items.filter(p => p && typeof p === 'object') : [] : [];
    
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!section) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col justify-end transition-all duration-500 font-sans ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose}
            />
            
            {/* Drawer Sheet */}
            <div className={`
                relative w-full h-[92%] max-h-[92%] rounded-t-[2.5rem] overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.3)] 
                transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform
                ${isOpen ? 'translate-y-0' : 'translate-y-full'}
                ${themeStyles.bgClass} ${themeStyles.textClass}
            `}>
                
                {/* Drawer Header */}
                <div className="px-6 py-5 flex items-center justify-between shrink-0 border-b border-gray-200/10">
                   <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-xl opacity-80 ${themeStyles.avatarClass.includes('rounded-full') ? 'rounded-full' : 'rounded-lg'} bg-white/10`}>
                           {section.icon ? getGenericIcon(section.icon, "w-5 h-5") : <Layers className="w-5 h-5"/>}
                       </div>
                       <div>
                           <h2 className="text-lg font-bold leading-tight">
                               {section.title}
                           </h2>
                           <p className="text-xs opacity-60">
                               {projects.length} Items
                           </p>
                       </div>
                   </div>
                   <button 
                       onClick={onClose}
                       className="p-2 rounded-full transition-colors hover:bg-white/10 opacity-70 hover:opacity-100"
                   >
                       <X className="w-6 h-6" />
                   </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                    {projects.map((project, idx) => (
                        <div key={idx} className={`rounded-2xl overflow-hidden shadow-sm border border-white/5 ${themeStyles.cardColors}`}>
                            {project.thumbnail && (
                                <div className="aspect-video w-full overflow-hidden relative group">
                                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div>
                                         {project.tags && project.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {project.tags.map((tag, tIdx) => (
                                                    <span key={tIdx} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/10 opacity-80">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                         )}
                                         <h3 className="text-xl font-bold">{project.title}</h3>
                                    </div>
                                    {project.url && (
                                        <a 
                                            href={project.url}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full shrink-0 bg-white/10 hover:bg-white/20"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                                {project.description && (
                                    <p className="text-sm leading-relaxed opacity-70">
                                        {project.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {projects.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                            <Layers className="w-12 h-12 mb-4 opacity-50" />
                            <p>No items in this section.</p>
                        </div>
                    )}
                    
                    {/* Padding bottom for safety */}
                    <div className="h-10"></div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
