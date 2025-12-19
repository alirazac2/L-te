
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { 
  X, Wallet, Compass, Copy, Check, Settings, 
  LayoutGrid, ChevronRight, User, UserPen
} from 'lucide-react';

interface ProfileMenuProps {
  ownerWallet?: string;
  username?: string;
  isLightTheme?: boolean;
  isPreview?: boolean;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ ownerWallet, username, isLightTheme, isPreview }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  
  const [copiedOwner, setCopiedOwner] = useState(false);
  const [copiedMy, setCopiedMy] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handlePreviewAction = (e?: React.MouseEvent) => {
    if (isPreview) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        alert("Action disabled: This is a demo preview.");
        return true;
    }
    return false;
  };

  const handleCopy = (text: string, setCopiedState: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleOpenWallet = async (e: React.MouseEvent) => {
    if (handlePreviewAction(e)) return;
    try {
        await open();
    } catch(e) {
        console.error(e);
    }
  };

  const handleNavigation = (to: string, e: React.MouseEvent) => {
    if (handlePreviewAction(e)) return;
    setIsOpen(false);
    navigate(to);
  };

  // Conditionally apply desktop classes only if NOT in preview mode
  const desktopClasses = !isPreview ? 'md:w-[500px] md:mb-8 md:border md:border-white/20 md:rounded-[2.5rem]' : '';

  return (
    <>
      {/* Trigger Button (Top Left) */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`
            group relative p-3 rounded-full backdrop-blur-xl transition-all duration-500 ease-out z-50
            ${isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'} 
            ${isLightTheme 
                ? 'bg-white/60 hover:bg-white text-gray-900 shadow-sm hover:shadow-md ring-1 ring-black/5' 
                : 'bg-black/20 hover:bg-black/40 text-white ring-1 ring-white/10'
            }
            hover:scale-105 active:scale-95
        `}
        aria-label="Open Menu"
      >
        <LayoutGrid className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
      </button>

      {/* Backdrop Overlay */}
      <div 
        className={`
            fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-500
            ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      {/* Centered Bottom-Up Sheet (Matches ProjectsDrawer style) */}
      <div className={`
            fixed inset-0 z-[101] flex flex-col items-center justify-end pointer-events-none
            transition-transform duration-500 cubic-bezier(0.32,0.72,0,1)
            ${isOpen ? 'translate-y-0' : 'translate-y-[110%]'}
      `}>
          <div 
            className={`
                pointer-events-auto
                w-full ${desktopClasses}
                bg-white/95 backdrop-blur-2xl 
                shadow-[0_-10px_60px_-10px_rgba(0,0,0,0.3)]
                border-t border-white/50
                
                rounded-t-[2.5rem]
                overflow-hidden flex flex-col
                max-h-[85vh]
            `}
          >
             {/* Drag Handle */}
             <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={() => setIsOpen(false)}>
                <div className="w-12 h-1.5 bg-gray-200/80 rounded-full"></div>
             </div>

             {/* Header */}
             <div className="px-8 pt-4 pb-4 flex items-center justify-between shrink-0">
                 <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Menu</h2>
                 </div>
                 <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 bg-gray-100/80 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
                 >
                    <X className="w-5 h-5" />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-6 no-scrollbar">
                
                {/* 1. Wallet Card */}
                {isConnected && address ? (
                    <div className="rounded-3xl p-1 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50">
                        <div className="bg-white/60 backdrop-blur-xl rounded-[1.3rem] p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Wallet</div>
                                        <div className="text-sm font-bold text-gray-900">Connected</div>
                                    </div>
                                </div>
                                <button onClick={(e) => { if(!handlePreviewAction(e)) open(); }} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-indigo-600 transition-colors">
                                    <Settings className="w-4 h-4"/>
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                                <span className="font-mono text-sm font-bold text-gray-600 ml-1">
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </span>
                                <button onClick={() => handleCopy(address, setCopiedMy)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">
                                    {copiedMy ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={handleOpenWallet}
                        className="w-full relative overflow-hidden rounded-3xl bg-gray-900 text-white p-5 shadow-xl shadow-gray-200 transition-transform active:scale-[0.98] group"
                    >
                         <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-lg">Connect Wallet</div>
                                    <div className="text-white/60 text-xs font-medium">Access dashboard</div>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                         </div>
                    </button>
                )}

                {/* 2. Actions */}
                <div className="grid gap-3">
                     <button 
                        onClick={(e) => handleNavigation("/new", e)}
                        className="w-full flex items-center gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"
                     >
                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                            <UserPen className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="font-bold text-base text-gray-900">My Profile</div>
                            <div className="text-xs text-gray-500">Edit your personal page</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400" />
                     </button>

                     <button 
                        onClick={(e) => handleNavigation("/", e)}
                        className="w-full flex items-center gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all group"
                     >
                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-purple-600 transition-colors shadow-sm">
                            <Compass className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="font-bold text-base text-gray-900">Discover</div>
                            <div className="text-xs text-gray-500">Explore ecosystem</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-400" />
                     </button>
                </div>

                {/* 3. Viewing Info */}
                <div className="pt-4 border-t border-gray-100/50">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                            <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Viewing Profile</div>
                            <div className="text-sm font-bold text-gray-900 truncate">{username || "Guest"}</div>
                        </div>
                        {ownerWallet && (
                             <button 
                                onClick={() => handleCopy(ownerWallet, setCopiedOwner)}
                                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-mono text-gray-500 transition-colors flex items-center gap-2"
                             >
                                {ownerWallet.slice(0,4)}...{ownerWallet.slice(-4)}
                                {copiedOwner ? <Check className="w-3 h-3 text-green-500"/> : <Copy className="w-3 h-3"/>}
                             </button>
                        )}
                    </div>
                </div>

             </div>
          </div>
      </div>
    </>
  );
};
