import React from 'react';
import { ThemeType, ProfileTheme } from '../types';

interface ThemeWrapperProps {
  theme: ProfileTheme;
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme, children }) => {
  let containerClasses = "min-h-screen w-full transition-colors duration-500 ease-in-out font-sans relative";
  
  switch (theme.type) {
    case ThemeType.ModernBlack:
      containerClasses += " bg-[#0a0a0a] text-white";
      break;
    case ThemeType.CleanWhite:
      containerClasses += " bg-[#fafafa] text-neutral-900";
      break;
    case ThemeType.GradientBlue:
      containerClasses += " bg-gradient-to-br from-slate-900 via-[#0B1120] to-slate-900 text-white";
      break;
    case ThemeType.SunsetVibe:
      // Changed to a more subtle, premium warm gradient
      containerClasses += " bg-gradient-to-tr from-[#2d1b1e] via-[#4a2b32] to-[#1a1012] text-white";
      break;
    case ThemeType.ForestGlass:
      containerClasses += " bg-[url('https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed text-white";
      break;
    default:
      containerClasses += " bg-neutral-100 text-neutral-900";
  }

  // Allow custom override if provided in JSON
  const customStyle: React.CSSProperties = {
    ...(theme.customBackground ? { background: theme.customBackground } : {}),
    ...(theme.customTextColor ? { color: theme.customTextColor } : {})
  };

  return (
    <div className={containerClasses} style={customStyle}>
       {/* Ensure the inner wrapper also respects height. Used min-h-[inherit] to allow parent containers (like preview box) to control flow if needed. */}
       <div className={`w-full min-h-[inherit] ${theme.type === ThemeType.ForestGlass ? 'backdrop-blur-[8px] bg-black/30' : ''}`}>
          {children}
       </div>
    </div>
  );
};

export const getButtonClasses = (theme: ProfileTheme, featured: boolean = false): string => {
  const base = "w-full transition-all duration-200 ease-out cursor-pointer active:scale-[0.99] relative";
  
  if (featured) {
    // Featured links: clean cards with no border, shadow focus
    return `${base} p-0 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl`;
  }

  // Standard buttons
  const standard = `${base} p-4 rounded-[1.25rem] flex items-center justify-between shadow-sm border`;

  // Note: We generally don't override button bg/text with the global customTextColor to ensure contrast/readability
  // Buttons keep their theme-specific look unless specifically overridden in a future update.

  switch (theme.type) {
    case ThemeType.ModernBlack:
      return `${standard} bg-[#1a1a1a] border-[#333] hover:bg-[#252525] hover:border-[#444] text-gray-100`;
    case ThemeType.CleanWhite:
      return `${standard} bg-white border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-900`;
    case ThemeType.GradientBlue:
      return `${standard} bg-white/5 border-white/10 hover:bg-white/10 text-white backdrop-blur-md`;
    case ThemeType.SunsetVibe:
      return `${standard} bg-white/5 border-white/10 hover:bg-white/10 text-white backdrop-blur-md`;
    case ThemeType.ForestGlass:
      return `${standard} bg-black/40 border-white/10 hover:bg-black/50 text-white backdrop-blur-xl`;
    default:
      return `${standard} bg-white border-gray-200`;
  }
};