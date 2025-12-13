
import { UserProfile, ThemeType, SocialPlatform } from '../types';
import { fetchProfileDataOnChain, fetchAllUsernames } from './blockchain';

// Keep a minimal fallback for demo if needed, but primarily use chain
const DEMO_PROFILES: Record<string, UserProfile> = {
  'demo': {
    username: 'demo',
    displayName: 'OnChain Demo',
    bio: 'This profile is loaded from local fallback, but try searching for on-chain users!',
    avatarUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&auto=format&fit=crop',
    verified: true,
    theme: { type: ThemeType.GradientBlue },
    socials: [],
    links: [
        { id: '1', title: 'Blockchain Explorer', url: 'https://testnet.kitescan.ai', icon: 'Globe' }
    ],
    sections: [
        {
            id: 's1',
            title: 'Featured Projects',
            description: 'Check out my work',
            icon: 'Layers',
            items: [
                { id: 'p1', title: 'Example Project', description: 'This is a demo project', url: 'https://example.com' }
            ]
        }
    ]
  }
};

/**
 * Helper to get suggestions for the search bar from Blockchain
 */
export const searchProfiles = async (query: string) => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  // Fetch all usernames from chain
  // Optimization: In a real app, you might cache this or use an indexer.
  try {
      const allUsers = await fetchAllUsernames();
      const matches = allUsers.filter(u => u.toLowerCase().includes(q)).slice(0, 5);
      
      return matches.map(u => ({
          username: u,
          displayName: u, // We don't have display name without fetching individual profile
          avatarUrl: ''
      }));
  } catch (e) {
      console.warn("Search failed", e);
      return [];
  }
};

/**
 * Fetches the user profile from the blockchain.
 */
export const fetchProfile = async (username: string): Promise<UserProfile | null> => {
  const normalizedUser = username.toLowerCase();
  
  // 1. Try Blockchain
  try {
      const chainData = await fetchProfileDataOnChain(normalizedUser);
      if (chainData) return chainData;
  } catch (e) {
      console.warn(`Chain fetch failed for ${username}`, e);
  }

  // 2. Fallback to demo
  if (DEMO_PROFILES[normalizedUser]) {
    return DEMO_PROFILES[normalizedUser];
  }

  return null;
};
