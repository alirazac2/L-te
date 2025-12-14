
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

  [ThemeType.Base]: {
    label: "Base",
    bgClass: "bg-[#eff6ff]", // Blue 50
    textClass: "text-[#1e3a8a]", // Blue 900
    font: "font-sans",
    avatarClass: "rounded-full border-4 border-white shadow-[0_4px_20px_rgba(37,99,235,0.15)] ring-2 ring-blue-100",
    socialClass: "bg-white text-[#2563eb] hover:bg-[#2563eb] hover:text-white border border-blue-200 rounded-full shadow-sm hover:shadow-blue-500/30 transition-all duration-300",
    // Clean, corporate blue
    cardBase: "rounded-xl p-4 flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] shadow-sm border",
    cardColors: "bg-white border-blue-100 text-[#1e40af]",
    cardHover: "hover:border-[#3b82f6] hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] hover:-translate-y-1 hover:ring-1 hover:ring-[#3b82f6]",
    featuredCardOverlay: "from-blue-900/80 via-blue-900/20 to-transparent",
  },
  [ThemeType.BaseDark]: {
    label: "Base Dark",
    bgClass: "bg-[#172554]", // Blue 950 (Deep Navy, NOT Black)
    textClass: "text-blue-50",
    font: "font-sans",
    avatarClass: "rounded-full border-4 border-[#1e3a8a] shadow-2xl ring-2 ring-blue-500/30",
    socialClass: "bg-[#1e3a8a]/50 text-blue-300 hover:text-white hover:bg-[#2563eb] border border-blue-800 rounded-full transition-all duration-300",
    // Deep Blue Card
    cardBase: "rounded-xl p-4 flex items-center justify-between transition-all duration-300 ease-out border shadow-lg",
    cardColors: "bg-[#1e3a8a]/40 border-blue-800/50 text-blue-50 backdrop-blur-sm",
    cardHover: "hover:bg-[#1e3a8a]/80 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.01]",
    featuredCardOverlay: "from-[#172554]/90 via-[#1e3a8a]/50 to-transparent",
  },
  [ThemeType.BaseSoft]: {
    label: "Base Soft",
    bgClass: "bg-[#dbeafe]", // Blue 100
    textClass: "text-[#1e3a8a]", // Blue 900
    font: "font-sans",
    avatarClass: "rounded-[2rem] border-4 border-white shadow-xl ring-4 ring-[#bfdbfe]",
    socialClass: "bg-white text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white rounded-2xl shadow-sm transition-all duration-300",
    // Soft Airy Blue
    cardBase: "rounded-full p-4 pl-6 flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-sm border",
    cardColors: "bg-white/80 backdrop-blur-sm border-[#bfdbfe] text-[#1e40af]",
    cardHover: "hover:bg-white hover:shadow-[0_10px_25px_rgba(59,130,246,0.2)] hover:border-[#60a5fa] hover:-translate-y-1 hover:px-7",
    featuredCardOverlay: "from-blue-900/80 via-blue-600/30 to-transparent",
  },
  [ThemeType.BaseDev]: {
    label: "Base Dev",
    bgClass: "bg-[#0f172a]", // Slate 900 (Technical Blue-Grey)
    textClass: "text-[#60a5fa]", // Blue 400
    font: "font-mono",
    avatarClass: "rounded-lg border-2 border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-[#1e293b]",
    socialClass: "bg-[#1e293b] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-[#0f172a] border border-[#1e40af] rounded-md transition-all",
    // Technical / Code Editor Style
    cardBase: "rounded-md p-4 flex items-center justify-between transition-all duration-200 border-l-4",
    cardColors: "bg-[#1e293b] border-l-[#3b82f6] border-y border-r border-y-[#1e40af]/30 border-r-[#1e40af]/30 text-blue-100",
    cardHover: "hover:bg-[#1e3a8a]/20 hover:border-l-[#60a5fa] hover:translate-x-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
    featuredCardOverlay: "from-[#0f172a]/95 via-[#0f172a]/60 to-transparent",
  },

  [ThemeType.BlackGem]: {
    label: "Black Gem",
    bgClass: "bg-[#111] bg-[radial-gradient(circle_at_center,_#333_0%,_#111_100%)]",
    textClass: "text-zinc-200",
    font: "font-sans",
    avatarClass: "rounded-full border-2 border-zinc-600 shadow-[0_0_15px_rgba(255,255,255,0.1)]",
    socialClass: "bg-[#1a1a1a] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-full",
    cardBase: "rounded-lg p-4 flex items-center justify-between transition-all duration-300 shadow-xl border-t border-t-zinc-700 border-b border-b-black border-x border-x-zinc-900",
    cardColors: "bg-[#1a1a1a] text-zinc-100",
    cardHover: "hover:bg-[#222] hover:border-t-zinc-500 hover:shadow-2xl",
    featuredCardOverlay: "from-black/90 via-black/40 to-transparent",
  },
  [ThemeType.BlackGemV2]: {
    label: "Black Gem v2",
    bgClass: "bg-black",
    textClass: "text-white",
    font: "font-sans tracking-wide",
    avatarClass: "rounded-full border border-white/20 shadow-2xl bg-black transition-all duration-500 hover:rounded-[1.5rem]",
    socialClass: "bg-black border border-white/20 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-500 hover:rounded-xl",
    cardBase: "rounded-[2.5rem] p-4 flex items-center justify-between transition-all duration-500 border border-white/10 backdrop-blur-md",
    cardColors: "bg-gradient-to-b from-white/5 to-transparent text-white",
    cardHover: "hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:rounded-2xl",
    featuredCardOverlay: "from-black via-black/50 to-transparent",
  },

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
    cardBase: "rounded-full p-4 pl-6 flex items-center justify-between transition-all duration-300 shadow-lg backdrop-blur-md border",
    cardColors: "bg-white/5 border-white/5 text-white",
    cardHover: "hover:bg-white/10 hover:shadow-rose-900/40 hover:scale-[1.02]",
    featuredCardOverlay: "from-black/80 via-black/30 to-transparent",
  },
  [ThemeType.ForestGlass]: {
    label: "Forest Glass",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2070&auto=format&fit=crop')]",
    textClass: "text-white",
    font: "font-sans",
    avatarClass: "rounded-2xl border-2 border-white/20 shadow-2xl backdrop-blur-md",
    socialClass: "bg-black/30 hover:bg-black/50 text-emerald-100 hover:text-white rounded-lg backdrop-blur-md border border-white/5",
    cardBase: "rounded-lg p-4 flex items-center justify-between transition-all duration-300 shadow-xl backdrop-blur-md border",
    cardColors: "bg-black/40 border-white/10 text-white",
    cardHover: "hover:bg-black/50 hover:shadow-2xl hover:scale-[1.01]",
    featuredCardOverlay: "from-black/80 via-black/20 to-transparent",
  },
  [ThemeType.IslandParadise]: {
    label: "Island Paradise",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1542259648-8121f644b416?q=80&w=2070&auto=format&fit=crop')]",
    textClass: "text-slate-900",
    font: "font-sans",
    avatarClass: "rounded-full border-4 border-white/60 shadow-xl backdrop-blur-sm",
    socialClass: "bg-white/40 hover:bg-white/80 text-teal-800 hover:text-teal-900 rounded-full backdrop-blur-md border border-white/20",
    cardBase: "rounded-2xl p-4 flex items-center justify-between transition-all duration-500 shadow-lg backdrop-blur-md border-t border-l border-white/50 border-b border-r border-teal-900/10",
    cardColors: "bg-white/60 text-slate-800",
    cardHover: "hover:bg-white/80 hover:-translate-y-1 hover:shadow-teal-500/30",
    featuredCardOverlay: "from-teal-900/60 via-teal-900/20 to-transparent",
  },
  [ThemeType.UrbanJungle]: {
    label: "Urban Jungle",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2070&auto=format&fit=crop')]",
    textClass: "text-gray-100",
    font: "font-sans tracking-wide",
    avatarClass: "rounded-xl border-2 border-blue-500/50 shadow-2xl",
    socialClass: "bg-black/60 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg border border-gray-800",
    cardBase: "rounded-none p-4 flex items-center justify-between transition-all duration-300 shadow-xl border-l-4",
    cardColors: "bg-gray-900/90 border-blue-600 text-gray-200",
    cardHover: "hover:bg-black hover:border-purple-500 hover:pl-6",
    featuredCardOverlay: "from-black/90 via-black/50 to-transparent",
  },
  [ThemeType.MinimalistGrey]: {
    label: "Minimalist List",
    bgClass: "bg-[#f3f4f6]",
    textClass: "text-gray-800",
    font: "font-sans",
    avatarClass: "rounded-full border border-gray-200 shadow-sm",
    socialClass: "bg-white border border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-900 rounded-full",
    cardBase: "rounded-none px-0 py-4 flex items-center justify-between transition-all duration-300 border-b",
    cardColors: "bg-transparent border-gray-300 text-gray-800",
    cardHover: "hover:pl-4 hover:border-gray-400 hover:text-black",
    featuredCardOverlay: "from-black/60 via-black/20 to-transparent",
  },
  [ThemeType.VibrantPop]: {
    label: "Vibrant Pop",
    bgClass: "bg-[#6d28d9]", // Deep Purple
    textClass: "text-white",
    font: "font-sans font-black",
    avatarClass: "rounded-3xl border-4 border-[#fbbf24] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]",
    socialClass: "bg-[#f472b6] text-white hover:bg-[#ec4899] rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]",
    cardBase: "rounded-2xl p-4 flex items-center justify-between transition-all duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] border-4",
    cardColors: "bg-[#22d3ee] border-white text-black", // Cyan cards
    cardHover: "hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-[#67e8f9] hover:rotate-1",
    featuredCardOverlay: "from-purple-900/90 via-purple-900/40 to-transparent",
  },
  [ThemeType.CloudsDream]: {
    label: "Clouds Dream",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=2070&auto=format&fit=crop')]",
    textClass: "text-[#1e3a8a]",
    font: "font-serif",
    avatarClass: "rounded-full border-4 border-white shadow-lg ring-4 ring-blue-100/50",
    socialClass: "bg-white/80 hover:bg-white text-blue-400 hover:text-blue-600 rounded-full shadow-md",
    cardBase: "rounded-[2rem] p-4 flex items-center justify-between transition-all duration-500 shadow-lg border",
    cardColors: "bg-white/60 border-white/60 text-blue-900 backdrop-blur-sm",
    cardHover: "hover:bg-white/80 hover:scale-[1.03] hover:shadow-xl",
    featuredCardOverlay: "from-blue-900/50 via-blue-500/20 to-transparent",
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
    label: "Chunky Pastel",
    bgClass: "bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100",
    textClass: "text-slate-600",
    font: "font-sans",
    avatarClass: "rounded-[2rem] border-4 border-white shadow-xl",
    socialClass: "bg-white/60 hover:bg-white text-indigo-400 hover:text-indigo-600 rounded-2xl shadow-sm transition-all",
    cardBase: "rounded-2xl p-4 flex items-center justify-between transition-all duration-100 shadow-sm border-b-[6px] active:border-b-0 active:translate-y-[6px]",
    cardColors: "bg-white border-b-purple-200 border-x border-t border-white text-slate-700",
    cardHover: "hover:bg-purple-50 hover:border-b-purple-300",
    featuredCardOverlay: "from-white/90 via-white/40 to-transparent",
  },
  [ThemeType.RetroPixel]: {
    label: "Retro 95",
    bgClass: "bg-[#008080]", // Windows teal
    textClass: "text-black",
    font: "font-mono",
    avatarClass: "rounded-none border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black bg-gray-300 p-1",
    socialClass: "bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-black p-1",
    cardBase: "rounded-none p-3 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black flex items-center justify-between transition-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:bg-gray-300 mb-1.5",
    cardColors: "bg-[#c0c0c0] text-black shadow-none",
    cardHover: "hover:bg-[#c0c0c0]",
    featuredCardOverlay: "from-black/60 via-black/20 to-transparent",
  },
  [ThemeType.NeoBrutalism]: {
    label: "Neo Brutalism",
    bgClass: "bg-[#FFDE59]", // Bright Yellow
    textClass: "text-black",
    font: "font-sans font-bold",
    avatarClass: "rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    socialClass: "bg-white border-2 border-black text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md transition-all",
    cardBase: "rounded-md p-4 flex items-center justify-between transition-all duration-200 border-4",
    cardColors: "bg-white border-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    cardHover: "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    featuredCardOverlay: "from-black/90 via-black/40 to-transparent",
  },
  [ThemeType.LuxuryGold]: {
    label: "Luxury Gold",
    bgClass: "bg-[#050505]",
    textClass: "text-[#D4AF37]", // Gold
    font: "font-serif tracking-wide",
    avatarClass: "rounded-full border border-[#D4AF37] p-1 ring-1 ring-[#D4AF37]/50",
    socialClass: "bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-full transition-all duration-500",
    cardBase: "rounded-sm p-4 flex items-center justify-between transition-all duration-500 border",
    cardColors: "bg-transparent border-[#D4AF37] text-[#D4AF37]",
    cardHover: "hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-[#D4AF37] hover:text-black",
    featuredCardOverlay: "from-black/90 via-black/50 to-transparent",
  },
  [ThemeType.MidnightBloom]: {
    label: "Midnight Bloom",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1493612276216-9c59019558f7?q=80&w=2070&auto=format&fit=crop')]",
    textClass: "text-fuchsia-100",
    font: "font-serif",
    avatarClass: "rounded-tl-3xl rounded-br-3xl border-2 border-fuchsia-500/50 shadow-2xl",
    socialClass: "bg-black/40 hover:bg-fuchsia-900/60 text-fuchsia-300 hover:text-white rounded-xl backdrop-blur-sm border border-fuchsia-500/20",
    cardBase: "rounded-tl-3xl rounded-br-3xl p-4 flex items-center justify-between transition-all duration-500 shadow-xl backdrop-blur-lg border",
    cardColors: "bg-black/50 border-fuchsia-500/30 text-fuchsia-50",
    cardHover: "hover:bg-black/70 hover:border-fuchsia-400 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]",
    featuredCardOverlay: "from-black/90 via-black/50 to-transparent",
  },
  [ThemeType.TechBlueprint]: {
    label: "Tech Blueprint",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')]",
    textClass: "text-blue-100",
    font: "font-mono",
    avatarClass: "rounded-none border-2 border-dashed border-blue-400 p-1",
    socialClass: "bg-blue-900/80 hover:bg-blue-800 text-blue-300 hover:text-white rounded-none border border-blue-400/50",
    cardBase: "rounded-none p-4 flex items-center justify-between transition-all duration-200 shadow-lg border-2 border-dashed",
    cardColors: "bg-blue-950/80 border-blue-400/50 text-blue-100",
    cardHover: "hover:bg-blue-900/90 hover:border-blue-300 hover:translate-x-1",
    featuredCardOverlay: "from-blue-950/90 via-blue-900/50 to-transparent",
  },
  [ThemeType.VintagePaper]: {
    label: "Vintage Paper",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1974&auto=format&fit=crop')]",
    textClass: "text-[#4a3b32]",
    font: "font-serif",
    avatarClass: "rounded-full border-4 border-[#8d6e63] shadow-md sepia-[0.3]",
    socialClass: "bg-[#fdfbf7]/80 hover:bg-[#8d6e63] text-[#5d4037] hover:text-white rounded-full border border-[#d7ccc8]",
    cardBase: "rounded-sm p-4 flex items-center justify-between transition-all duration-300 shadow-[2px_2px_0px_rgba(93,64,55,0.2)] border",
    cardColors: "bg-[#fdfbf7]/90 border-[#8d6e63] text-[#3e2723]",
    cardHover: "hover:rotate-[0.5deg] hover:shadow-[3px_3px_0px_rgba(93,64,55,0.4)]",
    featuredCardOverlay: "from-[#3e2723]/80 via-[#3e2723]/30 to-transparent",
  },
  [ThemeType.NeonNight]: {
    label: "Neon Night",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1565527692131-b7556ee02eb7?q=80&w=2070&auto=format&fit=crop')]",
    textClass: "text-white",
    font: "font-sans tracking-wide",
    avatarClass: "rounded-lg border-2 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)]",
    socialClass: "bg-black/60 hover:bg-pink-600/20 text-cyan-400 hover:text-pink-400 rounded-lg border border-cyan-500/30",
    cardBase: "rounded-none p-4 flex items-center justify-between transition-all duration-300 backdrop-blur-xl border-t-2 border-b-2",
    cardColors: "bg-black/70 border-t-pink-500 border-b-cyan-500 border-x-transparent text-white",
    cardHover: "hover:bg-black/80 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:border-x-pink-500/20",
    featuredCardOverlay: "from-black/90 via-black/50 to-transparent",
  },
  [ThemeType.CoffeeHouse]: {
    label: "Coffee House",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1922&auto=format&fit=crop')]",
    textClass: "text-[#efebe9]",
    font: "font-sans",
    avatarClass: "rounded-full border-4 border-[#6d4c41] shadow-xl",
    socialClass: "bg-[#3e2723]/80 hover:bg-[#5d4037] text-[#d7ccc8] hover:text-white rounded-full",
    cardBase: "rounded-lg p-4 flex items-center justify-between transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border-b border-[#5d4037]",
    cardColors: "bg-[#4e342e]/90 text-[#efebe9]",
    cardHover: "hover:bg-[#5d4037] hover:pl-6",
    featuredCardOverlay: "from-black/80 via-black/40 to-transparent",
  },
  [ThemeType.NordicFrost]: {
    label: "Nordic Frost",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1483664852095-d6cc68707022?q=80&w=2070&auto=format&fit=crop')]",
    textClass: "text-slate-800",
    font: "font-sans",
    avatarClass: "rounded-xl border-2 border-cyan-700/20 shadow-lg",
    socialClass: "bg-white/70 hover:bg-cyan-700 hover:text-white text-slate-600 rounded-lg shadow-sm backdrop-blur-sm",
    cardBase: "rounded-sm p-4 flex items-center justify-between transition-all duration-300 shadow-sm border-l-[6px]",
    cardColors: "bg-white/80 border-l-cyan-700 text-slate-800",
    cardHover: "hover:bg-white hover:shadow-lg hover:border-l-cyan-500",
    featuredCardOverlay: "from-slate-900/60 via-slate-900/20 to-transparent",
  },
  [ThemeType.TerminalConsole]: {
    label: "Terminal Console",
    bgClass: "bg-black",
    textClass: "text-green-500",
    font: "font-mono",
    avatarClass: "rounded-none border border-green-500 p-0.5",
    socialClass: "bg-black border border-green-500 text-green-500 hover:bg-green-500/20 rounded-none",
    cardBase: "rounded-none p-4 flex items-center justify-between transition-none border-l-2 border-transparent hover:border-green-500",
    cardColors: "bg-black text-green-500 border border-green-900",
    cardHover: "hover:bg-green-900/10 before:content-['>_'] before:mr-2 before:text-green-500",
    featuredCardOverlay: "from-green-900/40 via-black/80 to-transparent",
  },
  [ThemeType.BubbleGum]: {
    label: "Bubble Gum",
    bgClass: "bg-gradient-to-b from-pink-300 to-cyan-200",
    textClass: "text-white",
    font: "font-sans font-bold",
    avatarClass: "rounded-full border-[6px] border-white shadow-xl",
    socialClass: "bg-white text-pink-500 hover:bg-pink-50 hover:scale-110 rounded-full shadow-lg transition-transform",
    cardBase: "rounded-full p-4 pl-6 flex items-center justify-between transition-all duration-300 shadow-lg border-[3px]",
    cardColors: "bg-pink-400 border-white text-white",
    cardHover: "hover:-translate-y-1 hover:bg-pink-300 hover:shadow-xl",
    featuredCardOverlay: "from-pink-600/80 via-pink-400/30 to-transparent",
  },
  [ThemeType.SpaceOdyssey]: {
    label: "Space Odyssey",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')]",
    textClass: "text-white",
    font: "font-sans",
    avatarClass: "rounded-full border border-indigo-300/30 shadow-[0_0_30px_rgba(99,102,241,0.5)] bg-black/50",
    socialClass: "bg-indigo-950/50 hover:bg-indigo-500/30 text-indigo-200 hover:text-white rounded-full border border-indigo-500/30 backdrop-blur-md",
    cardBase: "rounded-xl p-4 flex items-center justify-between transition-all duration-500 backdrop-blur-sm border",
    cardColors: "bg-indigo-900/40 border-indigo-400/30 text-indigo-50",
    cardHover: "hover:bg-indigo-800/50 hover:border-indigo-300/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]",
    featuredCardOverlay: "from-black/90 via-indigo-950/50 to-transparent",
  },
  [ThemeType.GlassPrism]: {
    label: "Glass Prism",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')]",
    textClass: "text-white",
    font: "font-sans",
    avatarClass: "rounded-2xl border border-white/40 shadow-xl backdrop-blur-md",
    socialClass: "bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 backdrop-blur-xl",
    cardBase: "rounded-lg p-4 flex items-center justify-between transition-all duration-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-xl border border-white/20",
    cardColors: "bg-white/10 text-white",
    cardHover: "hover:bg-white/20 hover:border-white/40 hover:scale-[1.02]",
    featuredCardOverlay: "from-black/60 via-purple-900/20 to-transparent",
  },
  [ThemeType.LavaLamp]: {
    label: "Lava Lamp",
    bgClass: "bg-black",
    textClass: "text-orange-100",
    font: "font-sans",
    avatarClass: "rounded-full border-4 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.6)]",
    socialClass: "bg-orange-900/30 text-orange-400 hover:text-orange-200 hover:bg-orange-800/50 rounded-full border border-orange-500/30",
    cardBase: "rounded-[2rem] p-4 flex items-center justify-between transition-all duration-500 shadow-[0_0_15px_rgba(249,115,22,0.15)] border",
    cardColors: "bg-gradient-to-r from-gray-900 to-black border-orange-500/40 text-orange-50",
    cardHover: "hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:border-orange-400 hover:scale-[1.02]",
    featuredCardOverlay: "from-black/90 via-orange-900/50 to-transparent",
  },
  [ThemeType.SketchyNote]: {
    label: "Sketchy Note",
    bgClass: "bg-[#fffdf5]", // Off-white paper
    textClass: "text-gray-800",
    font: "font-serif",
    avatarClass: "rounded-full border-2 border-black p-1 shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]",
    socialClass: "bg-white border-2 border-black text-black hover:-translate-y-1 hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.2)] rounded-lg transition-transform",
    cardBase: "rounded-sm p-4 flex items-center justify-between transition-all duration-200 border-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]",
    cardColors: "bg-white border-black text-gray-900",
    cardHover: "hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.15)] hover:rotate-[-0.5deg]",
    featuredCardOverlay: "from-black/70 via-black/30 to-transparent",
  },
  [ThemeType.CyberGlitch]: {
    label: "Cyber Glitch",
    bgClass: "bg-[#050505]",
    textClass: "text-white",
    font: "font-mono tracking-tighter",
    avatarClass: "rounded-none border-l-4 border-l-red-500 border-r-4 border-r-cyan-500",
    socialClass: "bg-gray-900 text-white hover:bg-gray-800 rounded-none border-l-2 border-r-2 border-l-red-500 border-r-cyan-500",
    cardBase: "rounded-none p-4 flex items-center justify-between transition-all duration-150 border-l-4 border-r-4 border-t border-b border-t-gray-800 border-b-gray-800",
    cardColors: "bg-[#111] border-l-red-600 border-r-cyan-500 text-gray-200",
    cardHover: "hover:bg-[#1a1a1a] hover:-skew-x-2 hover:border-l-red-400 hover:border-r-cyan-300",
    featuredCardOverlay: "from-black/90 via-red-900/20 to-transparent",
  },
  [ThemeType.RoyalVelvet]: {
    label: "Royal Velvet",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')]",
    textClass: "text-[#FFD700]", // Gold
    font: "font-serif",
    avatarClass: "rounded-full border-4 border-[#FFD700] shadow-xl p-1 bg-indigo-950",
    socialClass: "bg-indigo-950/80 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-indigo-950 rounded-full",
    cardBase: "rounded-lg p-4 flex items-center justify-between transition-all duration-500 border-4 border-double shadow-lg",
    cardColors: "bg-indigo-950/90 border-[#FFD700] text-[#f8f5d0]",
    cardHover: "hover:bg-indigo-900 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] hover:scale-[1.01]",
    featuredCardOverlay: "from-indigo-950/90 via-indigo-900/50 to-transparent",
  },
  [ThemeType.Newspaper]: {
    label: "The Daily News",
    bgClass: "bg-[#f0f0eb]", // Newsprint
    textClass: "text-[#1a1a1a]",
    font: "font-serif",
    avatarClass: "rounded-none border border-black p-1 grayscale contrast-125",
    socialClass: "bg-white border border-black text-black hover:bg-black hover:text-white rounded-none",
    cardBase: "rounded-none p-4 flex items-center justify-between transition-all duration-300 border-b border-black",
    cardColors: "bg-transparent text-[#1a1a1a]",
    cardHover: "hover:bg-[#e6e6e0] hover:pl-6 hover:font-bold",
    featuredCardOverlay: "from-black/80 via-black/40 to-transparent",
  },
  [ThemeType.MintFresh]: {
    label: "Mint Fresh",
    bgClass: "bg-[#f0fdf4]", // Mint 50
    textClass: "text-[#14532d]", // Green 900
    font: "font-sans",
    avatarClass: "rounded-[3rem] border-4 border-white shadow-lg ring-4 ring-[#86efac]",
    socialClass: "bg-white text-[#16a34a] hover:bg-[#dcfce7] rounded-2xl shadow-sm border border-[#bbf7d0]",
    cardBase: "rounded-full p-4 pl-6 flex items-center justify-between transition-all duration-300 shadow-sm border",
    cardColors: "bg-white border-[#bbf7d0] text-[#15803d]",
    cardHover: "hover:shadow-md hover:border-[#86efac] hover:-translate-y-0.5",
    featuredCardOverlay: "from-[#14532d]/80 via-[#14532d]/30 to-transparent",
  },
  [ThemeType.OutlineNeon]: {
    label: "Outline Neon",
    bgClass: "bg-black",
    textClass: "text-white",
    font: "font-sans font-bold tracking-wide",
    avatarClass: "rounded-full border-2 border-fuchsia-500 shadow-[0_0_10px_#d946ef,inset_0_0_10px_#d946ef] bg-transparent",
    socialClass: "bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_#22d3ee] rounded-full transition-all",
    cardBase: "rounded-xl p-4 flex items-center justify-between transition-all duration-300 border",
    cardColors: "bg-transparent border-fuchsia-500 text-fuchsia-50 shadow-[0_0_5px_#d946ef]",
    cardHover: "hover:shadow-[0_0_20px_#d946ef] hover:bg-fuchsia-500/10 hover:border-fuchsia-400",
    featuredCardOverlay: "from-black via-black/50 to-transparent",
  },
  [ThemeType.CarbonFiber]: {
    label: "Carbon Fiber",
    bgClass: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black",
    textClass: "text-gray-200",
    font: "font-sans",
    avatarClass: "rounded-full border-4 border-gray-600 shadow-2xl bg-gray-800",
    socialClass: "bg-gradient-to-br from-gray-800 to-black border border-gray-700 text-gray-400 hover:text-white rounded-lg shadow-inner",
    cardBase: "rounded-lg p-4 flex items-center justify-between transition-all duration-300 shadow-lg border border-gray-700/50",
    cardColors: "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100",
    cardHover: "hover:from-gray-700 hover:to-gray-800 hover:border-gray-500",
    featuredCardOverlay: "from-black/90 via-black/50 to-transparent",
  },
  [ThemeType.SakuraSeason]: {
    label: "Sakura Season",
    bgClass: "bg-[url('https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2076&auto=format&fit=crop')]",
    textClass: "text-[#831843]", // Pink 900
    font: "font-sans",
    avatarClass: "rounded-full border-4 border-white shadow-lg ring-4 ring-pink-200",
    socialClass: "bg-white/60 hover:bg-white text-pink-500 hover:text-pink-600 rounded-full backdrop-blur-sm shadow-sm",
    cardBase: "rounded-2xl p-4 flex items-center justify-between transition-all duration-300 backdrop-blur-md border",
    cardColors: "bg-white/40 border-white/40 text-[#831843]",
    cardHover: "hover:bg-white/60 hover:shadow-lg hover:shadow-pink-200/50",
    featuredCardOverlay: "from-[#831843]/60 via-[#831843]/20 to-transparent",
  },
  [ThemeType.EightBitDungeon]: {
    label: "8-Bit Dungeon",
    bgClass: "bg-[#2d2a2e]", // Dark gray
    textClass: "text-[#e0dacc]",
    font: "font-mono",
    avatarClass: "rounded-none border-[4px] border-[#5d5048] p-1 bg-[#1a181a]",
    socialClass: "bg-[#453c36] text-[#e0dacc] hover:bg-[#6e5f54] rounded-none border-[3px] border-[#1a181a]",
    cardBase: "rounded-none p-4 flex items-center justify-between transition-none border-[4px] shadow-none mb-2",
    cardColors: "bg-[#383330] border-[#1a181a] text-[#e0dacc]",
    cardHover: "hover:bg-[#453c36] hover:translate-x-1",
    featuredCardOverlay: "from-black/80 via-black/40 to-transparent",
  },
};

interface ThemeWrapperProps {
  theme: ProfileTheme;
  children: React.ReactNode;
  className?: string; // Allow override
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme, children, className }) => {
  const definition = THEME_STYLES[theme?.type || ThemeType.ModernBlack] || THEME_STYLES[ThemeType.ModernBlack];

  // Helper logic for Image-based themes overlay to ensure text readability
  const isImageBased = 
      definition.bgClass.includes('url(') || 
      theme?.type === ThemeType.ForestGlass || 
      theme?.type === ThemeType.IslandParadise || 
      theme?.type === ThemeType.UrbanJungle || 
      theme?.type === ThemeType.CloudsDream ||
      theme?.type === ThemeType.MidnightBloom ||
      theme?.type === ThemeType.TechBlueprint ||
      theme?.type === ThemeType.VintagePaper ||
      theme?.type === ThemeType.NeonNight ||
      theme?.type === ThemeType.CoffeeHouse ||
      theme?.type === ThemeType.NordicFrost ||
      theme?.type === ThemeType.SpaceOdyssey ||
      theme?.type === ThemeType.GlassPrism ||
      theme?.type === ThemeType.RoyalVelvet ||
      theme?.type === ThemeType.SakuraSeason;

  // Clean bg-fixed from definition to avoid conflict with our manual fixed layer
  const cleanBgClass = definition.bgClass.replace('bg-fixed', '').replace('bg-cover', '').replace('bg-center', '').replace('bg-no-repeat', '');

  return (
    <div 
        className={`w-full relative overflow-x-hidden ${definition.textClass} ${definition.font} ${className || 'min-h-screen'}`}
        style={{
             ...(theme?.customTextColor ? { color: theme.customTextColor } : {})
        }}
    >
        {/* FIXED BACKGROUND LAYER - This effectively stops scrolling of the background image */}
        <div 
            className={`fixed inset-0 -z-10 w-full h-full transition-all duration-500 ease-in-out ${cleanBgClass}`}
            style={{
                ...(theme?.customBackground ? { background: theme.customBackground } : {}),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'scroll' // Force scroll on the fixed div so the image covers the fixed div
            }}
        />

        {/* Overlay for Image Backgrounds to improve readability */}
        {isImageBased && (
             <div className="fixed inset-0 -z-10 w-full h-full bg-black/10 backdrop-blur-[2px]" />
        )}

        {/* Content Container */}
        <div className="relative z-0 w-full min-h-[inherit]">
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
      // For featured cards, we want to maintain the "container" style of the theme but remove padding
      // so the image is full width.
      
      // Special Handling for "List" style themes like MinimalistGrey:
      // We force a rounded shape for featured cards even if standard links are list-style
      const isListStyle = theme.type === ThemeType.MinimalistGrey || theme.type === ThemeType.Newspaper;
      
      let base = styles.cardBase
        .replace(/\bp-\d+\s*/g, '') // Remove padding
        .replace(/\bpx-\d+\s*/g, '')
        .replace(/\bpy-\d+\s*/g, '')
        .replace(/\bflex\b/g, '') // Remove flex
        .replace(/\bitems-center\b/g, '')
        .replace(/\bjustify-between\b/g, '');

      if (isListStyle) {
          base = base.replace('rounded-none', 'rounded-xl').replace('border-b', 'border');
      }

      // Return a specific set for featured card container with block layout and no padding
      return `${base} p-0 block ${styles.cardColors} ${styles.cardHover} cursor-pointer relative group overflow-hidden`;
  }

  // Standard Card
  return `${styles.cardBase} ${styles.cardColors} ${styles.cardHover} cursor-pointer relative group overflow-hidden`;
};
