import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProfile } from '../services/dataService';
import { UserProfile, LinkItem, ThemeType, SectionConfig, ProfileTheme } from '../types';
import { ThemeWrapper, getCardClasses, getThemeClasses } from './ThemeWrapper';
import { getSocialIcon, getGenericIcon } from './Icons';
import { BadgeCheck, Share2, AlertCircle, ChevronRight, ExternalLink, Layers, X } from 'lucide-react';
import { Footer } from './Footer';
import { ProfileMenu } from './ProfileMenu';

interface ProfileViewProps {
    initialData?: UserProfile;
    disableNavigation?: boolean;
    isPreview?: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ initialData, disableNavigation, isPreview }) => {
  const { username } = useParams<{ username: string }>();
  const [fetchedProfile, setFetchedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const rawProfile = initialData || fetchedProfile;
  const validObjects = (arr: any) => Array.isArray(arr) ? arr.filter(i => i && typeof i === 'object') : [];
  const profile: UserProfile | null = rawProfile ? {
      ...rawProfile,
      theme: (rawProfile.theme && typeof rawProfile.theme === 'object') ? rawProfile.theme : { type: ThemeType.ModernBlack },
      socials: validObjects(rawProfile.socials),
      links: validObjects(rawProfile.links),
      sections: validObjects(rawProfile.sections)
  } : null;

  const activeSection = activeSectionId && profile?.sections 
      ? profile.sections.find(s => s.id === activeSectionId) || null 
      : null;

  useEffect(() => {
    if (username && !initialData) {
      setLoading(true);
      const timer = setTimeout(() => {
          fetchProfile(username)
            .then((data) => {
              if (data) setFetchedProfile(data);
              else setError(true);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
      }, 800);
      return () => clearTimeout(timer);
    } else if (initialData) {
        setLoading(false);
    }
  }, [username, initialData]);

  const handlePreviewAction = (e: React.MouseEvent) => {
    if (isPreview) {
        e.preventDefault();
        e.stopPropagation();
        alert("Action disabled: This is a demo preview.");
        return true;
    }
    return false;
  };

  const handleShare = async (e: React.MouseEvent) => {
    if (handlePreviewAction(e)) return;
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
    } catch (err) {}
  };

  if (loading && !profile) return <ProfileSkeleton />;

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6"><AlertCircle className="w-8 h-8 text-red-500" /></div>
        <h1 className="text-xl font-semibold text-gray-900">Profile Not Found</h1>
        <a href="/" className="mt-8 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all">Back to Home</a>
      </div>
    );
  }

  const themeStyles = getThemeClasses(profile.theme);
  const LIGHT_THEMES = [ThemeType.Base, ThemeType.BaseSoft, ThemeType.CleanWhite, ThemeType.MinimalistGrey, ThemeType.SoftPastel, ThemeType.Newspaper, ThemeType.MintFresh, ThemeType.SketchyNote, ThemeType.NeoBrutalism, ThemeType.VintagePaper, ThemeType.NordicFrost, ThemeType.IslandParadise];
  const isLightTheme = LIGHT_THEMES.includes(profile.theme.type);
  const visibleSections = profile.sections ? profile.sections.filter(s => (Array.isArray(s.items) && s.items.length > 0) || disableNavigation) : [];
  
  return (
    <>
      <ThemeWrapper theme={profile.theme} className={disableNavigation ? 'min-h-full' : 'min-h-screen'}>
        <div className="w-full flex flex-col items-center min-h-[inherit]">
          <div className="w-full max-w-2xl px-5 py-12 md:py-20 flex flex-col items-center animate-fade-in relative z-10 flex-1">
              <div className="absolute top-4 left-4 md:left-0 md:top-8 z-30"><ProfileMenu isLightTheme={isLightTheme} username={profile.username} ownerWallet={profile.ownerWallet} isPreview={isPreview} /></div>
              <div className="absolute top-4 right-4 md:right-0 md:top-8 z-20"><button onClick={handleShare} className={`p-2.5 rounded-full backdrop-blur-xl transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-110 ${isLightTheme ? 'bg-black/5 hover:bg-black/10 text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}><Share2 className="w-5 h-5" /></button></div>
              <header className="flex flex-col items-center mb-10 w-full">
                  <div className="relative mb-6 group cursor-pointer"><AvatarWithSkeleton src={profile.avatarUrl} alt={profile.displayName} fallbackChar={(profile.displayName || '?').charAt(0)} className={`w-28 h-28 md:w-32 md:h-32 relative z-10 ${themeStyles.avatarClass}`} /></div>
                  <div className="text-center space-y-3 max-w-md w-full px-2"><h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">{profile.displayName || profile.username}{profile.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}</h1>{profile.bio && (<p className="text-sm md:text-base font-medium leading-relaxed opacity-80 whitespace-pre-wrap">{profile.bio}</p>)}</div>
                  {profile.socials.length > 0 && (<div className="flex flex-wrap justify-center gap-3 mt-6">{profile.socials.map((social, idx) => (<a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className={`group flex items-center justify-center w-10 h-10 transition-all duration-300 transform hover:-translate-y-1 ${themeStyles.socialClass}`} onClick={handlePreviewAction}>{getSocialIcon(social.platform, "w-5 h-5")}</a>))}</div>)}
              </header>
              <main className="w-full max-w-[600px] space-y-4 z-10 pb-10">
                  {profile.links.map((link, idx) => (<LinkCard key={link.id || idx} link={link} theme={profile.theme} index={idx} disableNavigation={disableNavigation || isPreview} onPreviewClick={handlePreviewAction} />))}
                  {visibleSections.length > 0 && (
                      <div className="pt-6 animate-slide-up space-y-4" style={{ animationDelay: '0.2s' }}>
                          <div className={`flex items-center gap-4 mb-2 opacity-40 px-2`}><div className={`h-px flex-1 bg-current`}></div><span className="text-[10px] font-bold uppercase tracking-[0.2em]">Collections</span><div className={`h-px flex-1 bg-current`}></div></div>
                          {visibleSections.map((section, sIdx) => {
                              const key = section.id || `section-${sIdx}`;
                              return (
                                  <button key={key} onClick={() => setActiveSectionId(section.id)} className="w-full outline-none focus:outline-none text-left">
                                       {section.thumbnail ? (
                                          <div className={`w-full aspect-[2/1] relative overflow-hidden shadow-2xl group cursor-pointer ring-1 ring-black/5 ${themeStyles.cardBase.split('p-4')[0]} p-0 ${themeStyles.cardColors}`}><ImageWithSkeleton src={section.thumbnail} alt={section.title} className="w-full h-full absolute inset-0" imgClassName="object-cover transition-transform duration-700 ease-out" /><div className={`absolute inset-0 bg-gradient-to-t ${themeStyles.featuredCardOverlay} pointer-events-none`} /><div className="absolute bottom-0 left-0 p-6 text-left w-full z-10"><div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 mb-2"><Layers className="w-3 h-3" /> Section</div><h3 className="text-xl font-bold text-white mb-1">{section.title}</h3><div className="flex items-center justify-between"><p className="text-white/80 text-xs font-medium line-clamp-1">{section.description}</p><div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all"><ChevronRight className="w-4 h-4" /></div></div></div></div>
                                      ) : (
                                          <div className={`group w-full ${themeStyles.cardBase} ${themeStyles.cardColors} ${themeStyles.cardHover}`}><div className="flex items-center gap-4"><div className={`w-12 h-12 flex items-center justify-center shrink-0 opacity-80 ${themeStyles.avatarClass.includes('rounded-full') ? 'rounded-full' : 'rounded-lg'} border border-current`}>{section.icon ? getGenericIcon(section.icon, "w-6 h-6") : <Layers className="w-6 h-6" />}</div><div className="text-left flex-1"><h3 className="font-bold text-lg">{section.title}</h3>{section.description && (<p className="text-xs opacity-70">{section.description}</p>)}</div></div><div className="opacity-50 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-5 h-5" /></div></div>
                                      )}
                                  </button>
                              );
                          })}
                      </div>
                  )}
              </main>
              {disableNavigation && (<footer className="mt-auto py-6 text-center z-10"><a href="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors opacity-50 hover:opacity-100 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10">BioLinker On-Chain</a></footer>)}
          </div>
          {!disableNavigation && <Footer className="relative z-20 border-t-0" />}
        </div>
      </ThemeWrapper>
      <ProjectsDrawer isOpen={activeSection !== null} onClose={() => setActiveSectionId(null)} section={activeSection} themeStyles={themeStyles} isPreview={isPreview} handlePreviewAction={handlePreviewAction} />
    </>
  );
};

const LinkCard: React.FC<{ link: LinkItem; theme: ProfileTheme; index: number; disableNavigation?: boolean; onPreviewClick?: (e: React.MouseEvent) => void }> = ({ link, theme, index, disableNavigation, onPreviewClick }) => {
    const themeStyles = getThemeClasses(theme);
    const cardClasses = getCardClasses(theme, link.featured);
    const thumbShape = 'rounded-2xl';

    return (
        <a 
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardClasses} animate-slide-up`}
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
            onClick={onPreviewClick}
        >
            {link.featured ? (
                <>
                   <div className="w-full aspect-[2/1] relative bg-gray-100">
                        <ImageWithSkeleton src={link.thumbnail} className="w-full h-full" imgClassName="object-cover" fallback={<div className="opacity-50 flex items-center justify-center w-full h-full text-gray-400">{getGenericIcon(link.icon, "w-12 h-12")}</div>} /><div className={`absolute inset-0 bg-gradient-to-t ${themeStyles.featuredCardOverlay} pointer-events-none`} /><div className="absolute bottom-0 left-0 p-5 w-full z-10 text-white pointer-events-none"><h3 className="text-lg font-bold mb-0.5">{link.title}</h3>{link.description && <p className="text-xs opacity-80 line-clamp-1">{link.description}</p>}</div>
                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            {getGenericIcon(themeStyles.actionIcon, "w-4 h-4")}
                        </div>
                   </div>
                </>
            ) : (
                <>
                   <div className="flex items-center gap-4 min-w-0">
                       <ImageWithSkeleton src={link.thumbnail} className={`w-10 h-10 shrink-0 opacity-80 overflow-hidden ${thumbShape}`} fallback={getGenericIcon(link.icon)} />
                       <span className="font-semibold text-sm md:text-base pr-2 truncate">{link.title}</span>
                   </div>
                   <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                       {getGenericIcon(themeStyles.actionIcon, "w-5 h-5 opacity-50")}
                   </div>
                </>
            )}
        </a>
    );
};

const ShimmerOverlay = () => (<div className="absolute inset-0 z-20"><div className="absolute inset-0 bg-gray-200/50" /><div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" /></div>);
const ImageWithSkeleton: React.FC<{src?: string; alt?: string; className?: string; imgClassName?: string; fallback?: React.ReactNode;}> = ({ src, alt, className, imgClassName, fallback }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => { setLoaded(false); setError(false); }, [src]);
    if (!src || error) return (<div className={`flex items-center justify-center bg-black/5 ${className}`}>{fallback}</div>);
    return (<div className={`relative overflow-hidden bg-black/5 ${className}`}>{!loaded && <ShimmerOverlay />}<img key={src} src={src} alt={alt || ''} className={`w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`} onLoad={() => setLoaded(true)} onError={() => setError(true)} /></div>);
};
const AvatarWithSkeleton: React.FC<{ src: string; alt: string; fallbackChar: string; className?: string }> = ({ src, alt, fallbackChar, className }) => {
    const [loaded, setLoaded] = useState(false);
    const [err, setErr] = useState(false);
    useEffect(() => { setLoaded(false); setErr(false); }, [src]);
    return (<div className={`overflow-hidden bg-gray-200 relative ${className}`}>{src && !loaded && !err && <ShimmerOverlay />}{src && !err ? (<img key={src} src={src} alt={alt} className={`w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'} relative z-10`} onLoad={() => setLoaded(true)} onError={() => setErr(true)} />) : (<div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-3xl relative z-10">{fallbackChar.toUpperCase()}</div>)}</div>);
};
const ProfileSkeleton = () => (<div className="min-h-screen bg-white flex justify-center"><div className="w-full max-w-2xl px-5 py-12 md:py-20 flex flex-col items-center"><div className="relative w-32 h-32 mb-8 rounded-full overflow-hidden shadow-sm"><ShimmerOverlay /></div><div className="w-full flex flex-col items-center space-y-4 mb-10"><div className="h-8 w-48 rounded-xl relative overflow-hidden"><ShimmerOverlay /></div><div className="h-4 w-64 rounded-lg relative overflow-hidden"><ShimmerOverlay /></div></div><div className="flex gap-4 mb-12">{[1,2,3,4].map(i => (<div key={i} className="w-10 h-10 rounded-full relative overflow-hidden"><ShimmerOverlay /></div>))}</div><div className="w-full max-w-[600px] space-y-4">{[1,2,3].map(i => (<div key={i} className="w-full h-20 rounded-2xl relative overflow-hidden shadow-sm"><ShimmerOverlay /></div>))}<div className="w-full aspect-[2/1] rounded-2xl relative overflow-hidden mt-2 shadow-sm"><ShimmerOverlay /></div></div></div></div>);

interface ProjectsDrawerProps { isOpen: boolean; onClose: () => void; section: SectionConfig | null; themeStyles: any; isPreview?: boolean; handlePreviewAction: (e: React.MouseEvent) => boolean; }
const ProjectsDrawer: React.FC<ProjectsDrawerProps> = ({ isOpen, onClose, section, themeStyles, isPreview, handlePreviewAction }) => {
    const projects = section ? Array.isArray(section.items) ? section.items.filter(p => p && typeof p === 'object') : [] : [];
    const cardRadius = themeStyles.cardBase.split(' ').filter((c: string) => c.startsWith('rounded')).join(' ') || 'rounded-xl';
    useEffect(() => { if (isOpen) document.body.style.overflow = 'hidden'; else document.body.style.overflow = ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);
    if (!section) return null;
    const desktopClasses = !isPreview ? 'md:w-[600px] md:h-[85%] md:max-h-[850px] md:mx-auto md:rounded-[2.5rem] md:mb-8' : '';
    return (
        <div className={`fixed inset-0 z-[100] flex flex-col justify-end transition-all duration-500 font-sans ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
            <div className={`relative w-full h-[92%] max-h-[92%] ${desktopClasses} rounded-t-[2.5rem] overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${isOpen ? 'translate-y-0' : 'translate-y-[120%]'} ${themeStyles.bgClass} ${themeStyles.textClass}`}>
                <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer z-10 relative" onClick={onClose}><div className="w-12 h-1.5 bg-current opacity-20 rounded-full"></div></div>
                <div className="px-6 py-4 flex items-center justify-between shrink-0 border-b border-gray-200/10"><div className="flex items-center gap-3"><div className={`p-2 rounded-xl opacity-80 ${themeStyles.avatarClass.includes('rounded-full') ? 'rounded-full' : 'rounded-lg'} bg-white/10`}>{section.icon ? getGenericIcon(section.icon, "w-5 h-5") : <Layers className="w-5 h-5"/>}</div><div><h2 className="text-lg font-bold leading-tight">{section.title}</h2><p className="text-xs opacity-60">{projects.length} Items</p></div></div><button onClick={onClose} className="p-2 rounded-full transition-colors hover:bg-white/10 opacity-70 hover:opacity-100"><X className="w-6 h-6" /></button></div>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                    {projects.map((project, idx) => {
                        const hasImage = !!project.thumbnail;
                        const hasTags = project.tags && project.tags.length > 0;
                        return (
                            <div key={idx} className={`relative overflow-hidden ${cardRadius} border border-white/5 ${hasImage ? 'aspect-video' : `p-6 ${themeStyles.cardColors}`}`}>
                                {hasImage ? (
                                    <><ImageWithSkeleton src={project.thumbnail} className="absolute inset-0 w-full h-full" imgClassName="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" /><div className="absolute inset-0 flex flex-col justify-end p-5 text-white">{hasTags && (<div className="absolute top-4 left-4 flex flex-wrap gap-1.5 pointer-events-none">{project.tags?.map((tag, tIdx) => (<span key={tIdx} className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-wider text-white/90">{tag}</span>))}</div>)}{project.url && (<a href={project.url} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors" onClick={handlePreviewAction}><ExternalLink className="w-4 h-4" /></a>)}<div className="space-y-1"><h3 className="text-xl md:text-2xl font-bold leading-tight drop-shadow-sm pr-2">{project.title}</h3>{project.description && (<p className="text-sm md:text-base text-white/80 line-clamp-2 leading-relaxed max-w-[95%]">{project.description}</p>)}</div></div></>
                                ) : (
                                    <div className="relative flex flex-col gap-3">{project.url && (<a href={project.url} target="_blank" rel="noopener noreferrer" className="absolute -top-2 -right-2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors" onClick={handlePreviewAction}><ExternalLink className="w-4 h-4 opacity-50 hover:opacity-100" /></a>)}{hasTags && (<div className="flex flex-wrap gap-1.5 pr-8">{project.tags?.map((tag, tIdx) => (<span key={tIdx} className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[9px] font-bold uppercase tracking-wider opacity-70">{tag}</span>))}</div>)}<div className={!hasTags ? "mt-1" : ""}><h3 className="text-lg font-bold leading-tight pr-8">{project.title}</h3>{project.description && (<p className="text-sm opacity-70 mt-1 leading-relaxed">{project.description}</p>)}</div></div>
                                )}
                            </div>
                        );
                    })}
                    {projects.length === 0 && (<div className="flex flex-col items-center justify-center py-20 text-center opacity-50"><Layers className="w-12 h-12 mb-4 opacity-50" /><p>No items in this section.</p></div>)}
                    <div className="h-10"></div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;