
import React from 'react';
import { 
  Mail, Globe, 
  Link as LinkIcon, FileText, Calendar, CheckCircle2, AlertCircle,
  User, Star, Heart, MapPin, Phone, Camera, Music, Video, ShoppingBag, 
  CreditCard, Settings, Briefcase, Code, Coffee, Smile, Smartphone,
  Monitor, Headphones, Image, Twitch, Slack, Dribbble, Codepen,
  MessageCircle, Send, Zap, DollarSign, Gift, Award, Bookmark, Cloud, 
  Hash, Search, Play, Gamepad2, Mic, Palette, PenTool, Truck, Anchor, 
  Key, Lock, Shield, Bitcoin, Chrome, Terminal, Cpu, Database, Wifi,
  Folder, FolderOpen, Rocket, Package, Layers, GitBranch, Box,
  Ghost, MessageSquare, Pin, ArrowRight, ArrowUpRight, Sparkles, 
  Sunrise, Leaf, Waves, Target, Cpu as CpuIcon, Gamepad2 as GameIcon,
  Crown, Moon, Snowflake, Terminal as TerminalIcon, Flame, Pencil, 
  Activity, Maximize, FastForward, Flower2, Sword, Sprout,
  SquareArrowOutUpRight, MoveUpRight, ChevronRight, Share
} from 'lucide-react';
import { SocialPlatform } from '../types';

// --- FontAwesome Wrapper ---
const FaIcon = ({ icon, className }: { icon: string, className?: string }) => {
    return <i className={`${icon} ${className} flex items-center justify-center`} style={{ fontSize: '1.2em' }} aria-hidden="true" />;
};

// --- Custom/Fallback SVGs ---
const KakaoIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 5.51 2 9.84c0 2.85 1.94 5.33 4.88 6.72-.21.78-.77 2.82-.88 3.23-.14.53.19.52.4.38.27-.18 2.97-2.02 4.14-2.83.47.07.96.1 1.46.1 5.52 0 10-3.51 10-7.84S17.52 2 12 2z"/>
    </svg>
);

const InstagramIcon = (props: any) => <FaIcon icon="fa-brands fa-instagram" {...props} />;
const TwitterIcon = (props: any) => <FaIcon icon="fa-brands fa-x-twitter" {...props} />;
const GithubIcon = (props: any) => <FaIcon icon="fa-brands fa-github" {...props} />;
const LinkedinIcon = (props: any) => <FaIcon icon="fa-brands fa-linkedin" {...props} />;
const YoutubeIcon = (props: any) => <FaIcon icon="fa-brands fa-youtube" {...props} />;
const FacebookIcon = (props: any) => <FaIcon icon="fa-brands fa-facebook" {...props} />;
const TiktokIcon = (props: any) => <FaIcon icon="fa-brands fa-tiktok" {...props} />;
const WhatsappIcon = (props: any) => <FaIcon icon="fa-brands fa-whatsapp" {...props} />;
const TelegramIcon = (props: any) => <FaIcon icon="fa-brands fa-telegram" {...props} />;
const DiscordIcon = (props: any) => <FaIcon icon="fa-brands fa-discord" {...props} />;
const WechatIcon = (props: any) => <FaIcon icon="fa-brands fa-weixin" {...props} />;
const LineIcon = (props: any) => <FaIcon icon="fa-brands fa-line" {...props} />;
const QqIcon = (props: any) => <FaIcon icon="fa-brands fa-qq" {...props} />;
const SnapchatIcon = (props: any) => <FaIcon icon="fa-brands fa-snapchat" {...props} />;
const RedditIcon = (props: any) => <FaIcon icon="fa-brands fa-reddit" {...props} />;
const PinterestIcon = (props: any) => <FaIcon icon="fa-brands fa-pinterest" {...props} />;
const SpotifyIcon = (props: any) => <FaIcon icon="fa-brands fa-spotify" {...props} />;
const WeiboIcon = (props: any) => <FaIcon icon="fa-brands fa-weibo" {...props} />;

export const getSocialIcon = (platform: SocialPlatform, className?: string) => {
  const props = { className: className || "w-5 h-5" };
  switch (platform) {
    case SocialPlatform.Instagram: return <InstagramIcon {...props} />;
    case SocialPlatform.Twitter: return <TwitterIcon {...props} />;
    case SocialPlatform.Github: return <GithubIcon {...props} />;
    case SocialPlatform.Linkedin: return <LinkedinIcon {...props} />;
    case SocialPlatform.Youtube: return <YoutubeIcon {...props} />;
    case SocialPlatform.Facebook: return <FacebookIcon {...props} />;
    case SocialPlatform.Tiktok: return <TiktokIcon {...props} />;
    case SocialPlatform.Email: return <Mail {...props} />;
    case SocialPlatform.Whatsapp: return <WhatsappIcon {...props} />;
    case SocialPlatform.Telegram: return <TelegramIcon {...props} />;
    case SocialPlatform.Discord: return <DiscordIcon {...props} />;
    case SocialPlatform.Wechat: return <WechatIcon {...props} />;
    case SocialPlatform.Line: return <LineIcon {...props} />;
    case SocialPlatform.Qq: return <QqIcon {...props} />;
    case SocialPlatform.Kakaotalk: return <KakaoIcon {...props} />;
    case SocialPlatform.Snapchat: return <SnapchatIcon {...props} />;
    case SocialPlatform.Reddit: return <RedditIcon {...props} />;
    case SocialPlatform.Pinterest: return <PinterestIcon {...props} />;
    case SocialPlatform.Spotify: return <SpotifyIcon {...props} />;
    case SocialPlatform.Weibo: return <WeiboIcon {...props} />;
    default: return <Globe {...props} />;
  }
};

const ICON_MAP: Record<string, React.FC<any>> = {
  Instagram: InstagramIcon, 
  Twitter: TwitterIcon, 
  X: TwitterIcon,
  Github: GithubIcon, 
  Linkedin: LinkedinIcon, 
  Youtube: YoutubeIcon, 
  Facebook: FacebookIcon,
  TikTok: TiktokIcon,
  WhatsApp: WhatsappIcon,
  Telegram: TelegramIcon,
  Discord: DiscordIcon,
  WeChat: WechatIcon,
  Line: LineIcon,
  QQ: QqIcon,
  Weibo: WeiboIcon,
  Kakao: KakaoIcon,
  Reddit: RedditIcon,
  Pinterest: PinterestIcon,
  Spotify: SpotifyIcon,
  Snapchat: SnapchatIcon,
  
  Globe, Link: LinkIcon, Mail, FileText, Calendar, User, Star, Heart, MapPin, Phone, Search,
  Camera, Music, Video, Image, Play, Mic, Headphones, Monitor, Smartphone,
  ShoppingBag, CreditCard, Briefcase, DollarSign, Gift, Award, Truck,
  Settings, Code, Terminal, Cpu, Database, Wifi, Cloud, Hash, Palette, PenTool, 
  Folder, FolderOpen, Rocket, Package, Layers, GitBranch, Box,
  Coffee, Smile, MessageCircle, MessageSquare, Send, Zap, Bookmark, Anchor, Key, Lock, Shield, CheckCircle2, AlertCircle, Pin, Ghost, Gamepad2,
  ArrowRight, ArrowUpRight, Sparkles, Sunrise, Leaf, Waves, Target, CpuIcon, GameIcon,
  Crown, Moon, Snowflake, TerminalIcon, Flame, Pencil, Activity, Maximize, FastForward, Flower2, Sword, Sprout,
  SquareArrowOutUpRight, MoveUpRight, ChevronRight, Share
};

export const getGenericIcon = (name: string | undefined | null, className?: string) => {
  const props = { className: className || "w-5 h-5" };
  if (!name || typeof name !== 'string') return <LinkIcon {...props} />;
  const normalizedName = name.trim();
  let IconComponent = ICON_MAP[normalizedName];
  if (!IconComponent) {
      const key = Object.keys(ICON_MAP).find(k => k.toLowerCase() === normalizedName.toLowerCase());
      if (key) IconComponent = ICON_MAP[key];
  }
  if (!IconComponent) return <LinkIcon {...props} />;
  return <IconComponent {...props} />;
};

export const ICON_OPTIONS = Object.keys(ICON_MAP).sort();
