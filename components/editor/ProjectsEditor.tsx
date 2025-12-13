import React from 'react';
import { ProjectItem, ProjectCardConfig } from '../../types';
import { Plus, ChevronUp, ChevronDown, Edit2, Trash2, Layers, Settings, Folder } from 'lucide-react';
import { getGenericIcon } from '../Icons';

interface ProjectsEditorProps {
  projects: ProjectItem[];
  projectCard: ProjectCardConfig;
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onEditTrigger: () => void;
}

const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ 
    projects, 
    projectCard, 
    onAdd, 
    onEdit, 
    onDelete, 
    onMove, 
    onEditTrigger 
}) => {
  return (
    <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 m-0">Projects</h2>
            <button onClick={onAdd} className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
        </div>

        {/* Trigger Card Designer */}
        <div className="mb-6 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 rounded text-indigo-600">
                        <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">Portfolio Button Design</span>
                </div>
                <button 
                    onClick={onEditTrigger}
                    className="text-xs px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-indigo-300 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1 shadow-sm"
                >
                    <Settings className="w-3 h-3" /> Customize
                </button>
            </div>
            <div className="text-xs text-gray-500 pl-9">
                This is the main card that visitors click to open your project gallery.
                <div className="mt-2 flex items-center gap-2 p-2 bg-white rounded border border-gray-200 max-w-sm">
                    {projectCard.thumbnail ? (
                        <div className="w-6 h-6 rounded bg-gray-100 overflow-hidden"><img src={projectCard.thumbnail} className="w-full h-full object-cover"/></div>
                    ) : projectCard.icon ? (
                         <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-gray-500">{getGenericIcon(projectCard.icon, "w-4 h-4")}</div>
                    ) : null}
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 truncate">{projectCard.title}</div>
                        <div className="text-[10px] text-gray-400 truncate">{projectCard.description}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="space-y-2">
            {projects && projects.length > 0 ? (
                projects.map((proj, idx) => (
                    <div key={proj.id || idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                                {proj.thumbnail ? (
                                    <img src={proj.thumbnail} className="w-full h-full object-cover" /> 
                                ) : (
                                    // Default placeholder for items without images
                                    <Folder className="w-4 h-4 text-gray-300" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="font-semibold text-sm text-gray-800 truncate">{proj.title || "Untitled Project"}</div>
                                <div className="text-xs text-gray-400 truncate max-w-[150px]">{proj.description || "No description"}</div>
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
                                    disabled={idx === (projects?.length || 0) - 1}
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
                    <p className="text-gray-400 text-sm font-medium">No projects added yet.</p>
                </div>
            )}
        </div>
    </section>
  );
};

export default ProjectsEditor;