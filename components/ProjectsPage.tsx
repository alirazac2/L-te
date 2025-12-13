import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProfile } from '../services/dataService';
import { UserProfile, ThemeType } from '../types';
import { ThemeWrapper } from './ThemeWrapper';
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
  const projects = profile.projects || [];
  const projectCard = profile.projectCard || { title: 'Projects' };

  return (
    <ThemeWrapper theme={profile.theme}>
        <div className="min-h-screen w-full flex justify-center overflow-x-hidden">
            <div className="w-full max-w-[600px] px-6 py-8 md:py-12 flex flex-col items-center animate-fade-in relative min-h-screen">
                
                {/* Header Navigation */}
                <div className="w-full flex items-center justify-between mb-8 z-20">
                    <Link 
                        to={`/${username}`}
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
                            <img src={profile.avatarUrl} alt="" className="w-8 h-8 rounded-full border-2 border-white/20" />
                        )}
                        <span className={`font-bold text-sm ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
                            {profile.displayName}
                        </span>
                    </div>
                </div>

                {/* Page Title */}
                <div className="w-full text-left mb-8 animate-slide-up">
                    <h1 className={`text-3xl md:text-4xl font-bold ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
                        {projectCard.title || 'Portfolio'}
                    </h1>
                    {profile.projectCard?.description && (
                        <p className={`mt-2 ${isLightTheme ? 'text-gray-500' : 'text-white/60'}`}>
                            {profile.projectCard.description}
                        </p>
                    )}
                </div>

                {/* Projects List */}
                <div className="w-full space-y-8 pb-12">
                    {projects.map((project, idx) => (
                        <div 
                            key={project.id || idx} 
                            className="w-full group animate-slide-up"
                            style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}
                        >
                            {/* Project Header */}
                            <div className="mb-4">
                                {project.thumbnail && (
                                    <div className={`
                                        rounded-2xl overflow-hidden aspect-video w-full shadow-lg mb-5 flex items-center justify-center relative 
                                        ${isLightTheme ? 'bg-gray-100 border border-gray-200' : 'bg-white/5 border border-white/5'}
                                    `}>
                                        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                )}
                                
                                <div className="flex flex-col gap-2">
                                    {project.tags && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map(tag => (
                                                <span key={tag} className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md ${isLightTheme ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white/80'}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <h3 className={`text-2xl font-bold leading-tight break-words ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
                                        {project.title}
                                    </h3>
                                </div>
                            </div>
                            
                            {/* Description */}
                            {project.description && (
                                <p className={`text-base leading-relaxed mb-5 break-words ${isLightTheme ? 'text-gray-600' : 'text-gray-300'}`}>
                                    {project.description}
                                </p>
                            )}

                            {/* Action Button */}
                            {project.url && (
                                <a 
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`
                                        inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]
                                        ${isLightTheme 
                                            ? 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200' 
                                            : 'bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/5'}
                                    `}
                                >
                                    <span>View Project</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                            
                            {/* Divider if not last */}
                            {idx < projects.length - 1 && (
                                <div className={`h-px w-full mt-10 opacity-20 ${isLightTheme ? 'bg-black' : 'bg-white'}`} />
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
    </ThemeWrapper>
  );
};

export default ProjectsPage;