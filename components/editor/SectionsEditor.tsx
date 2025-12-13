
import React, { useState } from 'react';
import { SectionConfig, SectionItem } from '../../types';
import { Plus, ChevronUp, ChevronDown, Edit2, Trash2, Layers, Settings, Folder, List } from 'lucide-react';
import { getGenericIcon } from '../Icons';

interface SectionsEditorProps {
  sections: SectionConfig[];
  onAddSection: () => void;
  onEditSectionTrigger: (index: number) => void;
  onDeleteSection: (index: number) => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
  
  onAddItem: (sectionIndex: number) => void;
  onEditItem: (sectionIndex: number, itemIndex: number) => void;
  onDeleteItem: (sectionIndex: number, itemIndex: number) => void;
  onMoveItem: (sectionIndex: number, itemIndex: number, direction: 'up' | 'down') => void;
}

const SectionsEditor: React.FC<SectionsEditorProps> = ({ 
    sections,
    onAddSection,
    onEditSectionTrigger,
    onDeleteSection,
    onMoveSection,
    onAddItem,
    onEditItem,
    onDeleteItem,
    onMoveItem
}) => {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  return (
    <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 m-0">Sections ({sections.length}/4)</h2>
            {sections.length < 4 && (
                <button onClick={onAddSection} className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Section
                </button>
            )}
        </div>

        <div className="space-y-6">
            {sections.map((section, sIdx) => (
                <div key={section.id || sIdx} className="bg-gray-50/50 border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-indigo-200 hover:shadow-sm">
                    
                    {/* Section Header / Trigger Config */}
                    <div className="p-4 bg-white border-b border-gray-100">
                        <div className="flex items-start justify-between gap-4">
                             {/* Trigger Preview */}
                             <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedSection(expandedSection === sIdx ? null : sIdx)}>
                                 {section.thumbnail ? (
                                     <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                         <img src={section.thumbnail} className="w-full h-full object-cover" />
                                     </div>
                                 ) : (
                                     <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                         {getGenericIcon(section.icon || 'Layers', "w-5 h-5")}
                                     </div>
                                 )}
                                 <div>
                                     <h3 className="font-bold text-gray-900 leading-tight">{section.title}</h3>
                                     <p className="text-xs text-gray-500 truncate">{section.description || 'No description'}</p>
                                 </div>
                             </div>

                             <div className="flex items-center gap-1">
                                 <div className="flex flex-col mr-1">
                                     <button onClick={() => onMoveSection(sIdx, 'up')} disabled={sIdx === 0} className="p-0.5 text-gray-300 hover:text-indigo-600 disabled:opacity-20"><ChevronUp className="w-3 h-3"/></button>
                                     <button onClick={() => onMoveSection(sIdx, 'down')} disabled={sIdx === sections.length - 1} className="p-0.5 text-gray-300 hover:text-indigo-600 disabled:opacity-20"><ChevronDown className="w-3 h-3"/></button>
                                 </div>
                                 <button onClick={() => onEditSectionTrigger(sIdx)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Edit Section Settings"><Settings className="w-4 h-4"/></button>
                                 <button onClick={() => onDeleteSection(sIdx)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete Section"><Trash2 className="w-4 h-4"/></button>
                             </div>
                        </div>
                    </div>

                    {/* Section Content */}
                    {expandedSection === sIdx && (
                        <div className="p-3 bg-gray-50 border-t border-gray-100 shadow-inner">
                            <div className="flex justify-between items-center mb-3 px-1">
                                <span className="text-[10px] font-bold uppercase text-gray-400">Content Items ({section.items?.length || 0})</span>
                                <button onClick={() => onAddItem(sIdx)} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded hover:text-indigo-600 hover:border-indigo-300 font-bold flex items-center gap-1">
                                    <Plus className="w-3 h-3"/> Add Item
                                </button>
                            </div>

                            <div className="space-y-2 pl-2 border-l-2 border-indigo-100/50">
                                {section.items && section.items.length > 0 ? (
                                    section.items.map((item, iIdx) => (
                                        <div key={item.id || iIdx} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:border-indigo-200 transition-all">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                                                    {item.thumbnail ? <img src={item.thumbnail} className="w-full h-full object-cover"/> : <Folder className="w-3 h-3"/>}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium text-gray-800 truncate">{item.title}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                 <button onClick={() => onMoveItem(sIdx, iIdx, 'up')} disabled={iIdx === 0} className="text-gray-300 hover:text-indigo-600 disabled:opacity-20"><ChevronUp className="w-3 h-3"/></button>
                                                 <button onClick={() => onMoveItem(sIdx, iIdx, 'down')} disabled={iIdx === section.items.length - 1} className="text-gray-300 hover:text-indigo-600 disabled:opacity-20"><ChevronDown className="w-3 h-3"/></button>
                                                 <button onClick={() => onEditItem(sIdx, iIdx)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded"><Edit2 className="w-3.5 h-3.5"/></button>
                                                 <button onClick={() => onDeleteItem(sIdx, iIdx)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-400 text-xs italic">No items in this section.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {expandedSection !== sIdx && (
                         <div className="px-4 py-2 bg-gray-50/50 text-xs text-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setExpandedSection(sIdx)}>
                             Click to manage {section.items?.length || 0} items
                         </div>
                    )}
                </div>
            ))}
            
            {sections.length === 0 && (
                 <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <p className="text-gray-400 text-sm font-medium">No sections added yet.</p>
                    <button onClick={onAddSection} className="mt-3 text-xs px-4 py-2 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700">Create First Section</button>
                </div>
            )}
        </div>
    </section>
  );
};

export default SectionsEditor;
