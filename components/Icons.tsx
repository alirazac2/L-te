import React from 'react';
import { 
  Instagram, Twitter, Github, Linkedin, Youtube, Facebook, Mail, Globe, 
  Link as LinkIcon, FileText, Calendar, CheckCircle2, AlertCircle,
  User, Star, Heart, MapPin, Phone, Camera, Music, Video, ShoppingBag, 
  CreditCard, Settings, Briefcase, Code, Coffee, Smile, Smartphone,
  Monitor, Headphones, Image, Twitch, Slack, Dribbble, Codepen,
  MessageCircle, Send, Zap, DollarSign, Gift, Award, Bookmark, Cloud, 
  Hash, Search, Play, Gamepad2, Mic, Palette, PenTool, Truck, Anchor, 
  Key, Lock, Shield, Bitcoin, Chrome, Terminal, Cpu, Database, Wifi
} from 'lucide-react';
import { SocialPlatform } from '../types';

export const getSocialIcon = (platform: SocialPlatform, className?: string) => {
  const props = { className: className || "w-5 h-5" };
  switch (platform) {
    case SocialPlatform.Instagram: return <Instagram {...props} />;
    case SocialPlatform.Twitter: return <Twitter {...props} />;
    case SocialPlatform.Github: return <Github {...props} />;
    case SocialPlatform.Linkedin: return <Linkedin {...props} />;
    case SocialPlatform.Youtube: return <Youtube {...props} />;
    case SocialPlatform.Facebook: return <Facebook {...props} />;
    case SocialPlatform.Tiktok: return <Music {...props} />; 
    case SocialPlatform.Email: return <Mail {...props} />;
    default: return <Globe {...props} />;
  }
};

// Map of all available icons for the picker
const ICON_MAP: Record<string, React.FC<any>> = {
  // Socials & Brands
  Instagram, Twitter, Github, Linkedin, Youtube, Facebook, Twitch, Slack, Dribbble, Codepen, Chrome, Bitcoin,
  
  // Essentials
  Globe, Link: LinkIcon, Mail, FileText, Calendar, User, Star, Heart, MapPin, Phone, Search,
  
  // Media
  Camera, Music, Video, Image, Play, Mic, Headphones, Monitor, Smartphone,
  
  // Commerce & Business
  ShoppingBag, CreditCard, Briefcase, DollarSign, Gift, Award, Truck,
  
  // Tech & Tools
  Settings, Code, Terminal, Cpu, Database, Wifi, Cloud, Hash, Palette, PenTool, Gamepad2,
  
  // Misc
  Coffee, Smile, MessageCircle, Send, Zap, Bookmark, Anchor, Key, Lock, Shield, CheckCircle2, AlertCircle
};

export const getGenericIcon = (name: string, className?: string) => {
  const props = { className: className || "w-5 h-5" };
  const normalizedName = name.trim();
  
  // 1. Try direct match
  let IconComponent = ICON_MAP[normalizedName];

  // 2. Try case-insensitive match
  if (!IconComponent) {
      const key = Object.keys(ICON_MAP).find(k => k.toLowerCase() === normalizedName.toLowerCase());
      if (key) IconComponent = ICON_MAP[key];
  }

  // 3. Fallback
  if (!IconComponent) return <LinkIcon {...props} />;

  return <IconComponent {...props} />;
};

export const ICON_OPTIONS = Object.keys(ICON_MAP).sort();