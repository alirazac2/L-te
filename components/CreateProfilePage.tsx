'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import ProfileView from './ProfileView';
import { UserProfile, ThemeType, SocialPlatform, ProfileTheme } from '../types';
import { Save, ArrowLeft, Loader2, Wallet, Edit2, Layout, Image, Link as LinkIcon, Share2, Layers, Eye, Lock, Check, X as XIcon, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import { publishProfile, getProfileAddress, getUsernameByWallet, fetchProfileDataOnChain } from '../services/blockchain';
import { Toast, ToastType } from './Toast';
import { Footer } from './Footer';

// Reown AppKit Hooks
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';

// Imported Sub-Components
import IdentitySection from './editor/IdentitySection';
import ThemeSection from './editor/ThemeSection';
import SectionsEditor from './editor/SectionsEditor';
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
    links: [],
    sections: []
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

    // Scroll Management
    const editorScrollRef = useRef<HTMLDivElement>(null);

    // AppKit Hooks
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155');

    // Derived Signer
    const [signer, setSigner] = useState<ethers.Signer | null>(null);

    const [hasRegisteredProfile, setHasRegisteredProfile] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // NEW: Username Gate State (For new users)
    const [gateUsername, setGateUsername] = useState('');
    const [gateStatus, setGateStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');

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

    // Derived state to check for changes
    const hasChanges = JSON.stringify(profile) !== initialProfileJson;

    const showToast = (msg: string, type: ToastType = 'info') => {
        setToast({ msg, type, visible: true });
    };

    // --- Initialize Signer from Provider ---
    useEffect(() => {
        if (walletProvider) {
            const provider = new ethers.providers.Web3Provider(walletProvider as any);
            setSigner(provider.getSigner());
        } else {
            setSigner(null);
        }
    }, [walletProvider]);

    // --- Check Registration ---
    useEffect(() => {
        const init = async () => {
            if (isConnected && address) {
                setIsCheckingAuth(true);
                setHasRegisteredProfile(false); // Reset while checking to avoid flash

                await checkUserRegistration(address);

                // Small delay to ensure smooth transition
                setTimeout(() => setIsCheckingAuth(false), 500);
            } else {
                setHasRegisteredProfile(false);
                setIsCheckingAuth(false);
            }
        };
        init();
    }, [isConnected, address]);

    // Reset scroll when tab changes
    useEffect(() => {
        if (editorScrollRef.current) {
            editorScrollRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const checkUserRegistration = async (addr: string) => {
        try {
            const existingUsername = await getUsernameByWallet(addr);
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
                    const recoveryProfile = { ...DEFAULT_PROFILE, username: existingUsername };
                    setProfile(recoveryProfile);
                    setInitialProfileJson(JSON.stringify(recoveryProfile));
                }
            } else {
                setHasRegisteredProfile(false);
            }
        } catch (e) {
            console.error(e);
            setHasRegisteredProfile(false);
        }
    };

    const connectToEnter = async () => {
        try {
            await open();
        } catch (e) {
            console.error("AppKit Open Error:", e);
            showToast("Connection failed. Please check wallet.", "error");
        }
    };

    // --- Username Gate Logic (New) ---
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!gateUsername) {
                setGateStatus('idle');
                return;
            }

            const clean = gateUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
            if (clean !== gateUsername) {
                setGateUsername(clean);
                return; // Will re-trigger effect with clean value
            }

            if (clean.length < 3) {
                setGateStatus('invalid');
                return;
            }

            setGateStatus('checking');
            try {
                const addr = await getProfileAddress(clean);
                if (addr) {
                    setGateStatus('taken');
                } else {
                    setGateStatus('available');
                }
            } catch (e) {
                console.error(e);
                setGateStatus('idle');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [gateUsername]);

    // --- NEW: Mint immediately from Gate ---
    const handleInitialMint = async () => {
        if (gateStatus !== 'available' || !signer) return;

        setIsPublishing(true);
        setPublishStatus(`Minting ${gateUsername}...`);

        try {
            // Create the initial profile object
            const newProfile = {
                ...DEFAULT_PROFILE,
                username: gateUsername,
                displayName: gateUsername // Default display name to username
            };

            await publishProfile(gateUsername, newProfile, signer, (status) => {
                setPublishStatus(status);
            });

            showToast("Profile minted successfully! Welcome.", "success");
            setProfile(newProfile);
            setInitialProfileJson(JSON.stringify(newProfile));
            setHasRegisteredProfile(true); // This unlocks the editor

        } catch (e: any) {
            showToast(parseWalletError(e), "error");
        } finally {
            setIsPublishing(false);
            setPublishStatus("");
        }
    };

    // --- Error Helper ---
    const parseWalletError = (e: any): string => {
        console.error("Wallet Action Error:", e);
        const msg = e?.message || e?.toString() || "Unknown error";

        if (e?.code === 'ACTION_REJECTED' || e?.code === 4001 || msg.includes('user rejected') || msg.includes('User denied')) {
            return "Transaction cancelled by user.";
        }
        if (e?.code === 'INSUFFICIENT_FUNDS' || msg.includes('insufficient funds')) {
            return "Insufficient funds for gas fees.";
        }
        if (msg.includes('Internal JSON-RPC error')) {
            return "Transaction failed. Please check your inputs and try again.";
        }
        if (msg.includes('user denied account access')) {
            return "Wallet connection denied.";
        }

        if (msg.length > 80) return "Transaction failed. Check console for details.";

        return msg;
    };

    // --- Handlers ---

    const handleIdentityChange = (field: keyof UserProfile, value: any) => {
        setProfile(prev => {
            const newState = { ...prev, [field]: value };
            // If they change username in editor (which is usually locked/disabled anyway), checks happen here
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
            setModalErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
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

    // Main Publish Function (For editing existing profiles)
    const handlePublish = async () => {
        // 1. Ensure Wallet is Connected (Defensive)
        if (!address || !signer) {
            try {
                await open();
            } catch (e) {
                console.error(e);
            }
            return;
        }

        // 2. Validate
        if (Object.keys(identityErrors).length > 0) {
            showToast("Please fix validation errors in Identity tab", "error");
            setActiveTab('identity');
            return;
        }

        // 3. Update
        setIsPublishing(true);
        setPublishStatus(`Updating ${profile.username}...`);

        try {
            await publishProfile(profile.username, profile, signer, (status) => {
                setPublishStatus(status);
            });

            showToast("Profile updated successfully!", "success");
            setInitialProfileJson(JSON.stringify(profile));

        } catch (e: any) {
            showToast(parseWalletError(e), "error");
        } finally {
            setIsPublishing(false);
            setPublishStatus("");
        }
    };

    // Toggle View Mode with Scroll Preservation
    const toggleViewMode = () => {
        if (viewMode === 'edit') {
            // Saving scroll before switching to preview
            if (editorScrollRef.current) {
                setSavedScrollPosition(editorScrollRef.current.scrollTop);
            }
            setViewMode('preview');
        } else {
            // Switching back to edit
            setViewMode('edit');
            // Restore scroll after a small delay to allow DOM to render 'block'
            setTimeout(() => {
                if (editorScrollRef.current) {
                    editorScrollRef.current.scrollTop = savedScrollPosition;
                }
            }, 10);
        }
    };

    const [savedScrollPosition, setSavedScrollPosition] = useState(0);

    const TABS: { id: EditorTab; label: string; icon: React.FC<any> }[] = [
        { id: 'identity', label: 'Identity', icon: Layout },
        { id: 'theme', label: 'Theme', icon: Image },
        { id: 'sections', label: 'Sections', icon: Layers },
        { id: 'links', label: 'Links', icon: LinkIcon },
        { id: 'socials', label: 'Socials', icon: Share2 },
    ];

    // --- 1. CONNECT WALLET GATE ---
    // If no wallet is connected, show this blocking view.
    if (!address || !isConnected) {
        return (
            // Standard min-h-screen layout, scroll is natural
            <div className="min-h-screen w-full flex flex-col bg-gray-50 relative selection:bg-indigo-100 selection:text-indigo-700">
                <Toast message={toast.msg} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />

                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-indigo-100/40 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] bg-purple-100/40 rounded-full blur-[100px]" />
                </div>

                {/* Main Content - Flex-1 pushes footer down */}
                <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 py-12 px-6">
                    <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
                        {/* Icon Block */}
                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-10 shadow-lg border border-gray-100 rotate-3 transition-transform hover:rotate-6">
                            <Wallet className="w-10 h-10 text-gray-900" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9]">
                            Connect to<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Start Creating.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-lg font-medium leading-relaxed">
                            Your profile lives on the blockchain. Connect your wallet to access your decentralized studio.
                        </p>

                        <div className="flex flex-col items-center gap-6 w-full max-w-xs">
                            <button
                                onClick={connectToEnter}
                                className="group relative w-full flex items-center justify-center gap-3 px-8 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
                            >
                                {isCheckingAuth ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
                                <span>{isCheckingAuth ? "Connecting..." : "Connect Wallet"}</span>
                            </button>

                            <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Return Home
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer - Natural flow */}
                <Footer className="relative z-20 border-t border-gray-200 bg-white" hideNew={true} />
            </div>
        );
    }

    // --- 1.5 CHECKING AUTH (LOADING) ---
    // Dedicated Loading Screen to prevent "Username Gate" flash
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen w-full flex flex-col bg-gray-50 relative selection:bg-indigo-100 selection:text-indigo-700">
                <Toast message={toast.msg} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />

                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-indigo-100/40 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] bg-purple-100/40 rounded-full blur-[100px]" />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center mb-6 ring-1 ring-gray-100">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Identity</h2>
                        <p className="text-gray-500 font-medium animate-pulse">Scanning blockchain records...</p>
                    </div>
                </div>

                <Footer className="relative z-20 border-t border-gray-200 bg-white" hideNew={true} />
            </div>
        );
    }

    // --- 2. USERNAME GATE (ONBOARDING) ---
    if (!hasRegisteredProfile) {
        return (
            // Standard min-h-screen layout
            <div className="min-h-screen w-full flex flex-col bg-gray-50 relative selection:bg-indigo-100 selection:text-indigo-700">
                <Toast message={toast.msg} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />

                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-100/30 rounded-full blur-[100px] opacity-60" />
                    <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-100/30 rounded-full blur-[100px] opacity-60" />
                </div>

                {/* Main Content - Flex-1 pushes footer down */}
                <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 py-12 px-6">
                    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">

                        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-indigo-700 text-xs font-bold uppercase tracking-widest border border-indigo-100 shadow-sm">
                            <Check className="w-3 h-3" /> Wallet Connected
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
                            Claim Identity
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 mb-16 max-w-md">
                            Choose a unique username to mint your profile on the KiteAI network.
                        </p>

                        <div className="w-full max-w-md text-left">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Desired Username</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={gateUsername}
                                    onChange={e => setGateUsername(e.target.value)}
                                    placeholder="username"
                                    disabled={isPublishing}
                                    className={`
                                        w-full bg-transparent border-b-2 px-2 py-4 text-4xl font-bold outline-none transition-all placeholder-gray-300
                                        ${gateStatus === 'available' ? 'border-green-500 text-green-600' : ''}
                                        ${gateStatus === 'taken' ? 'border-red-300 text-red-500' : ''}
                                        ${gateStatus === 'checking' || gateStatus === 'idle' || gateStatus === 'invalid' ? 'border-gray-300 focus:border-indigo-600 text-gray-900' : ''}
                                    `}
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                    {gateStatus === 'checking' && <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />}
                                    {gateStatus === 'available' && <Check className="w-8 h-8 text-green-500" />}
                                    {gateStatus === 'taken' && <XIcon className="w-8 h-8 text-red-400" />}
                                </div>
                            </div>

                            {/* Status Message Area */}
                            <div className="mt-4 min-h-[24px] text-sm font-medium ml-1 flex items-center gap-2">
                                {gateStatus === 'available' && <span className="text-green-600 flex items-center gap-1"><Check className="w-4 h-4" /> Available! Ready to mint.</span>}
                                {gateStatus === 'taken' && <span className="text-red-500">Sorry, that handle is taken.</span>}
                                {gateStatus === 'invalid' && <span className="text-gray-400">Must be at least 3 characters (a-z, 0-9).</span>}
                                {gateStatus === 'checking' && <span className="text-gray-400">Checking availability...</span>}
                            </div>

                            <div className="mt-12 flex gap-4">
                                <Link
                                    to="/"
                                    className="flex-1 py-4 text-center rounded-xl font-bold text-gray-400 hover:text-gray-600 transition-colors bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                                >
                                    Cancel
                                </Link>
                                <button
                                    onClick={handleInitialMint}
                                    disabled={gateStatus !== 'available' || isPublishing}
                                    className={`
                                      flex-[2] flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all shadow-xl
                                      ${gateStatus === 'available' && !isPublishing
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-1'
                                            : 'bg-white border border-gray-200 text-gray-300 cursor-not-allowed shadow-sm'}
                                  `}
                                >
                                    {isPublishing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Minting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Mint Profile</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Natural flow */}
                <Footer className="relative z-20 border-t border-gray-200 bg-white" hideNew={true} />
            </div>
        );
    }

    // --- 3. EDITOR UI (Main Content) ---
    return (
        // ROOT: Use fixed positioning with overscroll-none to prevent body scroll "glitch"
        <div className="fixed inset-0 w-full h-[100dvh] bg-white text-gray-900 font-sans flex flex-col md:flex-row overflow-hidden overscroll-none">
            <Toast message={toast.msg} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />

            {/* --- Editor Column (Left) --- */}
            <div
                ref={editorScrollRef}
                className={`
            w-full md:w-1/2 lg:w-5/12 bg-white border-r border-gray-200 z-20 relative
            h-full overflow-y-auto scroll-smooth overscroll-contain
            ${viewMode === 'preview' ? 'hidden md:block' : 'block'}
        `}>
                {/* Sticky Header Wrapper */}
                <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">

                    {/* 1. Header */}
                    <div className="p-4 flex items-center justify-between bg-white/95 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <Link to="/" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800 leading-tight">
                                    Edit Profile
                                </h1>
                                <div className="text-xs font-medium flex items-center gap-1">
                                    <span className="text-green-600 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        {profile.username}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePublish}
                                disabled={isPublishing || Object.keys(identityErrors).length > 0 || !hasChanges}
                                title={!hasChanges ? "No changes to save" : "Save to Blockchain"}
                                className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm
                                ${!hasChanges
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'}
                            `}
                            >
                                {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span className="hidden sm:inline">
                                    {isPublishing ? 'Working...' : hasChanges ? 'Save Changes' : 'Saved'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* 2. Status Bar */}
                    {isPublishing && (
                        <div className="bg-indigo-50 px-6 py-2 text-xs font-medium text-indigo-700 border-t border-indigo-100 flex items-center gap-2 animate-fade-in">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {publishStatus}
                        </div>
                    )}

                    {/* 3. Tabs */}
                    <div className="flex items-center px-2 py-2 overflow-x-auto no-scrollbar gap-1 bg-gray-50/90 backdrop-blur-sm border-t border-gray-100">
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
                </div>

                {/* 4. Content */}
                <div className="p-6 pb-32 md:pb-10 min-h-[500px]">

                    {activeTab === 'identity' && (
                        <div className="animate-fade-in">
                            <IdentitySection
                                profile={profile}
                                onChange={handleIdentityChange}
                                errors={identityErrors}
                                usernameStatus={usernameStatus}
                                isUsernameLocked={hasRegisteredProfile}
                            />
                        </div>
                    )}

                    {activeTab === 'theme' && (
                        <div className="animate-fade-in">
                            <ThemeSection
                                key={viewMode} // Forces remount on view toggle to trigger scrollIntoView
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

            {/* --- Preview Column (Right) --- */}
            <div className={`
             md:block md:w-1/2 lg:w-7/12 md:bg-gray-100
             h-full overscroll-none
             ${viewMode === 'preview' ? 'fixed inset-0 z-50 bg-gray-100 flex flex-col' : 'hidden'} 
        `}>
                {/* Desktop Background Pattern */}
                <div className="hidden md:block absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

                {/* Phone Container */}
                <div className="w-full h-full md:w-auto md:h-auto md:max-h-[90vh] flex items-center justify-center transform-gpu relative z-10 md:p-8">
                    <PhoneMockup viewMode={viewMode}>
                        <ProfileView initialData={profile} disableNavigation={true} isPreview={true} />
                    </PhoneMockup>
                </div>
            </div>

            {/* --- Mobile View Toggle Button (Floating) --- */}
            {/* Always visible on mobile, positioned on top of everything */}
            <div className="md:hidden fixed bottom-6 right-6 z-[60]">
                <button
                    onClick={toggleViewMode}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-full shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] font-bold hover:bg-indigo-700 transition-all active:scale-95 border border-indigo-500"
                >
                    {viewMode === 'edit' ? (
                        <>
                            <Eye className="w-5 h-5" /> Preview
                        </>
                    ) : (
                        <>
                            <Edit2 className="w-5 h-5" /> Edit
                        </>
                    )}
                </button>
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
