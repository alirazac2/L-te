import { SocialPlatform } from '../../types';

export const SOCIAL_BASE_URLS: Record<SocialPlatform, string> = {
    [SocialPlatform.Instagram]: 'https://instagram.com/',
    [SocialPlatform.Twitter]: 'https://twitter.com/',
    [SocialPlatform.Github]: 'https://github.com/',
    [SocialPlatform.Linkedin]: 'https://linkedin.com/in/',
    [SocialPlatform.Youtube]: 'https://youtube.com/@',
    [SocialPlatform.Facebook]: 'https://facebook.com/',
    [SocialPlatform.Tiktok]: 'https://tiktok.com/@',
    [SocialPlatform.Email]: 'mailto:',
};

export const INPUT_CLASS = "w-full px-3 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-sm disabled:bg-gray-100 disabled:text-gray-500";
export const INPUT_ERROR_CLASS = "w-full px-3 py-2.5 bg-white text-gray-900 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition-all placeholder-gray-400 text-sm";
export const LABEL_CLASS = "block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5";
export const SECTION_TITLE_CLASS = "text-xs font-bold uppercase tracking-widest text-gray-400 mb-4";
export const MODAL_OVERLAY_CLASS = "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in";
export const MODAL_CONTENT_CLASS = "bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-slide-up relative";

export const isValidUrl = (string: string) => {
    if (!string) return true;
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};
