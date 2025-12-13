import React from 'react';
import { LinkItem } from '../../types';
import { Plus, ChevronUp, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { getGenericIcon } from '../Icons';

interface LinksEditorProps {
  links: LinkItem[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

const LinksEditor: React.FC<LinksEditorProps> = ({ links, onAdd, onEdit, onDelete, onMove }) => {
  return (
    <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 m-0">Links</h2>
            <button onClick={onAdd} className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add
            </button>
        </div>

        <div className="space-y-2">
            {links.length > 0 ? (
                links.map((link, idx) => (
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
                                    onClick={() => onMove(idx, 'up')} 
                                    disabled={idx === 0}
                                    className="p-0.5 text-gray-300 hover:text-indigo-600 disabled:opacity-20"
                                >
                                    <ChevronUp className="w-3 h-3" />
                                </button>
                                <button 
                                    onClick={() => onMove(idx, 'down')} 
                                    disabled={idx === links.length - 1}
                                    className="p-0.5 text-gray-300 hover:text-indigo-600 disabled:opacity-20"
                                >
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                            </div>
                            <button onClick={() => onEdit(idx)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => onDelete(idx)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
  );
};

export default LinksEditor;
