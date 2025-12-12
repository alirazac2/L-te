import React, { useState, useEffect, useMemo } from 'react';
import ProfileView from './ProfileView';
import { UserProfile, ThemeType, SocialPlatform, LinkItem, ProjectItem, ProfileTheme } from '../types';
import { UploadCloud, Plus, Trash2, Eye, Save, ArrowLeft, RefreshCw, X, Edit2, Check, ExternalLink, ChevronDown, ChevronUp, Search, Smartphone, Palette, Wallet, Loader2, UserPlus, Lock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSocialIcon, getGenericIcon, ICON_OPTIONS } from './Icons';
import { connectWallet, publishProfile, getProfileAddress, getUsernameByWallet, fetchProfileDataOnChain, checkWalletConnection } from '../services/blockchain';
import { Toast, ToastType } from './Toast';

// --- Constants & Helpers ---

const DEFAULT_PROFILE: UserProfile = {
  username: '',
  displayName: 'New Creator',
  bio: 'Welcome to my on-chain profile!',
  avatarUrl: '',
  verified: false,
  theme: { type: ThemeType.ModernBlack },
  socials: [],
  links: [
    { id: '1', title: 'My First Link', url: 'https://example.com', icon: 'Link' }
  ],
  projects: []
};

const SOCIAL_BASE_URLS: Record<SocialPlatform, string> = {
    [SocialPlatform.Instagram]: 'https://instagram.com/',
    [SocialPlatform.Twitter]: 'https://twitter.com/',
    [SocialPlatform.Github]: 'https://github.com/',
    [SocialPlatform.Linkedin]: 'https://linkedin.com/in/',
    [SocialPlatform.Youtube]: 'https://youtube.com/@',
    [SocialPlatform.Facebook]: 'https://facebook.com/',
    [SocialPlatform.Tiktok]: 'https://tiktok.com/@',
    [SocialPlatform.Email]: 'mailto:',
};

const INPUT_CLASS = "w-full px-3 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-sm disabled:bg-gray-100 disabled:text-gray-500";
const INPUT_ERROR_CLASS = "w-full px-3 py-2.5 bg-white text-gray-900 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition-all placeholder-gray-400 text-sm";
const LABEL_CLASS = "block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5";
const SECTION_TITLE_CLASS = "text-xs font-bold uppercase tracking-widest text-gray-400 mb-4";
const MODAL_OVERLAY_CLASS = "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in";
const MODAL_CONTENT_CLASS = "bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-slide-up relative";

// --- Helpers ---

const isValidUrl = (string: string) => {
    if (!string) return true; // Optional fields can be empty
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

// --- Types for Modal State ---

type ModalType = 'link' | 'project' | 'social' | null;

interface ModalState {
    type: ModalType;
    index: number | null; // null means adding new
    data: any;
}

const CreateProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  // Store initial profile as string for easy deep comparison
  const [initialProfileJson, setInitialProfileJson] = useState<string>(JSON.stringify(DEFAULT_PROFILE));
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  
  // Wallet & Auth State
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [hasRegisteredProfile, setHasRegisteredProfile] = useState(false);
  const [isCheckingWallet, setIsCheckingWallet] = useState(true); // Start checking immediately
  
  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Validation State
  const [identityErrors, setIdentityErrors] = useState<Record<string, string>>({});
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});

  // Modal State
  const [modal, setModal] = useState<ModalState>({ type: null, index: null, data: null });
  
  // UI State for specific interactions
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showCustomColors, setShowCustomColors] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  // Toast State
  const [toast, setToast] = useState<{ msg: string; type: ToastType; visible: boolean }>({
    msg: '', type: 'info', visible: false
  });

  const showToast = (msg: string, type: ToastType = 'info') => {
      setToast({ msg, type, visible: true });
  };

  // Derived Dirty State
  const isDirty = useMemo(() => {
      return JSON.stringify(profile) !== initialProfileJson;
  }, [profile, initialProfileJson]);

  // --- Wallet & Initial Load ---

  useEffect(() => {
      // Auto-connect on mount if previously connected
      const init = async () => {
          setIsCheckingWallet(true);
          const conn = await checkWalletConnection();
          if (conn) {
              setWalletAddress(conn.address);
              setSigner(conn.signer);
              await checkUserRegistration(conn.address);
          } else {
              setIsCheckingWallet(false);
          }
      };
      init();
  }, []);

  const handleConnect = async () => {
      try {
          const { address, signer: s } = await connectWallet();
          setWalletAddress(address);
          setSigner(s);
          checkUserRegistration(address);
      } catch (e) {
          showToast("Failed to connect wallet", "error");
      }
  };

  const checkUserRegistration = async (address: string) => {
      setIsCheckingWallet(true);
      try {
          const existingUsername = await getUsernameByWallet(address);
          if (existingUsername) {
              setHasRegisteredProfile(true);
              // Fetch the existing data
              const data = await fetchProfileDataOnChain(existingUsername);
              if (data) {
                  setProfile(data);
                  setInitialProfileJson(JSON.stringify(data));
              } else {
                  // Fallback if data is corrupted but username exists
                  const recoveryProfile = {...DEFAULT_PROFILE, username: existingUsername};
                  setProfile(recoveryProfile);
                  setInitialProfileJson(JSON.stringify(recoveryProfile));
              }
          } else {
              setHasRegisteredProfile(false);
              setProfile(DEFAULT_PROFILE);
              setInitialProfileJson(JSON.stringify(DEFAULT_PROFILE));
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsCheckingWallet(false);
      }
  };

  // --- Handlers ---

  const handleIdentityChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => {
        const newState = { ...prev, [field]: value };
        if (field === 'username') {
             // Strict username validation: remove spaces and special chars immediately
             const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
             newState.username = clean;
             
             if (!hasRegisteredProfile) {
                 checkUsername(clean);
             }
        }
        return newState;
    });

    // Real-time Validation for Identity Fields
    if (field === 'avatarUrl') {
        if (value && !isValidUrl(value)) {
            setIdentityErrors(prev => ({ ...prev, avatarUrl: "Please enter a valid URL (https://...)" }));
        } else {
            setIdentityErrors(prev => { const n = { ...prev }; delete n.avatarUrl; return n; });
        }
    }
  };

  // Debounced check for username (only for new users)
  useEffect(() => {
      if (hasRegisteredProfile) return;
      const timer = setTimeout(() => {
          if (profile.username.length > 2) {
              checkUsername(profile.username);
          } else {
              setUsernameStatus('idle');
          }
      }, 800);
      return () => clearTimeout(timer);
  }, [profile.username, hasRegisteredProfile]);

  const checkUsername = async (u: string) => {
      if (u.length < 3) return;
      setUsernameStatus('checking');
      const addr = await getProfileAddress(u);
      if (addr) {
          setUsernameStatus('taken');
      } else {
          setUsernameStatus('available');
      }
  };

  const handleThemeChange = (type: ThemeType, customKey?: keyof ProfileTheme, customValue?: string) => {
    setProfile(prev => {
        const newTheme = { ...prev.theme, type };
        if (customKey) {
            newTheme[customKey] = customValue as any;
        }
        return { ...prev, theme: newTheme };
    });
  };

  const deleteItem = (type: 'link' | 'project' | 'social', index: number) => {
      if (!window.confirm("Are you sure you want to delete this item?")) return;
      
      setProfile(prev => {
          const newData = { ...prev };
          if (type === 'link') newData.links = prev.links.filter((_, i) => i !== index);
          if (type === 'project') newData.projects = prev.projects?.filter((_, i) => i !== index);
          if (type === 'social') newData.socials = prev.socials.filter((_, i) => i !== index);
          return newData;
      });
      showToast("Item deleted", "info");
  };

  const moveItem = (type: 'link' | 'project' | 'social', index: number, direction: 'up' | 'down') => {
    setProfile(prev => {
        const newData = { ...prev };
        let list: any[] = [];
        
        if (type === 'link') list = [...prev.links];
        else if (type === 'project') list = [...(prev.projects || [])];
        else if (type === 'social') list = [...prev.socials];

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= list.length) return prev;
        [list[index], list[newIndex]] = [list[newIndex], list[index]];

        if (type === 'link') newData.links = list;
        else if (type === 'project') newData.projects = list;
        else if (type === 'social') newData.socials = list;

        return newData;
    });
  };

  const openModal = (type: ModalType, index: number | null) => {
      let data = {};
      setShowPlatformDropdown(false);
      setModalErrors({});

      if (index !== null) {
          if (type === 'link') data = { ...profile.links[index] };
          if (type === 'project') data = { ...profile.projects![index] };
          if (type === 'social') data = { ...profile.socials[index] };
      } else {
          if (type === 'link') data = { id: Date.now().toString(), title: '', url: '', icon: 'Link', featured: false };
          if (type === 'project') data = { id: Date.now().toString(), title: '', description: '', url: '', tags: [] };
          if (type === 'social') data = { platform: SocialPlatform.Instagram, url: '' };
      }
      setModal({ type, index, data });
  };

  const closeModal = () => setModal({ type: null, index: null, data: null });

  const saveModalData = () => {
      if (!modal.type || !modal.data) return;

      const newErrors: Record<string, string> = {};

      // --- Validation Logic ---
      if (modal.type === 'link') {
          if (!modal.data.title?.trim()) newErrors.title = "Title is required";
          if (!modal.data.url?.trim()) newErrors.url = "URL is required";
          else if (!isValidUrl(modal.data.url)) newErrors.url = "Invalid URL format";
          
          if (modal.data.featured && modal.data.thumbnail && !isValidUrl(modal.data.thumbnail)) {
              newErrors.thumbnail = "Invalid Thumbnail URL";
          }
      } 
      else if (modal.type === 'project') {
          if (!modal.data.title?.trim()) newErrors.title = "Title is required";
          if (modal.data.url && !isValidUrl(modal.data.url)) newErrors.url = "Invalid URL format";
          if (modal.data.thumbnail && !isValidUrl(modal.data.thumbnail)) newErrors.thumbnail = "Invalid Thumbnail URL";
      }
      else if (modal.type === 'social') {
           if (!modal.data.url?.trim()) newErrors.url = "Username or URL is required";
           // Social handles partial inputs (usernames), so full URL validation happens on construct, but simple check here
      }

      if (Object.keys(newErrors).length > 0) {
          setModalErrors(newErrors);
          return;
      }

      // --- Saving Logic ---
      setProfile(prev => {
          const newData = { ...prev };
          if (modal.type === 'link') {
              const list = [...prev.links];
              if (modal.index !== null) list[modal.index] = modal.data;
              else list.push(modal.data);
              newData.links = list;
          } else if (modal.type === 'project') {
              const list = [...(prev.projects || [])];
              if (modal.index !== null) list[modal.index] = modal.data;
              else list.push(modal.data);
              newData.projects = list;
          } else if (modal.type === 'social') {
              const rawUrl = modal.data.url.trim();
              const platform = modal.data.platform;
              let finalUrl = rawUrl;
              if (rawUrl && !rawUrl.match(/^https?:\/\//i) && !rawUrl.startsWith('mailto:')) {
                  const cleanHandle = rawUrl.replace(/^@/, '');
                  finalUrl = (SOCIAL_BASE_URLS[platform as SocialPlatform] || '') + cleanHandle;
              }
              const socialData = { ...modal.data, url: finalUrl };
              const list = [...prev.socials];
              if (modal.index !== null) list[modal.index] = socialData;
              else list.push(socialData);
              newData.socials = list;
          }
          return newData;
      });
      closeModal();
      showToast("Changes saved locally", "success");
  };

  const updateModalData = (field: string, value: any) => {
      setModal(prev => ({ ...prev, data: { ...prev.data, [field]: value } }));
      // Clear error for field on change
      if (modalErrors[field]) {
          setModalErrors(prev => { const n = {...prev}; delete n[field]; return n; });
      }
  };
  
  const filteredIcons = ICON_OPTIONS.filter(icon => 
    icon.toLowerCase().includes(iconSearch.toLowerCase())
  );

  // --- Publish Logic ---

  const handlePublish = async () => {
      if (!walletAddress || !signer) {
          showToast("Please connect your wallet first", "error");
          return;
      }
      // Final Validation before publish
      if (!profile.username || profile.username.length < 3) {
          showToast("Username must be at least 3 characters", "error");
          return;
      }
      if (Object.keys(identityErrors).length > 0) {
          showToast("Please fix validation errors before saving", "error");
          return;
      }

      setIsPublishing(true);
      setPublishStatus(hasRegisteredProfile ? "Updating profile..." : "Minting username...");
      
      try {
          // Perform the chain transaction
          await publishProfile(profile.username, profile, signer, (status) => {
              setPublishStatus(status);
          });
          
          showToast(hasRegisteredProfile ? "Profile updated successfully!" : "Profile minted successfully!", "success");
          
          // Update the "Clean" state so the save button disables
          setInitialProfileJson(JSON.stringify(profile));

          // Seamless transition logic
          if (!hasRegisteredProfile) {
              setPublishStatus("Finalizing...");
              await checkUserRegistration(walletAddress); 
          }

      } catch (e: any) {
          console.error(e);
          showToast("Error publishing: " + (e.message || "Unknown error"), "error");
          setPublishStatus("Failed.");
      } finally {
          setIsPublishing(false);
      }
  };


  // --- CONDITIONAL RENDERING ---

  // 1. Loading User Status
  if (isCheckingWallet) {
      return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Checking connection...</p>
          </div>
      );
  }

  // 2. Not Connected
  if (!walletAddress) {
      return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
               <Toast message={toast.msg} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
               <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                   <Wallet className="w-8 h-8" />
               </div>
               <h1 className="text-3xl font-bold text-gray-900 mb-4">Connect to Mint</h1>
               <p className="text-gray-500 max-w-md mb-8">
                   You need to connect your wallet to Create or Edit your on-chain identity on the KiteAI Testnet.
               </p>
               <button 
                    onClick={handleConnect}
                    className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-bold text-lg transition-all shadow-lg shadow-indigo-200"
                >
                    <Wallet className="w-5 h-5" /> Connect Wallet
                </button>
                <Link to="/" className="mt-8 text-sm text-gray-400 hover:text-gray-900 font-medium">Back to Home</Link>
          </div>
      );
  }

  // 3. Registration Mode (Connect but No Profile)
  if (!hasRegisteredProfile) {
      return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fade-in relative">
              <Toast message={toast.msg} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
              
              <Link to="/" className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                 <ArrowLeft className="w-6 h-6" />
              </Link>

              <div className="max-w-md w-full">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl mb-6">
                        <UserPlus className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Claim Identity</h1>
                    <p className="text-gray-500 mt-2">Choose your unique username to start.</p>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Username</label>
                        <div className="relative mb-6">
                            <input 
                                autoFocus
                                type="text" 
                                value={profile.username} 
                                onChange={e => handleIdentityChange('username', e.target.value)} 
                                className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl outline-none transition-all ${
                                    usernameStatus === 'taken' ? 'border-red-300 focus:border-red-500 bg-red-50/50' : 
                                    usernameStatus === 'available' ? 'border-green-300 focus:border-green-500 bg-green-50/50' : 
                                    'border-gray-200 focus:border-indigo-500 focus:bg-white'
                                }`}
                                placeholder="e.g. crypto_king" 
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                {usernameStatus === 'checking' && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
                                {usernameStatus === 'taken' && <span className="text-sm font-bold text-red-500 flex items-center gap-1"><X className="w-4 h-4"/> Taken</span>}
                                {usernameStatus === 'available' && <span className="text-sm font-bold text-green-600 flex items-center gap-1"><Check className="w-4 h-4"/> Available</span>}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Only letters, numbers, and underscores. No spaces.</p>
                        </div>

                        <button 
                            onClick={handlePublish}
                            disabled={isPublishing || usernameStatus !== 'available' || profile.username.length < 3}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isPublishing ? <Loader2 className="w-5 h-5 animate-spin"/> : <UploadCloud className="w-5 h-5" />}
                            {isPublishing ? publishStatus : 'Mint Profile'}
                        </button>
                        
                        <p className="text-xs text-center text-gray-400 mt-4">
                            Minting requires a small gas fee on KiteAI Testnet.
                        </p>
                  </div>
              </div>
          </div>
      );
  }

  // 4. Editor Mode (Has Profile)
  return (
    <div className="flex flex-col md:flex-row h-screen bg-white text-gray-900 overflow-hidden font-sans relative">
        <Toast message={toast.msg} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />

        {/* Editor Sidebar */}
        <div className={`
            w-full md:w-1/2 lg:w-5/12 h-full flex flex-col bg-white border-r border-gray-200 shadow-2xl z-20 transition-transform duration-300 ease-in-out
            ${viewMode === 'preview' ? '-translate-x-full absolute md:static md:translate-x-0' : 'translate-x-0'}
        `}>
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <Link to="/" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>
                        <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                             <div className="w-2 h-2 rounded-full bg-green-500"></div> Online
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handlePublish}
                        disabled={!isDirty || isPublishing || Object.keys(identityErrors).length > 0}
                        title={!isDirty ? "No changes to save" : "Save changes"}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isPublishing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                        <span className="hidden sm:inline">{isPublishing ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>

            {/* Status Bar for Publishing */}
            {isPublishing && (
                <div className="bg-indigo-50 px-6 py-2 text-xs font-medium text-indigo-700 border-b border-indigo-100 flex items-center gap-2 animate-fade-in">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {publishStatus}
                </div>
            )}

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10 scrollbar-thin">
                
                {/* 1. Identity */}
                <section>
                    <h2 className={SECTION_TITLE_CLASS}>On-Chain Identity</h2>
                    <div className="grid gap-5">
                        <div className="opacity-70">
                            <label className={LABEL_CLASS}>Username (Locked)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={profile.username} 
                                    disabled
                                    className={`${INPUT_CLASS} bg-gray-100 cursor-not-allowed`} 
                                />
                                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>Display Name</label>
                            <input type="text" value={profile.displayName} onChange={e => handleIdentityChange('displayName', e.target.value)} className={INPUT_CLASS} />
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>Bio</label>
                            <textarea value={profile.bio} onChange={e => handleIdentityChange('bio', e.target.value)} className={INPUT_CLASS} rows={3} />
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>Avatar URL</label>
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={profile.avatarUrl} 
                                        onChange={e => handleIdentityChange('avatarUrl', e.target.value)} 
                                        placeholder="https://..." 
                                        className={identityErrors.avatarUrl ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                    />
                                    {profile.avatarUrl && isValidUrl(profile.avatarUrl) && <img src={profile.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt="Avatar preview" />}
                                </div>
                                {identityErrors.avatarUrl && (
                                    <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3"/> {identityErrors.avatarUrl}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                             <input type="checkbox" id="verified" checked={profile.verified} onChange={e => handleIdentityChange('verified', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                             <label htmlFor="verified" className="text-sm font-medium text-gray-700 cursor-pointer select-none">Show Verified Badge</label>
                        </div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* 2. Theme */}
                <section>
                    <h2 className={SECTION_TITLE_CLASS}>Theme</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {Object.values(ThemeType).map(theme => (
                            <button
                                key={theme}
                                onClick={() => handleThemeChange(theme)}
                                className={`
                                    p-3 rounded-xl border text-sm font-medium text-left capitalize transition-all duration-200
                                    ${profile.theme.type === theme 
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500 shadow-sm' 
                                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}
                                `}
                            >
                                {theme.replace('-', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Custom Color Overrides */}
                    <button 
                        onClick={() => setShowCustomColors(!showCustomColors)}
                        className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors uppercase tracking-wide"
                    >
                        <Palette className="w-4 h-4" /> 
                        {showCustomColors ? 'Hide Custom Colors' : 'Customize Colors'}
                    </button>

                    {showCustomColors && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-slide-up">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={LABEL_CLASS}>Background Override</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="color" 
                                            value={profile.theme.customBackground || '#ffffff'} 
                                            onChange={(e) => handleThemeChange(profile.theme.type, 'customBackground', e.target.value)} 
                                            className="w-10 h-10 p-1 rounded cursor-pointer border border-gray-300 bg-white" 
                                        />
                                        <input 
                                            type="text" 
                                            value={profile.theme.customBackground || ''} 
                                            onChange={(e) => handleThemeChange(profile.theme.type, 'customBackground', e.target.value)} 
                                            placeholder="#HEX or URL" 
                                            className={INPUT_CLASS} 
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Accepts Hex color or CSS value</p>
                                </div>
                                <div>
                                     <label className={LABEL_CLASS}>Text Color Override</label>
                                     <div className="flex gap-2">
                                        <input 
                                            type="color" 
                                            value={profile.theme.customTextColor || '#000000'} 
                                            onChange={(e) => handleThemeChange(profile.theme.type, 'customTextColor', e.target.value)} 
                                            className="w-10 h-10 p-1 rounded cursor-pointer border border-gray-300 bg-white" 
                                        />
                                        <input 
                                            type="text" 
                                            value={profile.theme.customTextColor || ''} 
                                            onChange={(e) => handleThemeChange(profile.theme.type, 'customTextColor', e.target.value)} 
                                            placeholder="#HEX" 
                                            className={INPUT_CLASS} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <hr className="border-gray-100" />

                 {/* 3. Projects List */}
                 <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 m-0">Projects</h2>
                        <button onClick={() => openModal('project', null)} className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {profile.projects && profile.projects.length > 0 ? (
                            profile.projects.map((proj, idx) => (
                                <div key={proj.id || idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                                            {proj.thumbnail ? <img src={proj.thumbnail} className="w-full h-full object-cover" /> : <ExternalLink className="w-4 h-4" />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-sm text-gray-800 truncate">{proj.title || "Untitled Project"}</div>
                                            <div className="text-xs text-gray-400 truncate max-w-[150px]">{proj.description}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="flex flex-col mr-2">
                                            <button 
                                                onClick={() => moveItem('project', idx, 'up')} 
                                                disabled={idx === 0}
                                                className="p-0.5 text-gray-300 hover:text-indigo-600 disabled:opacity-20"
                                            >
                                                <ChevronUp className="w-3 h-3" />
                                            </button>
                                            <button 
                                                onClick={() => moveItem('project', idx, 'down')} 
                                                disabled={idx === (profile.projects?.length || 0) - 1}
                                                className="p-0.5 text-gray-300 hover:text-indigo-600 disabled:opacity-20"
                                            >
                                                <ChevronDown className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button onClick={() => openModal('project', idx)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => deleteItem('project', idx)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                <p className="text-gray-400 text-sm font-medium">No projects added yet.</p>
                            </div>
                        )}
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* 4. Links List */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 m-0">Links</h2>
                        <button onClick={() => openModal('link', null)} className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                    </div>

                    <div className="space-y-2">
                        {profile.links.length > 0 ? (
                            profile.links.map((link, idx) => (
                                <div key={link.id || idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                            {getGenericIcon(link.icon || 'Link', "w-4 h-4")}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-sm text-gray-800 truncate">{link.title || "Untitled Link"}</div>
                                            {link.featured && <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">Featured Card</div>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="flex flex-col mr-2">
                                            <button 
                                                onClick={() => moveItem('link', idx, 'up')} 
                                                disabled={idx === 0}
                                                className="p-0.5 text-gray-300 hover:text-indigo-600 disabled:opacity-20"
                                            >
                                                <ChevronUp className="w-3 h-3" />
                                            </button>
                                            <button 
                                                onClick={() => moveItem('link', idx, 'down')} 
                                                disabled={idx === profile.links.length - 1}
                                                className="p-0.5 text-gray-300 hover:text-indigo-600 disabled:opacity-20"
                                            >
                                                <ChevronDown className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button onClick={() => openModal('link', idx)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => deleteItem('link', idx)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                <p className="text-gray-400 text-sm font-medium">No links added yet.</p>
                            </div>
                        )}
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* 5. Socials List */}
                <section className="pb-12">
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 m-0">Social Icons</h2>
                        <button onClick={() => openModal('social', null)} className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                    </div>
                     <div className="space-y-2">
                        {profile.socials.length > 0 ? (
                            profile.socials.map((social, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                                            {getSocialIcon(social.platform, "w-4 h-4")}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-sm text-gray-800 capitalize">{social.platform}</div>
                                            <div className="text-xs text-gray-400 truncate max-w-[150px]">{social.url}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="flex flex-col mr-2">
                                            <button 
                                                onClick={() => moveItem('social', idx, 'up')} 
                                                disabled={idx === 0}
                                                className="p-0.5 text-gray-300 hover:text-indigo-600 disabled:opacity-20"
                                            >
                                                <ChevronUp className="w-3 h-3" />
                                            </button>
                                            <button 
                                                onClick={() => moveItem('social', idx, 'down')} 
                                                disabled={idx === profile.socials.length - 1}
                                                className="p-0.5 text-gray-300 hover:text-indigo-600 disabled:opacity-20"
                                            >
                                                <ChevronDown className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button onClick={() => openModal('social', idx)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => deleteItem('social', idx)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                <p className="text-gray-400 text-sm font-medium">No social icons added.</p>
                            </div>
                        )}
                     </div>
                </section>
            </div>
        </div>

        {/* Mobile View Toggle - Fixed Position */}
        <div className="md:hidden fixed bottom-6 right-6 z-50">
            <button 
                onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] font-bold hover:bg-indigo-700 transition-all active:scale-95 border border-indigo-500"
            >
                {viewMode === 'edit' ? <><Smartphone className="w-5 h-5"/> Preview</> : <><Edit2 className="w-5 h-5"/> Edit</>}
            </button>
        </div>

        {/* Preview Area (Right Side) */}
        <div className={`
            w-full md:w-1/2 lg:w-7/12 h-full flex flex-col items-center justify-center relative transition-all duration-300
            ${viewMode === 'edit' ? 'hidden md:flex bg-gray-50/50' : 'flex absolute inset-0 z-30 bg-white md:static md:bg-gray-50/50'}
        `}>
             {/* Background Pattern for Desktop */}
             <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] hidden md:block opacity-70"></div>

            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 hidden md:block animate-fade-in">
                Live Preview
            </div>

            <div className={`
                relative mx-auto transition-all duration-500 ease-in-out bg-white overflow-hidden
                ${viewMode === 'preview' 
                    ? 'w-full h-full md:w-[375px] md:h-[750px] md:border-[12px] md:rounded-[3rem] md:shadow-2xl md:ring-1 md:ring-black/5' 
                    : 'w-[375px] h-[750px] border-[12px] rounded-[3rem] shadow-2xl ring-1 ring-black/5'
                }
                md:border-gray-900 md:bg-gray-900
            `}>
                {/* Mobile Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-20 hidden md:block"></div>
                
                {/* Screen Content */}
                <div className="w-full h-full bg-white overflow-hidden relative md:rounded-[2.2rem]">
                    <div className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth">
                        <ProfileView initialData={profile} />
                    </div>
                </div>
            </div>
        </div>

        {/* --- MODALS (Link/Project/Social) Code below is identical to previous logic --- */}
        {modal.type === 'link' && modal.data && (
            <div className={MODAL_OVERLAY_CLASS}>
                <div className={MODAL_CONTENT_CLASS}>
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg">{modal.index === null ? 'Add New Link' : 'Edit Link'}</h3>
                        <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label className={LABEL_CLASS}>Title <span className="text-red-500">*</span></label>
                            <input 
                                autoFocus 
                                type="text" 
                                value={modal.data.title} 
                                onChange={e => updateModalData('title', e.target.value)} 
                                className={modalErrors.title ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                placeholder="e.g. My Website" 
                            />
                            {modalErrors.title && <span className="text-xs text-red-500 font-medium">{modalErrors.title}</span>}
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>URL <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                value={modal.data.url} 
                                onChange={e => updateModalData('url', e.target.value)} 
                                className={modalErrors.url ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                placeholder="https://..." 
                            />
                             {modalErrors.url && <span className="text-xs text-red-500 font-medium">{modalErrors.url}</span>}
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <div className="flex items-center gap-3 mb-4">
                                <input type="checkbox" id="modal-feat" checked={modal.data.featured} onChange={e => updateModalData('featured', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                <label htmlFor="modal-feat" className="font-bold text-sm text-gray-700 select-none">Featured Card Layout</label>
                             </div>
                             
                             {modal.data.featured ? (
                                 <div className="space-y-3 animate-fade-in">
                                     <div>
                                         <label className={LABEL_CLASS}>Thumbnail URL</label>
                                         <input 
                                            type="text" 
                                            value={modal.data.thumbnail || ''} 
                                            onChange={e => updateModalData('thumbnail', e.target.value)} 
                                            className={modalErrors.thumbnail ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                            placeholder="https://image..." 
                                         />
                                          {modalErrors.thumbnail && <span className="text-xs text-red-500 font-medium">{modalErrors.thumbnail}</span>}
                                     </div>
                                     <div>
                                         <label className={LABEL_CLASS}>Description</label>
                                         <input type="text" value={modal.data.description || ''} onChange={e => updateModalData('description', e.target.value)} className={INPUT_CLASS} placeholder="Short text..." />
                                     </div>
                                 </div>
                             ) : (
                                 <div className="animate-fade-in">
                                     <label className={LABEL_CLASS}>Icon</label>
                                     <button 
                                        onClick={() => { setShowIconPicker(true); setIconSearch(''); }}
                                        className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between hover:border-indigo-500 hover:ring-2 hover:ring-indigo-50 transition-all group"
                                     >
                                         <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                 {getGenericIcon(modal.data.icon || 'Link', "w-6 h-6")}
                                             </div>
                                             <div className="text-left">
                                                 <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Selected</div>
                                                 <div className="font-semibold text-gray-900">{modal.data.icon || 'Link'}</div>
                                             </div>
                                         </div>
                                         <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">CHANGE</div>
                                     </button>
                                 </div>
                             )}
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                        <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
                        <button onClick={saveModalData} className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">Save Link</button>
                    </div>
                </div>
            </div>
        )}

        {/* Project Modal */}
        {modal.type === 'project' && modal.data && (
            <div className={MODAL_OVERLAY_CLASS}>
                <div className={MODAL_CONTENT_CLASS}>
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg">{modal.index === null ? 'Add Project' : 'Edit Project'}</h3>
                        <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label className={LABEL_CLASS}>Title <span className="text-red-500">*</span></label>
                            <input 
                                autoFocus 
                                type="text" 
                                value={modal.data.title} 
                                onChange={e => updateModalData('title', e.target.value)} 
                                className={modalErrors.title ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                            />
                             {modalErrors.title && <span className="text-xs text-red-500 font-medium">{modalErrors.title}</span>}
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>Description</label>
                            <textarea value={modal.data.description} onChange={e => updateModalData('description', e.target.value)} className={INPUT_CLASS} rows={3} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={LABEL_CLASS}>Thumbnail URL</label>
                                <input 
                                    type="text" 
                                    value={modal.data.thumbnail || ''} 
                                    onChange={e => updateModalData('thumbnail', e.target.value)} 
                                    className={modalErrors.thumbnail ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                />
                                {modalErrors.thumbnail && <span className="text-xs text-red-500 font-medium">{modalErrors.thumbnail}</span>}
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Project URL</label>
                                <input 
                                    type="text" 
                                    value={modal.data.url || ''} 
                                    onChange={e => updateModalData('url', e.target.value)} 
                                    className={modalErrors.url ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                />
                                {modalErrors.url && <span className="text-xs text-red-500 font-medium">{modalErrors.url}</span>}
                            </div>
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>Tags (Comma separated)</label>
                            <input type="text" value={modal.data.tags?.join(', ') || ''} onChange={e => updateModalData('tags', e.target.value.split(',').map((t: string) => t.trim()))} className={INPUT_CLASS} placeholder="React, Design, Tech" />
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                        <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
                        <button onClick={saveModalData} className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">Save Project</button>
                    </div>
                </div>
            </div>
        )}

        {/* Social Modal */}
        {modal.type === 'social' && modal.data && (
            <div className={MODAL_OVERLAY_CLASS}>
                <div className={MODAL_CONTENT_CLASS}>
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg">Add Social Icon</h3>
                        <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                    </div>
                    
                    <div className="p-6 space-y-6 overflow-y-visible min-h-[300px]">
                        <div className="relative">
                            <label className={LABEL_CLASS}>Platform</label>
                            <button 
                                onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                                className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg hover:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
                                        {getSocialIcon(modal.data.platform, "w-5 h-5")}
                                    </div>
                                    <span className="font-medium capitalize text-gray-900">{modal.data.platform}</span>
                                </div>
                                {showPlatformDropdown ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
                            </button>
                            {showPlatformDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[250px] overflow-y-auto animate-fade-in">
                                    {Object.values(SocialPlatform).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => {
                                                updateModalData('platform', p);
                                                setShowPlatformDropdown(false);
                                            }}
                                            className={`
                                                w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0
                                                ${modal.data.platform === p ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}
                                            `}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${modal.data.platform === p ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                                                {getSocialIcon(p, "w-4 h-4")}
                                            </div>
                                            <span className="font-medium capitalize">{p}</span>
                                            {modal.data.platform === p && <Check className="w-4 h-4 ml-auto"/>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={LABEL_CLASS}>Username or Link <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={modal.data.url} 
                                    onChange={e => updateModalData('url', e.target.value)} 
                                    className={modalErrors.url ? `${INPUT_ERROR_CLASS} pl-10` : `${INPUT_CLASS} pl-10`} 
                                    placeholder={modal.data.platform === 'email' ? 'you@example.com' : 'username'} 
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    {getSocialIcon(modal.data.platform, "w-4 h-4")}
                                </div>
                            </div>
                            {modalErrors.url && <span className="text-xs text-red-500 font-medium">{modalErrors.url}</span>}
                            <p className="text-xs text-gray-500 mt-2">
                                {modal.data.url.startsWith('http') || modal.data.url.startsWith('mailto') 
                                    ? <span className="text-green-600 flex items-center gap-1"><Check className="w-3 h-3"/> Custom Link detected</span> 
                                    : modal.data.url 
                                        ? <span className="text-indigo-500">Will link to: <b>{SOCIAL_BASE_URLS[modal.data.platform as SocialPlatform]}{modal.data.url.replace('@', '')}</b></span>
                                        : "Enter a username (e.g. @john) or a full link."}
                            </p>
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 mt-auto">
                        <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
                        <button onClick={saveModalData} className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">Add Icon</button>
                    </div>
                </div>
            </div>
        )}

        {/* Icon Picker */}
        {showIconPicker && (
            <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-slide-up">
                <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-white shadow-sm z-10">
                    <button onClick={() => setShowIconPicker(false)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                           autoFocus 
                           placeholder="Search 60+ icons..." 
                           className="w-full bg-gray-100 text-lg font-medium outline-none placeholder-gray-400 px-10 py-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                           value={iconSearch}
                           onChange={e => setIconSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-w-5xl mx-auto">
                        {filteredIcons.map(iconName => (
                            <button 
                                key={iconName}
                                onClick={() => {
                                    updateModalData('icon', iconName);
                                    setShowIconPicker(false);
                                }}
                                className={`
                                    flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 hover:shadow-md
                                    ${modal.data?.icon === iconName 
                                        ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'}
                                `}
                            >
                                <div className="mb-3">
                                    {getGenericIcon(iconName, "w-8 h-8")}
                                </div>
                                <span className="text-xs font-semibold truncate w-full text-center opacity-90">{iconName}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default CreateProfilePage;