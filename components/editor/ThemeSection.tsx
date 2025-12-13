import React from 'react';
import { UserProfile, ThemeType, ProfileTheme } from '../../types';
import { SECTION_TITLE_CLASS } from './editorUtils';

interface ThemeSectionProps {
  profile: UserProfile;
  onChange: (type: ThemeType, customKey?: keyof ProfileTheme, customValue?: string) => void;
}

const ThemeSection: React.FC<ThemeSectionProps> = ({ profile, onChange }) => {
  return (
    <section>
        <h2 className={SECTION_TITLE_CLASS}>Theme</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {Object.values(ThemeType).map(theme => (
                <button
                    key={theme}
                    onClick={() => onChange(theme)}
                    className={`
                        p-3 rounded-xl border text-sm font-medium text-left capitalize transition-all duration-200
                        ${profile.theme.type === theme 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}
                    `}
                >
                    {theme.replace('-', ' ')}
                </button>
            ))}
        </div>
    </section>
  );
};

export default ThemeSection;