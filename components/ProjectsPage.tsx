
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchProfile } from '../services/dataService';
import { UserProfile, ThemeType, SectionConfig, SectionItem } from '../types';
import { ThemeWrapper, getThemeClasses } from './ThemeWrapper';
import { ExternalLink, ArrowLeft, AlertCircle } from 'lucide-react';

const ProjectsPage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (username) {
            setLoading(true);
            fetchProfile(username)
                .then(setProfile)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [username]);

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-indigo-600 animate-spin"></div></div>;
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
                <h1 className="text-xl font-bold">Profile not found</h1>
                <Link to="/" className="mt-4 text-indigo-600 hover:underline">Go Home</Link>
            </div>
        );
    }

    const isLightTheme = profile.theme.type === ThemeType.CleanWhite;

    // Use first section as fallback for legacy Projects page
    const mainSection: SectionConfig = profile.sections && profile.sections.length > 0
        ? profile.sections[0]
        : { id: 'default', title: 'Projects', description: '', items: [] };

    const projects: SectionItem[] = mainSection.items || [];
    const projectCard = mainSection;

    // Extract dynamic styles
    const themeStyles = getThemeClasses(profile.theme);

    // Extract border radius by filtering all rounded classes from the base string
    // FIX: Updated logic to capture all rounded classes correctly
    const cardRadius = themeStyles.cardBase.split(' ').filter((c: string) => c.startsWith('rounded')).join(' ') || 'rounded-xl';

    return (
        <ThemeWrapper theme={profile.theme}>
            <div className="min-h-screen w-full flex justify-center overflow-x-hidden">
                <div className="w-full max-w-5xl px-6 py-8 md:py-12 flex flex-col items-center animate-fade-in relative min-h-screen">

                    {/* Header Navigation */}
                    <div className="w-full flex items-center justify-between mb-8 z-20">
                        <Link
                            href={`/${username}`}
                            className={`
                            p-2.5 rounded-full backdrop-blur-md transition-all flex items-center gap-2 group
                            ${isLightTheme ? 'bg-white/80 text-gray-800 hover:bg-white' : 'bg-white/10 text-white hover:bg-white/20'}
                        `}
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold pr-1">Back</span>
                        </Link>

                        <div className="flex items-center gap-3 opacity-90">
                            {profile.avatarUrl && (
                                <img src={profile.avatarUrl} alt="" className="w-8 h-8 rounded-full border-2 border-white/20 object-cover object-center" />
                            )}
                            <span className={`font-bold text-sm ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
                                {profile.displayName}
                            </span>
                        </div>
                    </div>

                    {/* Page Title */}
                    <div className="w-full text-center md:text-left mb-10 animate-slide-up">
                        <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
                            {projectCard.title || 'Portfolio'}
                        </h1>
                        {projectCard.description && (
                            <p className={`mt-3 text-lg ${isLightTheme ? 'text-gray-500' : 'text-white/60'}`}>
                                {projectCard.description}
                            </p>
                        )}
                    </div>

                    {/* Projects Grid */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                        {projects.map((project, idx) => {
                            const hasImage = !!project.thumbnail;
                            const hasTags = project.tags && project.tags.length > 0;

                            return (
                                <div
                                    key={project.id || idx}
                                    className={`
                                    w-full group animate-slide-up relative ${cardRadius} overflow-hidden shadow-lg transition-all duration-300
                                    ${hasImage ? 'aspect-[4/3]' : 'h-auto bg-gray-900/40 backdrop-blur-md border border-white/10'}
                                `}
                                    style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}
                                >
                                    {/* Background Image or Fallback */}
                                    {hasImage ? (
                                        <>
                                            <img
                                                src={project.thumbnail}
                                                alt={project.title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                                            {/* Content Overlay */}
                                            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">

                                                {hasTags && (
                                                    <div className="absolute top-6 left-6 flex flex-wrap gap-2 pointer-events-none">
                                                        {project.tags?.map(tag => (
                                                            <span key={tag} className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/90">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {project.url && (
                                                    <a
                                                        href={project.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all hover:scale-110"
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </a>
                                                )}

                                                {/* Text Content */}
                                                <div>
                                                    <h3 className="text-2xl font-bold leading-tight mb-2 text-shadow-sm">{project.title}</h3>
                                                    {project.description && (
                                                        <p className="text-base text-white/80 line-clamp-2 leading-relaxed max-w-[95%]">
                                                            {project.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        /* Compact No-Image Layout */
                                        <div className="p-8 relative flex flex-col gap-4">

                                            {/* Absolute Link */}
                                            {project.url && (
                                                <a
                                                    href={project.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`absolute top-6 right-6 p-3 rounded-full transition-all ${isLightTheme ? 'bg-black/5 hover:bg-black/10' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}

                                            {hasTags && (
                                                <div className="flex flex-wrap gap-2 pr-12">
                                                    {project.tags?.map(tag => (
                                                        <span key={tag} className="px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/70">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className={!hasTags ? "mt-2" : ""}>
                                                <h3 className={`text-2xl font-bold leading-tight mb-2 pr-12 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{project.title}</h3>
                                                {project.description && (
                                                    <p className={`text-base leading-relaxed ${isLightTheme ? 'text-gray-600' : 'text-white/70'}`}>
                                                        {project.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {projects.length === 0 && (
                            <div className={`col-span-full text-center py-20 border-2 border-dashed rounded-3xl opacity-50 ${isLightTheme ? 'border-gray-300' : 'border-white/20'}`}>
                                <p className="text-lg font-medium">No projects to display yet.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </ThemeWrapper>
    );
};

export default ProjectsPage;
