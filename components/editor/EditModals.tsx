import React, { useState, useEffect } from 'react';
import { SocialPlatform } from '../../types';
import { X, Check, ChevronUp, ChevronDown, ArrowLeft, Search } from 'lucide-react';
import { getGenericIcon, getSocialIcon, ICON_OPTIONS } from '../Icons';
import { 
  INPUT_CLASS, 
  INPUT_ERROR_CLASS, 
  LABEL_CLASS, 
  MODAL_CONTENT_CLASS, 
  MODAL_OVERLAY_CLASS, 
  SOCIAL_BASE_URLS 
} from './editorUtils';

type ModalType = 'link' | 'project' | 'social' | 'project_trigger' | null;

interface ModalState {
    type: ModalType;
    index: number | null;
    data: any;
}

interface EditModalsProps {
  modal: ModalState;
  onClose: () => void;
  onSave: () => void;
  onUpdateData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const EditModals: React.FC<EditModalsProps> = ({ modal, onClose, onSave, onUpdateData, errors }) => {
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  
  // MediaType state for Trigger Card: 'icon' | 'image'
  // (Project items don't use this state anymore, they just have a thumbnail input)
  const [triggerMediaType, setTriggerMediaType] = useState<'icon' | 'image'>('icon');

  useEffect(() => {
    if (modal.type === 'project_trigger' && modal.data) {
        // Determine initial tab for trigger card
        if (modal.data.thumbnail) {
            setTriggerMediaType('image');
        } else {
            setTriggerMediaType('icon');
        }
    }
  }, [modal.type]); 

  const handleOpenIconPicker = () => {
      setShowIconPicker(true);
      setIconSearch('');
  };

  const handleTriggerMediaTypeChange = (type: 'icon' | 'image') => {
      setTriggerMediaType(type);
      // Optional: Clear the other field when switching? 
      // The user said "optional nothing anything means it's none".
      // We'll keep the data in the object but the UI focuses on the selected tab.
      if (type === 'image') {
          // If switching to image, maybe we clear icon? or just let valid URL take precedence.
          // For cleanliness let's clear the icon if they start typing an image, 
          // but for the tab switch we just change the view.
          onUpdateData('icon', ''); 
      } else {
          onUpdateData('thumbnail', '');
          if (!modal.data.icon) onUpdateData('icon', 'Layers');
      }
  };

  const filteredIcons = ICON_OPTIONS.filter(icon => 
    icon.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <>
        {/* Link Modal */}
        {modal.type === 'link' && modal.data && (
            <div className={MODAL_OVERLAY_CLASS}>
                <div className={MODAL_CONTENT_CLASS}>
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg">{modal.index === null ? 'Add New Link' : 'Edit Link'}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label className={LABEL_CLASS}>Title <span className="text-red-500">*</span></label>
                            <input 
                                autoFocus 
                                type="text" 
                                value={modal.data.title} 
                                onChange={e => onUpdateData('title', e.target.value)} 
                                className={errors.title ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                placeholder="e.g. My Website" 
                            />
                            {errors.title && <span className="text-xs text-red-500 font-medium">{errors.title}</span>}
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>URL <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                value={modal.data.url} 
                                onChange={e => onUpdateData('url', e.target.value)} 
                                className={errors.url ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                placeholder="https://..." 
                            />
                             {errors.url && <span className="text-xs text-red-500 font-medium">{errors.url}</span>}
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <div className="flex items-center gap-3 mb-4">
                                <input type="checkbox" id="modal-feat" checked={modal.data.featured} onChange={e => onUpdateData('featured', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                <label htmlFor="modal-feat" className="font-bold text-sm text-gray-700 select-none">Featured Card Layout</label>
                             </div>
                             
                             {modal.data.featured ? (
                                 <div className="space-y-3 animate-fade-in">
                                     <div>
                                         <label className={LABEL_CLASS}>Thumbnail URL</label>
                                         <input 
                                            type="text" 
                                            value={modal.data.thumbnail || ''} 
                                            onChange={e => onUpdateData('thumbnail', e.target.value)} 
                                            className={errors.thumbnail ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                            placeholder="https://image..." 
                                         />
                                          {errors.thumbnail && <span className="text-xs text-red-500 font-medium">{errors.thumbnail}</span>}
                                     </div>
                                     <div>
                                         <label className={LABEL_CLASS}>Description</label>
                                         <input type="text" value={modal.data.description || ''} onChange={e => onUpdateData('description', e.target.value)} className={INPUT_CLASS} placeholder="Short text..." />
                                     </div>
                                 </div>
                             ) : (
                                 <div className="animate-fade-in">
                                     <label className={LABEL_CLASS}>Icon</label>
                                     <button 
                                        onClick={handleOpenIconPicker}
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
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
                        <button onClick={onSave} className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">Save Link</button>
                    </div>
                </div>
            </div>
        )}

        {/* Project Modal (Individual Item) */}
        {modal.type === 'project' && modal.data && (
             <div className={MODAL_OVERLAY_CLASS}>
                <div className={MODAL_CONTENT_CLASS}>
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg">{modal.index === null ? 'Add Project' : 'Edit Project'}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-6 space-y-5 overflow-y-auto">
                        
                        <div>
                            <label className={LABEL_CLASS}>Title <span className="text-red-500">*</span></label>
                            <input 
                                autoFocus 
                                type="text" 
                                value={modal.data.title} 
                                onChange={e => onUpdateData('title', e.target.value)} 
                                className={errors.title ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                placeholder="Project Name"
                            />
                             {errors.title && <span className="text-xs text-red-500 font-medium">{errors.title}</span>}
                        </div>

                        <div>
                            <label className={LABEL_CLASS}>Description</label>
                            <input 
                                type="text"
                                value={modal.data.description} 
                                onChange={e => onUpdateData('description', e.target.value)} 
                                className={INPUT_CLASS} 
                                placeholder="Project description"
                            />
                        </div>

                        {/* ONLY IMAGE for Project Items */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                             <label className={LABEL_CLASS}>Project Image (Optional)</label>
                             <input 
                                type="text" 
                                value={modal.data.thumbnail || ''} 
                                onChange={e => onUpdateData('thumbnail', e.target.value)} 
                                className={errors.thumbnail ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                placeholder="https://..."
                            />
                            {errors.thumbnail && <span className="text-xs text-red-500 font-medium">{errors.thumbnail}</span>}
                            <p className="text-[10px] text-gray-400 mt-1">Leave empty for no image.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className={LABEL_CLASS}>Project URL</label>
                                <input 
                                    type="text" 
                                    value={modal.data.url || ''} 
                                    onChange={e => onUpdateData('url', e.target.value)} 
                                    className={errors.url ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                    placeholder="Optional"
                                />
                                {errors.url && <span className="text-xs text-red-500 font-medium">{errors.url}</span>}
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Tags (Comma separated)</label>
                                <input 
                                    type="text" 
                                    value={modal.data.tags?.join(', ') || ''} 
                                    onChange={e => onUpdateData('tags', e.target.value.split(',').map((t: string) => t.trim()))} 
                                    className={INPUT_CLASS} 
                                    placeholder="React, Design" 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
                        <button onClick={onSave} className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                            Save Project
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Trigger Card Modal */}
        {modal.type === 'project_trigger' && modal.data && (
            <div className={MODAL_OVERLAY_CLASS}>
                <div className={MODAL_CONTENT_CLASS}>
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg">Design Portfolio Button</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-6 space-y-5 overflow-y-auto">
                        
                        <div>
                            <label className={LABEL_CLASS}>Title <span className="text-red-500">*</span></label>
                            <input 
                                autoFocus 
                                type="text" 
                                value={modal.data.title} 
                                onChange={e => onUpdateData('title', e.target.value)} 
                                className={errors.title ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                placeholder="Featured Projects"
                            />
                             {errors.title && <span className="text-xs text-red-500 font-medium">{errors.title}</span>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Description</label>
                                <span className={`text-[10px] font-medium ${(modal.data.description?.length || 0) > 15 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {modal.data.description?.length || 0}/15
                                </span>
                            </div>
                            <input 
                                type="text"
                                value={modal.data.description} 
                                onChange={e => onUpdateData('description', e.target.value)} 
                                className={errors.description ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                maxLength={15}
                                placeholder="Short label..."
                            />
                            {errors.description && <span className="text-xs text-red-500 font-medium">{errors.description}</span>}
                        </div>

                        {/* Media Selector: Icon OR Image */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                             <label className={LABEL_CLASS}>Button Visual</label>
                             <div className="flex p-1 bg-gray-200 rounded-lg mb-4">
                                <button 
                                    onClick={() => handleTriggerMediaTypeChange('icon')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${triggerMediaType === 'icon' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Icon
                                </button>
                                <button 
                                    onClick={() => handleTriggerMediaTypeChange('image')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${triggerMediaType === 'image' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Image
                                </button>
                             </div>

                             {triggerMediaType === 'image' && (
                                <div className="animate-fade-in">
                                    <label className={LABEL_CLASS}>Thumbnail URL</label>
                                    <input 
                                        type="text" 
                                        value={modal.data.thumbnail || ''} 
                                        onChange={e => onUpdateData('thumbnail', e.target.value)} 
                                        className={errors.thumbnail ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                                        placeholder="https://..."
                                    />
                                    {errors.thumbnail && <span className="text-xs text-red-500 font-medium">{errors.thumbnail}</span>}
                                    <p className="text-[10px] text-gray-400 mt-1">Leave empty if you don't want an image.</p>
                                </div>
                             )}

                             {triggerMediaType === 'icon' && (
                                <div className="animate-fade-in">
                                    <label className={LABEL_CLASS}>Select Icon</label>
                                    <button 
                                        onClick={handleOpenIconPicker}
                                        className="w-full mt-1 p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between hover:border-indigo-500 hover:ring-2 hover:ring-indigo-50 transition-all group"
                                     >
                                         <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                 {getGenericIcon(modal.data.icon || 'Layers', "w-6 h-6")}
                                             </div>
                                             <div className="text-left">
                                                 <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Selected</div>
                                                 <div className="font-semibold text-gray-900">{modal.data.icon || 'Layers'}</div>
                                             </div>
                                         </div>
                                         <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">CHANGE</div>
                                     </button>
                                </div>
                             )}
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
                        <button onClick={onSave} className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                            Update Button
                        </button>
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
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
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
                                                onUpdateData('platform', p);
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
                                    onChange={e => onUpdateData('url', e.target.value)} 
                                    className={errors.url ? `${INPUT_ERROR_CLASS} pl-10` : `${INPUT_CLASS} pl-10`} 
                                    placeholder={modal.data.platform === 'email' ? 'you@example.com' : 'username'} 
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    {getSocialIcon(modal.data.platform, "w-4 h-4")}
                                </div>
                            </div>
                            {errors.url && <span className="text-xs text-red-500 font-medium">{errors.url}</span>}
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
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
                        <button onClick={onSave} className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">Add Icon</button>
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
                                    // Icon selection always updates the 'icon' field
                                    onUpdateData('icon', iconName);
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
    </>
  );
};

export default EditModals;