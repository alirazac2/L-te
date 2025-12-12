import { UserProfile, ThemeType, SocialPlatform } from '../types';

const DEMO_PROFILES: Record<string, UserProfile> = {
  'demo': {
    username: 'demo',
    displayName: 'Sarah Creator',
    bio: 'Digital Artist & Frontend Developer building beautiful web experiences.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    verified: true,
    theme: { type: ThemeType.SunsetVibe },
    socials: [
      { platform: SocialPlatform.Twitter, url: 'https://twitter.com' },
      { platform: SocialPlatform.Instagram, url: 'https://instagram.com' },
      { platform: SocialPlatform.Github, url: 'https://github.com' },
    ],
    links: [
      { id: '1', title: 'My Latest Portfolio Work', url: '#', featured: true, thumbnail: 'https://images.unsplash.com/photo-1481487484168-9b930d5b7d9f?q=80&w=600&auto=format&fit=crop', description: 'Check out my case study on minimalistic design systems.' },
      { id: '2', title: 'Join my Newsletter', url: '#', icon: 'Mail' },
      { id: '3', title: 'Download my Resume', url: '#', icon: 'FileText' }
    ],
    projects: [
      {
        id: 'p1',
        title: 'Neon Dreams Gallery',
        description: 'An immersive photography collection capturing the cyberpunk aesthetic of rainy Tokyo nights. Includes 50+ high-res wallpapers.',
        thumbnail: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=600&auto=format&fit=crop',
        url: 'https://example.com/neon',
        tags: ['Photography', 'Art', 'Cyberpunk']
      },
      {
        id: 'p2',
        title: 'React Glassmorphism UI',
        description: 'A lightweight CSS library for creating beautiful frosted glass effects in web applications.',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
        url: 'https://github.com',
        tags: ['Code', 'Open Source', 'CSS']
      },
      {
        id: 'p3',
        title: 'AI Avatar Generator',
        description: 'Generate unique avatars using stable diffusion. Built with Python and React.',
        thumbnail: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=600&auto=format&fit=crop',
        url: '#',
        tags: ['AI', 'ML', 'Python']
      },
      {
        id: 'p4',
        title: 'Crypto Dashboard',
        description: 'Real-time tracking of top 100 cryptocurrencies with historical data visualization.',
        url: '#',
        tags: ['Finance', 'React', 'API']
      }
    ]
  },
  'nature_lens': {
    username: 'nature_lens',
    displayName: 'Alex Rivers',
    bio: 'Capturing the wild. National Geographic Contributor.',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400&auto=format&fit=crop',
    verified: true,
    theme: { type: ThemeType.ModernBlack },
    socials: [
      { platform: SocialPlatform.Instagram, url: '#' },
      { platform: SocialPlatform.Youtube, url: '#' }
    ],
    links: [
      { id: '1', title: '2024 Gallery Print Shop', url: '#', featured: true, thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=600&auto=format&fit=crop', description: 'Limited edition fine art prints available now.' },
      { id: '2', title: 'My Gear List', url: '#', icon: 'CheckCircle' },
      { id: '3', title: 'Book a Workshop', url: '#', icon: 'Calendar' }
    ],
    projects: [
      {
        id: 'np1',
        title: 'Alaska Expedition 2023',
        description: 'A 3-week journey through the Alaskan wilderness. View the full documentary.',
        thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
        url: '#',
        tags: ['Travel', 'Video']
      }
    ]
  },
  'tech_guru': {
    username: 'tech_guru',
    displayName: 'Dev Marcus',
    bio: 'Full Stack Engineer. Open Source Enthusiast.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    verified: false,
    theme: { type: ThemeType.GradientBlue },
    socials: [
      { platform: SocialPlatform.Github, url: '#' },
      { platform: SocialPlatform.Twitter, url: '#' },
      { platform: SocialPlatform.Linkedin, url: '#' }
    ],
    links: [
      { id: '1', title: 'My GitHub Profile', url: '#', icon: 'Github' },
      { id: '2', title: 'Tech Blog', url: '#', icon: 'Globe' },
      { id: '3', title: 'VS Code Setup Guide', url: '#', icon: 'FileText' }
    ],
    projects: [
       {
        id: 'tg1',
        title: 'OpenStore E-commerce',
        description: 'A headless e-commerce starter kit using Next.js and Shopify.',
        url: '#',
        tags: ['Next.js', 'E-commerce']
       },
       {
        id: 'tg2',
        title: 'DevTools CLI',
        description: 'Command line interface for scaffolding modern web projects.',
        url: '#',
        tags: ['CLI', 'Rust']
       }
    ]
  },
  'zen_yoga': {
    username: 'zen_yoga',
    displayName: 'Maya Wellness',
    bio: 'Mindfulness & Movement. RYT-500 Certified.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    verified: false,
    theme: { type: ThemeType.ForestGlass },
    socials: [
      { platform: SocialPlatform.Instagram, url: '#' },
      { platform: SocialPlatform.Tiktok, url: '#' }
    ],
    links: [
      { id: '1', title: '7-Day Morning Flow Challenge', url: '#', featured: true, thumbnail: 'https://images.unsplash.com/photo-1545205539-3ad221461a59?q=80&w=600&auto=format&fit=crop', description: 'Start your day with intention and energy.' },
      { id: '2', title: 'Join Online Classes', url: '#', icon: 'Globe' },
      { id: '3', title: 'Retreat Waitlist', url: '#', icon: 'Mail' }
    ]
  }
};

/**
 * Helper to get suggestions for the search bar
 */
export const searchProfiles = (query: string) => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return Object.values(DEMO_PROFILES).filter(p => 
    p.username.toLowerCase().includes(q) || 
    p.displayName.toLowerCase().includes(q)
  ).map(p => ({
    username: p.username,
    displayName: p.displayName,
    avatarUrl: p.avatarUrl
  }));
};

/**
 * Fetches the user profile from the static public directory or internal demo data.
 * Expects file at /profiles/{username}/db.json
 */
export const fetchProfile = async (username: string): Promise<UserProfile | null> => {
  const normalizedUser = username.toLowerCase();
  
  // 1. Check local demo data first
  if (DEMO_PROFILES[normalizedUser]) {
    return DEMO_PROFILES[normalizedUser];
  }

  // 2. Try fetching static file
  try {
    const response = await fetch(`/profiles/${username}/db.json?t=${Date.now()}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data as UserProfile;
  } catch (error) {
    console.warn(`Failed to fetch profile for ${username}`, error);
    return null;
  }
};