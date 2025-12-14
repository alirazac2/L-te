
export enum SocialPlatform {
  Instagram = 'instagram',
  Twitter = 'twitter',
  Github = 'github',
  Linkedin = 'linkedin',
  Youtube = 'youtube',
  Facebook = 'facebook',
  Tiktok = 'tiktok',
  Email = 'email'
}

export enum ThemeType {
  Base = 'base',
  BaseDark = 'base-dark',
  BaseSoft = 'base-soft',
  BaseDev = 'base-dev',
  BlackGem = 'black-gem',
  BlackGemV2 = 'black-gem-v2',

  ModernBlack = 'modern-black',
  CleanWhite = 'clean-white',
  GradientBlue = 'gradient-blue',
  SunsetVibe = 'sunset-vibe',
  ForestGlass = 'forest-glass',
  CyberPunk = 'cyber-punk',
  SoftPastel = 'soft-pastel',
  RetroPixel = 'retro-pixel',
  NeoBrutalism = 'neo-brutalism',
  LuxuryGold = 'luxury-gold',
  IslandParadise = 'island-paradise',
  UrbanJungle = 'urban-jungle',
  MinimalistGrey = 'minimalist-grey',
  VibrantPop = 'vibrant-pop',
  CloudsDream = 'clouds-dream',
  MidnightBloom = 'midnight-bloom',
  TechBlueprint = 'tech-blueprint',
  VintagePaper = 'vintage-paper',
  NeonNight = 'neon-night',
  CoffeeHouse = 'coffee-house',
  NordicFrost = 'nordic-frost',
  TerminalConsole = 'terminal-console',
  BubbleGum = 'bubble-gum',
  SpaceOdyssey = 'space-odyssey',
  GlassPrism = 'glass-prism',
  LavaLamp = 'lava-lamp',
  SketchyNote = 'sketchy-note',
  CyberGlitch = 'cyber-glitch',
  RoyalVelvet = 'royal-velvet',
  Newspaper = 'newspaper',
  MintFresh = 'mint-fresh',
  OutlineNeon = 'outline-neon',
  CarbonFiber = 'carbon-fiber',
  SakuraSeason = 'sakura-season',
  EightBitDungeon = 'eight-bit-dungeon'
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string; // Lucide icon name
  thumbnail?: string;
  featured?: boolean;
  description?: string;
}

export interface SectionItem {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  icon?: string; // Lucide icon name
  url?: string;
  tags?: string[];
}

export interface SectionConfig {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  icon?: string;
  items: SectionItem[];
}

export interface ProfileTheme {
  type: ThemeType;
  customBackground?: string; // Optional override
  customTextColor?: string; // Optional override
  customButtonColor?: string; // Optional override
}

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  verified?: boolean;
  theme: ProfileTheme;
  socials: SocialLink[];
  links: LinkItem[];
  sections: SectionConfig[]; // Up to 4 sections
}
