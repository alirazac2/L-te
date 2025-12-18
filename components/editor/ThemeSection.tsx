
import React, { useEffect, useRef } from 'react';
import { UserProfile, ThemeType, ProfileTheme } from '../../types';
import { SECTION_TITLE_CLASS } from './editorUtils';
import { THEME_STYLES } from '../ThemeWrapper';
import { Check } from 'lucide-react';

interface ThemeSectionProps {
  profile: UserProfile;
  onChange: (type: ThemeType, customKey?: keyof ProfileTheme, customValue?: string) => void;
}

const ThemeSection: React.FC<ThemeSectionProps> = ({ profile, onChange }) => {
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
      // Use requestAnimationFrame to wait for paint cycle and ensure parent scroll reset is complete
      requestAnimationFrame(() => {
          requestAnimationFrame(() => {
              if (selectedRef.current) {
                  // behavior: 'auto' snaps instantly, avoiding interruptions if the user interacts immediately
                  selectedRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
              }
          });
      });
  }, []);

  return (
    <section>
        <h2 className={SECTION_TITLE_CLASS}>Select Theme</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
            {Object.entries(THEME_STYLES).map(([key, style]) => {
                const themeKey = key as ThemeType;
                const isSelected = profile.theme.type === themeKey;
                
                return (
                    <button
                        key={themeKey}
                        ref={isSelected ? selectedRef : null}
                        onClick={() => onChange(themeKey)}
                        className={`
                            relative group flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300 text-left overflow-hidden
                            ${isSelected 
                                ? 'border-indigo-600 ring-2 ring-indigo-100 bg-white shadow-md' 
                                : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'}
                        `}
                    >
                        {/* Visual Preview */}
                        <div className={`w-full h-24 rounded-lg overflow-hidden relative shadow-inner ${style.bgClass} flex items-center justify-center p-4`}>
                             {/* Mini Card Preview */}
                             <div className={`w-full h-10 ${style.cardBase} ${style.cardColors} text-[8px] flex items-center px-3 gap-2 shadow-sm`}>
                                 <div className={`w-4 h-4 shrink-0 ${style.avatarClass.includes('rounded-full') ? 'rounded-full' : 'rounded-sm'} bg-current opacity-30`}></div>
                                 <div className="flex-1 h-1.5 bg-current opacity-30 rounded-full"></div>
                             </div>
                             
                             {/* Mini Avatar on top */}
                             <div className={`absolute top-2 left-2 w-6 h-6 ${style.avatarClass} ${style.cardColors} z-10 opacity-80`}></div>
                        </div>

                        <div className="w-full flex justify-between items-center">
                            <span className={`text-sm font-bold ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
                                {style.label}
                            </span>
                            {isSelected && <div className="p-1 bg-indigo-600 rounded-full text-white"><Check className="w-3 h-3"/></div>}
                        </div>
                    </button>
                );
            })}
        </div>
    </section>
  );
};

export default ThemeSection;
