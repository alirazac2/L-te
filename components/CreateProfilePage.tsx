import React, { useState, useEffect, useMemo } from 'react';
import ProfileView from './ProfileView';
import { UserProfile, ThemeType, SocialPlatform, ProfileTheme } from '../types';
import { UploadCloud, Save, ArrowLeft, Loader2, UserPlus, Wallet, X, Check, Smartphone, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { connectWallet, publishProfile, getProfileAddress, getUsernameByWallet, fetchProfileDataOnChain, checkWalletConnection } from '../services/blockchain';
import { Toast, ToastType } from './Toast';

// Imported Sub-Components
import IdentitySection from './editor/IdentitySection';
import ThemeSection from './editor/ThemeSection';
import ProjectsEditor from './editor/ProjectsEditor';
import LinksEditor from './editor/LinksEditor';
import SocialsEditor from './editor/SocialsEditor';
import EditModals from './editor/EditModals';
import PhoneMockup from './PhoneMockup';
import { isValidUrl, SOCIAL_BASE_URLS } from './editor/editorUtils';

// --- Constants ---

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
  projects: [],
  projectCard: {
      title: 'Featured Projects',
      description: 'See my work',
      icon: 'Layers'
  }
};

// --- Types ---

type ModalType = 'link' | 'project' | 'social' | 'project_trigger' | null;

interface ModalState {
    type: ModalType;
    index: number | null; // null means adding new
    data: any;
}

const CreateProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [initialProfileJson, setInitialProfileJson] = useState<string>(JSON.stringify(DEFAULT_PROFILE));
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  
  // Wallet & Auth State
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [hasRegisteredProfile, setHasRegisteredProfile] = useState(false);
  const [isCheckingWallet, setIsCheckingWallet] = useState(true);
  
  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Validation State
  const [identityErrors, setIdentityErrors] = useState<Record<string, string>>({});
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});

  // Modal State
  const [modal, setModal] = useState<ModalState>({ type: null, index: null, data: null });
  
  // Toast State
  const [toast, setToast] = useState<{ msg: string; type: ToastType; visible: boolean }>({
    msg: '', type: 'info', visible: false
  });

  const showToast = (msg: string, type: ToastType = 'info') => {
      setToast({ msg, type, visible: true });
  };

  const isDirty = useMemo(() => {
      return JSON.stringify(profile) !== initialProfileJson;
  }, [profile, initialProfileJson]);

  // --- Wallet & Initial Load ---

  useEffect(() => {
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
              const data = await fetchProfileDataOnChain(existingUsername);
              if (data) {
                  // Ensure projectCard exists for older profiles
                  const cleanData = {
                      ...data,
                      projectCard: data.projectCard || DEFAULT_PROFILE.projectCard
                  };
                  setProfile(cleanData);
                  setInitialProfileJson(JSON.stringify(cleanData));
              } else {
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
             const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
             newState.username = clean;
             if (!hasRegisteredProfile) {
                 checkUsername(clean);
             }
        }
        return newState;
    });

    if (field === 'avatarUrl') {
        if (value && !isValidUrl(value)) {
            setIdentityErrors(prev => ({ ...prev, avatarUrl: "Please enter a valid URL (https://...)" }));
        } else {
            setIdentityErrors(prev => { const n = { ...prev }; delete n.avatarUrl; return n; });
        }
    }
  };

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

  const deleteItem = (index: number, type: 'link' | 'project' | 'social') => {
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

  const moveItem = (index: number, direction: 'up' | 'down', type: 'link' | 'project' | 'social') => {
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
      setModalErrors({});

      if (index !== null) {
          if (type === 'link') data = { ...profile.links[index] };
          if (type === 'project') data = { ...profile.projects![index] };
          if (type === 'social') data = { ...profile.socials[index] };
      } else {
          if (type === 'link') data = { id: Date.now().toString(), title: '', url: '', icon: 'Link', featured: false };
          if (type === 'project') data = { id: Date.now().toString(), title: '', description: '', url: '', tags: [], icon: 'Folder' };
          if (type === 'social') data = { platform: SocialPlatform.Instagram, url: '' };
          if (type === 'project_trigger') data = { ...profile.projectCard } || { title: 'Featured Projects', description: 'See more', icon: 'Layers' };
      }
      setModal({ type, index, data });
  };

  const closeModal = () => setModal({ type: null, index: null, data: null });

  const updateModalData = (field: string, value: any) => {
      setModal(prev => ({ ...prev, data: { ...prev.data, [field]: value } }));
      if (modalErrors[field]) {
          setModalErrors(prev => { const n = {...prev}; delete n[field]; return n; });
      }
  };

  const saveModalData = () => {
      if (!modal.type || !modal.data) return;

      const newErrors: Record<string, string> = {};

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
          // Relaxed validation for individual projects as per user feedback
          if (modal.data.thumbnail && !isValidUrl(modal.data.thumbnail)) newErrors.thumbnail = "Invalid URL format";
          if (modal.data.url && !isValidUrl(modal.data.url)) newErrors.url = "Invalid URL format";
      }
      else if (modal.type === 'project_trigger') {
          if (!modal.data.title?.trim()) newErrors.title = "Title is required";
          if (modal.data.description && modal.data.description.length > 15) {
              newErrors.description = "Max 15 characters allowed";
          }
          if (modal.data.thumbnail && !isValidUrl(modal.data.thumbnail)) newErrors.thumbnail = "Invalid URL format";
      }
      else if (modal.type === 'social') {
           const val = modal.data.url || '';
           if (!val.trim()) newErrors.url = "Username or URL is required";
           else if (/\s/.test(val)) newErrors.url = "Spaces are not allowed";
      }

      if (Object.keys(newErrors).length > 0) {
          setModalErrors(newErrors);
          return;
      }

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
          } else if (modal.type === 'project_trigger') {
              newData.projectCard = modal.data;
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

  const handlePublish = async () => {
      if (!walletAddress || !signer) {
          showToast("Please connect your wallet first", "error");
          return;
      }
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
          await publishProfile(profile.username, profile, signer, (status) => {
              setPublishStatus(status);
          });
          
          showToast(hasRegisteredProfile ? "Profile updated successfully!" : "Profile minted successfully!", "success");
          setInitialProfileJson(JSON.stringify(profile));

          setTimeout(() => {
              window.location.reload();
          }, 1500);

      } catch (e: any) {
          console.error(e);
          showToast("Error publishing: " + (e.message || "Unknown error"), "error");
          setPublishStatus("Failed.");
      } finally {
          if (!hasRegisteredProfile) {
            setIsPublishing(false);
          }
      }
  };

  // --- Views ---

  if (isCheckingWallet) {
      return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Checking connection...</p>
          </div>
      );
  }

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
            <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
                
                <IdentitySection 
                  profile={profile} 
                  onChange={handleIdentityChange} 
                  errors={identityErrors}
                  usernameStatus={usernameStatus}
                  isUsernameLocked={true}
                />

                <hr className="border-gray-100" />

                <ThemeSection 
                  profile={profile} 
                  onChange={handleThemeChange} 
                />

                <hr className="border-gray-100" />

                <ProjectsEditor 
                  projects={profile.projects || []}
                  projectCard={profile.projectCard || { title: 'Featured Projects', description: 'See more', icon: 'Layers' }}
                  onAdd={() => openModal('project', null)}
                  onEdit={(idx) => openModal('project', idx)}
                  onDelete={(idx) => deleteItem(idx, 'project')}
                  onMove={(idx, dir) => moveItem(idx, dir, 'project')}
                  onEditTrigger={() => openModal('project_trigger', null)}
                />

                <hr className="border-gray-100" />

                <LinksEditor 
                  links={profile.links}
                  onAdd={() => openModal('link', null)}
                  onEdit={(idx) => openModal('link', idx)}
                  onDelete={(idx) => deleteItem(idx, 'link')}
                  onMove={(idx, dir) => moveItem(idx, dir, 'link')}
                />

                <hr className="border-gray-100" />

                <SocialsEditor 
                  socials={profile.socials}
                  onAdd={() => openModal('social', null)}
                  onEdit={(idx) => openModal('social', idx)}
                  onDelete={(idx) => deleteItem(idx, 'social')}
                  onMove={(idx, dir) => moveItem(idx, dir, 'social')}
                />

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

            <PhoneMockup viewMode={viewMode}>
                <ProfileView initialData={profile} />
            </PhoneMockup>
        </div>

        <EditModals 
          modal={modal}
          onClose={closeModal}
          onSave={saveModalData}
          onUpdateData={updateModalData}
          errors={modalErrors}
        />
    </div>
  );
};

export default CreateProfilePage;