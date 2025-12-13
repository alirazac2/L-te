
import React from 'react';
import { ThemeType, ProfileTheme } from '../types';

interface ThemeDefinition {
  label: string;
  bgClass: string;
  textClass: string; // Global text color
  font: string;
  
  // Component Styles
  avatarClass: string;
  socialClass: string;
  
  // Link/Card Styles
  cardBase: string; // Padding, generic flex, transition
  cardColors: string; // Bg, border, text specific to card
  cardHover: string; // Hover state
  
  // Featured Card Specifics
  featuredCardOverlay: string; // Gradient overlay for featured images
}

// Complete Configuration for all Themes
export const THEME_STYLES: Record<ThemeType, ThemeDefinition> = {
  [ThemeType.ModernBlack]: {
    label: "Modern Black",
    bgClass: "bg-[#0a0a0a]",
    textClass: "text-white",
    font: "font-sans",
    avatarClass: "rounded-full border-4 border-[#1f1f1f] shadow-2xl",
    socialClass: "bg-[#1a1a1a] text-gray-300 hover:text-white hover:bg-[#252525] rounded-full",
    cardBase: "rounded-2xl p-4 flex items-center justify-between transition-all duration-300 shadow-sm border",
    cardColors: "bg-[#1a1a1a] border-[#333] text-gray-100",
    cardHover: "hover:bg-[#252525] hover:border-[#555] hover:shadow-lg hover:shadow-white/5 hover:scale-[1.02]",
    featuredCardOverlay: "from-black/90 via-black/40 to-transparent",
  },
  [ThemeType.CleanWhite]: {
    label: "Clean White",
    bgClass: "bg-[#fafafa]",
    textClass: "text-neutral-900",
    font: "font-sans",
    avatarClass: "rounded-full border-4 border-white shadow-lg ring-1 ring-gray-100",
    socialClass: "bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 rounded-full shadow-sm",
    cardBase: "rounded-xl p-4 flex items-center justify-between transition-all duration-300 shadow-sm border",
    cardColors: "bg-white border-gray-200 text-gray-900",
    cardHover: "hover:border-gray-300 hover:shadow-md hover:scale-[1.02]",
    featuredCardOverlay: "from-black/60 via-black/20 to-transparent",
  },
  [ThemeType.GradientBlue]: {
    label: "Ocean Depth",
    bgClass: "bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-950",
    textClass: "text-white",
    font: "font-sans",
    avatarClass: "rounded-full border-4 border-white/10 shadow-2xl backdrop-blur-sm",
    socialClass: "bg-white/5 border border-white/10 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-md",
    cardBase: "rounded-2xl p-4 flex items-center justify-between transition-all duration-300 shadow-lg backdrop-blur-md border",
    cardColors: "bg-white/5 border-white/10 text-white",
    cardHover: "hover:bg-white/10 hover:shadow-blue-500/20 hover:scale-[1.02]",
    featuredCardOverlay: "from-slate-900/90 via-slate-900/40 to-transparent",
  },
  [ThemeType.SunsetVibe]: {
    label: "Sunset Vibe",
    bgClass: "bg-gradient-to-tr from-[#2d1b1e] via-[#4a2b32] to-[#1a1012]",
    textClass: "text-white",
    font: "font-sans",
    avatarClass: "rounded-full border-4 border-white/10 shadow-xl",
    socialClass: "bg-white/5 hover:bg-white/15 text-rose-200 hover:text-white rounded-full backdrop-blur-sm",
    cardBase: "rounded-3xl p-4 flex items-center justify-between transition-all duration-300 shadow-lg backdrop-blur-md border",
    cardColors: "bg-white/5 border-white/5 text-white",
    cardHover: "hover:bg-white/10 hover:shadow-rose-900/40 hover:scale-[1.02]",
    featuredCardOverlay: "from-black/80 via-black/30 to-transparent",
  },
  [ThemeType.ForestGlass]: {
    label: "Forest Glass",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed",
    textClass: "text-white",
    font: "font-sans",
    avatarClass: "rounded-2xl border-2 border-white/20 shadow-2xl backdrop-blur-md",
    socialClass: "bg-black/30 hover:bg-black/50 text-emerald-100 hover:text-white rounded-lg backdrop-blur-md border border-white/5",
    cardBase: "rounded-lg p-4 flex items-center justify-between transition-all duration-300 shadow-xl backdrop-blur-md border",
    cardColors: "bg-black/40 border-white/10 text-white",
    cardHover: "hover:bg-black/50 hover:shadow-2xl hover:scale-[1.01]",
    featuredCardOverlay: "from-black/80 via-black/20 to-transparent",
  },
  [ThemeType.CyberPunk]: {
    label: "Cyber Punk",
    bgClass: "bg-black",
    textClass: "text-[#00ff41]", // Matrix green text
    font: "font-mono tracking-wider",
    avatarClass: "rounded-none border-2 border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.3)]",
    socialClass: "bg-black border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black rounded-none shadow-[0_0_5px_rgba(0,255,65,0.5)]",
    cardBase: "rounded-none p-4 flex items-center justify-between transition-all duration-150 border",
    cardColors: "bg-black border-[#00ff41] text-[#00ff41] shadow-[0_0_5px_rgba(0,255,65,0.2)]",
    cardHover: "hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.6)] translate-x-0 hover:-translate-y-1",
    featuredCardOverlay: "from-black via-black/50 to-transparent",
  },
  [ThemeType.SoftPastel]: {
    label: "Soft Pastel",
    bgClass: "bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100",
    textClass: "text-slate-600",
    font: "font-sans",
    avatarClass: "rounded-[2rem] border-4 border-white shadow-xl",
    socialClass: "bg-white/60 hover:bg-white text-indigo-400 hover:text-indigo-600 rounded-2xl shadow-sm transition-all",
    cardBase: "rounded-[2rem] p-5 flex items-center justify-between transition-all duration-300 shadow-sm border border-white/50",
    cardColors: "bg-white/60 text-slate-700",
    cardHover: "hover:bg-white hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.02]",
    featuredCardOverlay: "from-white/90 via-white/40 to-transparent",
  },
  [ThemeType.RetroPixel]: {
    label: "Retro 90s",
    bgClass: "bg-[#c0c0c0]",
    textClass: "text-black",
    font: "font-mono",
    avatarClass: "rounded-none border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black bg-gray-300",
    socialClass: "bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-black p-1",
    cardBase: "rounded-none p-4 flex items-center justify-between transition-none active:translate-y-1 mb-1",
    cardColors: "bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black text-black shadow-none",
    cardHover: "hover:bg-[#dcdcdc]",
    featuredCardOverlay: "from-black/60 via-black/20 to-transparent",
  },
  [ThemeType.NeoBrutalism]: {
    label: "Neo Brutalism",
    bgClass: "bg-[#FFDE59]", // Bright Yellow
    textClass: "text-black",
    font: "font-sans font-bold",
    avatarClass: "rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    socialClass: "bg-white border-2 border-black text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md transition-all",
    cardBase: "rounded-md p-4 flex items-center justify-between transition-all duration-200 border-2",
    cardColors: "bg-white border-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    cardHover: "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    featuredCardOverlay: "from-black/90 via-black/40 to-transparent",
  },
  [ThemeType.LuxuryGold]: {
    label: "Luxury Gold",
    bgClass: "bg-[#121212]",
    textClass: "text-[#D4AF37]", // Gold
    font: "font-serif tracking-wide",
    avatarClass: "rounded-full border-2 border-[#D4AF37] p-1 ring-1 ring-[#D4AF37]/50",
    socialClass: "bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-full transition-all duration-500",
    cardBase: "rounded-sm p-5 flex items-center justify-between transition-all duration-500 border",
    cardColors: "bg-[#1E1E1E] border-[#D4AF37]/30 text-[#D4AF37]",
    cardHover: "hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:bg-[#252525]",
    featuredCardOverlay: "from-black/90 via-black/50 to-transparent",
  }
};

interface ThemeWrapperProps {
  theme: ProfileTheme;
  children: React.ReactNode;
  className?: string; // Allow override
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme, children, className }) => {
  const definition = THEME_STYLES[theme?.type || ThemeType.ModernBlack] || THEME_STYLES[ThemeType.ModernBlack];

  // Helper class for ForestGlass overlay
  const isForestGlass = theme?.type === ThemeType.ForestGlass;

  return (
    <div 
        className={`w-full transition-colors duration-500 ease-in-out relative overflow-x-hidden ${definition.bgClass} ${definition.textClass} ${definition.font} ${className || 'min-h-screen'}`}
        style={{
             ...(theme?.customBackground ? { background: theme.customBackground } : {}),
             ...(theme?.customTextColor ? { color: theme.customTextColor } : {})
        }}
    >
       {/* Overlay for Forest Glass or custom Needs */}
       <div className={`w-full min-h-[inherit] ${isForestGlass ? 'backdrop-blur-[8px] bg-black/40' : ''}`}>
          {children}
       </div>
    </div>
  );
};

// Helper to get component specific classes
export const getThemeClasses = (theme: ProfileTheme) => {
    const type = theme?.type || ThemeType.ModernBlack;
    return THEME_STYLES[type] || THEME_STYLES[ThemeType.ModernBlack];
};

// Updated logic to safely strip padding/flex from Featured cards
export const getCardClasses = (theme: ProfileTheme, featured: boolean = false): string => {
  const styles = getThemeClasses(theme);
  
  if (featured) {
      // Remove any padding classes (p-4, p-5, etc) and flex/items-center to ensure full bleed image
      const cleanBase = styles.cardBase
        .replace(/\bp-\d+\s*/g, '') // Remove padding
        .replace(/\bflex\b/g, '') // Remove flex
        .replace(/\bitems-center\b/g, '')
        .replace(/\bjustify-between\b/g, '');

      // Return a specific set for featured card container with block layout and no padding
      return `${cleanBase} p-0 block ${styles.cardColors} ${styles.cardHover} cursor-pointer relative group overflow-hidden`;
  }

  // Standard Card
  return `${styles.cardBase} ${styles.cardColors} ${styles.cardHover} cursor-pointer relative group overflow-hidden`;
};
