
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
  ModernBlack = 'modern-black',
  CleanWhite = 'clean-white',
  GradientBlue = 'gradient-blue',
  SunsetVibe = 'sunset-vibe',
  ForestGlass = 'forest-glass',
  CyberPunk = 'cyber-punk',
  SoftPastel = 'soft-pastel',
  RetroPixel = 'retro-pixel',
  NeoBrutalism = 'neo-brutalism',
  LuxuryGold = 'luxury-gold'
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
