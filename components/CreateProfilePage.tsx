
import React, { useState, useEffect, useMemo } from 'react';
import ProfileView from './ProfileView';
import { UserProfile, ThemeType, SocialPlatform, ProfileTheme } from '../types';
import { UploadCloud, Save, ArrowLeft, Loader2, Wallet, Smartphone, Edit2, Layout, Image, Link as LinkIcon, Share2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { connectWallet, publishProfile, getProfileAddress, getUsernameByWallet, fetchProfileDataOnChain, checkWalletConnection } from '../services/blockchain';
import { Toast, ToastType } from './Toast';

// Imported Sub-Components
import IdentitySection from './editor/IdentitySection';
import ThemeSection from './editor/ThemeSection';
import SectionsEditor from './editor/SectionsEditor'; // Updated
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
  sections: [
      {
          id: 's1',
          title: 'Featured Projects',
          description: 'See my work',
          icon: 'Layers',
          items: []
      }
  ]
};

// --- Types ---

type ModalType = 'link' | 'social' | 'section_trigger' | 'section_item' | null;
type EditorTab = 'identity' | 'theme' | 'sections' | 'links' | 'socials';

interface ModalState {
    type: ModalType;
    index: number | null; // Generic index
    sectionIndex?: number | null; // Specific for section items
    data: any;
}

const CreateProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [initialProfileJson, setInitialProfileJson] = useState<string>(JSON.stringify(DEFAULT_PROFILE));
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [activeTab, setActiveTab] = useState<EditorTab>('identity');
  
  // Wallet & Auth State
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [hasRegisteredProfile, setHasRegisteredProfile] = useState(false);
  
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
          const conn = await checkWalletConnection();
          if (conn) {
              setWalletAddress(conn.address);
              setSigner(conn.signer);
              await checkUserRegistration(conn.address);
          }
      };
      init();
  }, []);

  const checkUserRegistration = async (address: string) => {
      try {
          const existingUsername = await getUsernameByWallet(address);
          if (existingUsername) {
              setHasRegisteredProfile(true);
              const data = await fetchProfileDataOnChain(existingUsername);
              if (data) {
                  const cleanData = {
                      ...DEFAULT_PROFILE,
                      ...data,
                      theme: data.theme || DEFAULT_PROFILE.theme,
                      socials: data.socials || [],
                      links: data.links || [],
                      sections: data.sections || DEFAULT_PROFILE.sections
                  };
                  setProfile(cleanData);
                  setInitialProfileJson(JSON.stringify(cleanData));
              } else {
                  // Fallback if data is missing but username exists
                  const recoveryProfile = {...DEFAULT_PROFILE, username: existingUsername};
                  setProfile(recoveryProfile);
                  setInitialProfileJson(JSON.stringify(recoveryProfile));
              }
          } else {
              setHasRegisteredProfile(false);
          }
      } catch (e) {
          console.error(e);
      }
  };

  // --- Handlers ---

  const handleIdentityChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => {
        const newState = { ...prev, [field]: value };
        if (field === 'username') {
             const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
             newState.username = clean;
             // Check availability if not registered
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
      // Debounce username check
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

  const deleteItem = (index: number, type: 'link' | 'social' | 'section', subIndex?: number) => {
      if (!window.confirm("Are you sure you want to delete this?")) return;
      
      setProfile(prev => {
          const newData = { ...prev };
          if (type === 'link') newData.links = prev.links.filter((_, i) => i !== index);
          if (type === 'social') newData.socials = prev.socials.filter((_, i) => i !== index);
          if (type === 'section') newData.sections = prev.sections.filter((_, i) => i !== index);
          
          return newData;
      });
      showToast("Deleted", "info");
  };

  const deleteSectionItem = (sectionIndex: number, itemIndex: number) => {
     if (!window.confirm("Are you sure?")) return;
     setProfile(prev => {
         const newSections = [...prev.sections];
         const section = { ...newSections[sectionIndex] };
         section.items = section.items.filter((_, i) => i !== itemIndex);
         newSections[sectionIndex] = section;
         return { ...prev, sections: newSections };
     });
  };

  const moveItem = (index: number, direction: 'up' | 'down', type: 'link' | 'social' | 'section') => {
    setProfile(prev => {
        const newData = { ...prev };
        let list: any[] = [];
        
        if (type === 'link') list = [...prev.links];
        else if (type === 'social') list = [...prev.socials];
        else if (type === 'section') list = [...prev.sections];

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= list.length) return prev;
        [list[index], list[newIndex]] = [list[newIndex], list[index]];

        if (type === 'link') newData.links = list;
        else if (type === 'social') newData.socials = list;
        else if (type === 'section') newData.sections = list;

        return newData;
    });
  };

  const moveSectionItem = (sectionIndex: number, itemIndex: number, direction: 'up' | 'down') => {
      setProfile(prev => {
          const newSections = [...prev.sections];
          const section = { ...newSections[sectionIndex] };
          const list = [...section.items];
          const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
          
          if (newIndex < 0 || newIndex >= list.length) return prev;
          
          [list[itemIndex], list[newIndex]] = [list[newIndex], list[itemIndex]];
          section.items = list;
          newSections[sectionIndex] = section;
          return { ...prev, sections: newSections };
      });
  };

  const openModal = (type: ModalType, index: number | null, sectionIndex: number | null = null) => {
      let data = {};
      setModalErrors({});

      if (type === 'link') {
          data = index !== null ? { ...profile.links[index] } : { id: Date.now().toString(), title: '', url: '', icon: 'Link', featured: false };
      } else if (type === 'social') {
          data = index !== null ? { ...profile.socials[index] } : { platform: SocialPlatform.Instagram, url: '' };
      } else if (type === 'section_trigger') {
          data = index !== null ? { ...profile.sections[index] } : { id: Date.now().toString(), title: 'New Section', description: 'Description', items: [] };
      } else if (type === 'section_item') {
           if (sectionIndex !== null) {
                if (index !== null) {
                    data = { ...profile.sections[sectionIndex].items[index] };
                } else {
                    data = { id: Date.now().toString(), title: '', description: '', url: '', tags: [] };
                }
           }
      }

      setModal({ type, index, sectionIndex, data });
  };

  const closeModal = () => setModal({ type: null, index: null, sectionIndex: null, data: null });

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
      } 
      else if (modal.type === 'section_item') {
          if (!modal.data.title?.trim()) newErrors.title = "Title is required";
          if (modal.data.thumbnail && !isValidUrl(modal.data.thumbnail)) newErrors.thumbnail = "Invalid URL format";
      }
      else if (modal.type === 'section_trigger') {
          if (!modal.data.title?.trim()) newErrors.title = "Section Name is required";
          if (modal.data.thumbnail && !isValidUrl(modal.data.thumbnail)) newErrors.thumbnail = "Invalid URL format";
      }
      else if (modal.type === 'social') {
           if (!modal.data.url?.trim()) newErrors.url = "Username or URL is required";
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
          } 
          else if (modal.type === 'section_trigger') {
              const list = [...prev.sections];
              if (modal.index !== null) {
                  // Keep items, just update trigger details
                  list[modal.index] = { ...list[modal.index], ...modal.data };
              } else {
                  // Add new section
                  list.push({ ...modal.data, items: [] });
              }
              newData.sections = list;
          }
          else if (modal.type === 'section_item' && modal.sectionIndex !== null) {
              const newSections = [...prev.sections];
              const section = { ...newSections[modal.sectionIndex] };
              const items = [...section.items];
              
              if (modal.index !== null) items[modal.index] = modal.data;
              else items.push(modal.data);
              
              section.items = items;
              newSections[modal.sectionIndex] = section;
              newData.sections = newSections;
          }
          else if (modal.type === 'social') {
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
      let currentSigner = signer;
      let currentAddress = walletAddress;
      
      if (!currentAddress || !currentSigner) {
          try {
              showToast("Requesting wallet connection...", "info");
              const { address, signer: s } = await connectWallet();
              setWalletAddress(address);
              setSigner(s);
              currentSigner = s;
              currentAddress = address;

              const existingUser = await getUsernameByWallet(address);
              if (existingUser) {
                  setHasRegisteredProfile(true);
                  if (profile.username && profile.username !== existingUser) {
                      const confirmOverwrite = window.confirm(
                          `This wallet is already bound to the profile "${existingUser}".\n\nSaving will update "${existingUser}" with your current edits. Continue?`
                      );
                      if (!confirmOverwrite) {
                          showToast("Save cancelled.", "info");
                          return;
                      }
                      setProfile(prev => ({ ...prev, username: existingUser }));
                  } else {
                      setProfile(prev => ({ ...prev, username: existingUser }));
                  }
              }

          } catch (e) {
              console.error(e);
              showToast("Wallet connection failed. Cannot save.", "error");
              return;
          }
      }

      const targetUsername = hasRegisteredProfile ? (await getUsernameByWallet(currentAddress!)) || profile.username : profile.username;

      if (!targetUsername || targetUsername.length < 3) {
          showToast("Username must be at least 3 characters", "error");
          setActiveTab('identity');
          return;
      }
      
      if (Object.keys(identityErrors).length > 0) {
          showToast("Please fix validation errors in Identity tab", "error");
          setActiveTab('identity');
          return;
      }
      
      if (usernameStatus === 'taken' && !hasRegisteredProfile) {
          showToast("Username is already taken", "error");
          setActiveTab('identity');
          return;
      }

      setIsPublishing(true);
      setPublishStatus(hasRegisteredProfile ? `Updating ${targetUsername}...` : `Minting ${targetUsername}...`);
      
      try {
          const profileToSave = { ...profile, username: targetUsername };
          
          await publishProfile(targetUsername, profileToSave, currentSigner, (status) => {
              setPublishStatus(status);
          });
          
          showToast(hasRegisteredProfile ? "Profile updated successfully!" : "Profile minted successfully!", "success");
          setInitialProfileJson(JSON.stringify(profileToSave));
          setHasRegisteredProfile(true);

      } catch (e: any) {
          console.error(e);
          showToast("Error publishing: " + (e.message || "Unknown error"), "error");
          setPublishStatus("Failed.");
      } finally {
          setIsPublishing(false);
      }
  };

  const TABS: { id: EditorTab; label: string; icon: React.FC<any> }[] = [
      { id: 'identity', label: 'Identity', icon: Layout },
      { id: 'theme', label: 'Theme', icon: Image },
      { id: 'sections', label: 'Sections', icon: Layers },
      { id: 'links', label: 'Links', icon: LinkIcon },
      { id: 'socials', label: 'Socials', icon: Share2 },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white text-gray-900 overflow-hidden font-sans relative">
        <Toast message={toast.msg} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />

        {/* Editor Sidebar */}
        <div className={`
            w-full md:w-1/2 lg:w-5/12 h-full flex flex-col bg-white border-r border-gray-200 shadow-2xl z-20 transition-transform duration-300 ease-in-out
            ${viewMode === 'preview' ? '-translate-x-full absolute md:static md:translate-x-0' : 'translate-x-0'}
        `}>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <Link to="/" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                             {hasRegisteredProfile ? 'Edit Profile' : 'Create Profile'}
                        </h1>
                        <div className="text-xs font-medium flex items-center gap-1">
                             {walletAddress ? (
                                 <span className="text-green-600 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> {walletAddress.slice(0,6)}...</span>
                             ) : (
                                 <span className="text-orange-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Guest Mode</span>
                             )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handlePublish}
                        disabled={isPublishing || Object.keys(identityErrors).length > 0}
                        title="Save to Blockchain"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isPublishing ? <Loader2 className="w-4 h-4 animate-spin"/> : (walletAddress ? <Save className="w-4 h-4" /> : <Wallet className="w-4 h-4"/>)}
                        <span className="hidden sm:inline">
                            {isPublishing ? 'Working...' : (walletAddress ? (hasRegisteredProfile ? 'Save Changes' : 'Mint Profile') : 'Connect & Mint')}
                        </span>
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

            {/* Tabs Navigation */}
            <div className="flex items-center px-2 py-2 border-b border-gray-100 overflow-x-auto no-scrollbar gap-1 bg-gray-50/50">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                                ${isActive 
                                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' 
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}
                            `}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'opacity-70'}`} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-gray-50/30">
                
                {activeTab === 'identity' && (
                    <div className="animate-fade-in">
                        <IdentitySection 
                            profile={profile} 
                            onChange={handleIdentityChange} 
                            errors={identityErrors}
                            usernameStatus={usernameStatus}
                            isUsernameLocked={hasRegisteredProfile}
                        />
                         {!walletAddress && (
                            <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl text-xs text-orange-700">
                                <b>Guest Mode:</b> You are editing locally. Connect your wallet when you are ready to save your profile to the blockchain.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'theme' && (
                    <div className="animate-fade-in">
                         <ThemeSection 
                            profile={profile} 
                            onChange={handleThemeChange} 
                        />
                    </div>
                )}

                {activeTab === 'sections' && (
                    <div className="animate-fade-in">
                        <SectionsEditor 
                            sections={profile.sections || []}
                            onAddSection={() => openModal('section_trigger', null)}
                            onEditSectionTrigger={(idx) => openModal('section_trigger', idx)}
                            onDeleteSection={(idx) => deleteItem(idx, 'section')}
                            onMoveSection={(idx, dir) => moveItem(idx, dir, 'section')}
                            
                            onAddItem={(secIdx) => openModal('section_item', null, secIdx)}
                            onEditItem={(secIdx, itemIdx) => openModal('section_item', itemIdx, secIdx)}
                            onDeleteItem={deleteSectionItem}
                            onMoveItem={moveSectionItem}
                        />
                    </div>
                )}

                {activeTab === 'links' && (
                    <div className="animate-fade-in">
                         <LinksEditor 
                            links={profile.links}
                            onAdd={() => openModal('link', null)}
                            onEdit={(idx) => openModal('link', idx)}
                            onDelete={(idx) => deleteItem(idx, 'link')}
                            onMove={(idx, dir) => moveItem(idx, dir, 'link')}
                        />
                    </div>
                )}

                {activeTab === 'socials' && (
                    <div className="animate-fade-in">
                         <SocialsEditor 
                            socials={profile.socials}
                            onAdd={() => openModal('social', null)}
                            onEdit={(idx) => openModal('social', idx)}
                            onDelete={(idx) => deleteItem(idx, 'social')}
                            onMove={(idx, dir) => moveItem(idx, dir, 'social')}
                        />
                    </div>
                )}

            </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="md:hidden fixed bottom-6 right-6 z-50">
            <button 
                onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] font-bold hover:bg-indigo-700 transition-all active:scale-95 border border-indigo-500"
            >
                {viewMode === 'edit' ? <><Smartphone className="w-5 h-5"/> Preview</> : <><Edit2 className="w-5 h-5"/> Edit</>}
            </button>
        </div>

        {/* Preview Area */}
        <div className={`
            w-full md:w-1/2 lg:w-7/12 h-full flex flex-col items-center justify-center relative transition-all duration-300
            ${viewMode === 'edit' ? 'hidden md:flex bg-gray-50/50' : 'flex absolute inset-0 z-30 bg-white md:static md:bg-gray-50/50'}
        `}>
             <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] hidden md:block opacity-70"></div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 hidden md:block animate-fade-in">
                Live Preview
            </div>

            <PhoneMockup viewMode={viewMode}>
                <ProfileView initialData={profile} disableNavigation={true} />
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
