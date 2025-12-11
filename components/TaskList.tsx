import React from 'react';
import { Play, CheckCircle, Circle, Calendar, Link as LinkIcon, ExternalLink, Clock, Trash2, Edit3 } from 'lucide-react';
import { Task, LinkItem } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStartTimer: (task: Task) => void;
  onOpenLink: (url: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onDelete, onEdit, onStartTimer, onOpenLink }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
            <CheckCircle size={48} className="text-gray-300" />
        </div>
        <p className="text-lg font-medium">No tasks found</p>
        <p className="text-sm">Create a new task to get started</p>
      </div>
    );
  }

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  const formatTimeSpent = (seconds: number) => {
    if (seconds === 0) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-3 pb-24">
      {tasks.map(task => (
        <div 
          key={task.id} 
          className={`group bg-white rounded-xl p-4 border transition-all duration-200 hover:shadow-md ${task.completed ? 'border-gray-100 bg-gray-50/50' : 'border-gray-100'}`}
        >
          <div className="flex items-start gap-4">
            <button 
              onClick={() => onToggleComplete(task.id)}
              className={`mt-1 flex-shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'}`}
            >
              {task.completed ? <CheckCircle size={24} fill="currentColor" className="text-white" strokeWidth={2} stroke="currentColor" /> : <Circle size={24} />}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                 <div>
                    <h3 className={`font-semibold text-lg text-gray-800 leading-tight mb-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-600 border border-indigo-100">
                            {task.project}
                        </span>
                        {task.dueDate && (
                            <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${new Date(task.dueDate) < new Date() && !task.completed ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                <Calendar size={12} />
                                {formatDueDate(task.dueDate)}
                            </div>
                        )}
                        {task.timeSpentSeconds > 0 && (
                            <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                                <Clock size={12} />
                                {formatTimeSpent(task.timeSpentSeconds)}
                            </div>
                        )}
                        {task.notificationConfig.enabled && !task.completed && (
                            <div className="text-xs text-gray-400" title="Notifications enabled">
                                🔔
                            </div>
                        )}
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!task.completed && (
                        <button 
                            onClick={() => onStartTimer(task)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Start Focus Timer"
                        >
                            <Play size={18} />
                        </button>
                    )}
                    <button 
                        onClick={() => onEdit(task)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Task"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button 
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 size={18} />
                    </button>
                 </div>
              </div>

              {task.description && (
                <p className={`text-sm text-gray-600 mb-3 line-clamp-2 ${task.completed ? 'text-gray-400' : ''}`}>
                    {task.description}
                </p>
              )}

              {task.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {task.links.map(link => (
                        <button
                            key={link.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenLink(link.url);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all"
                        >
                            <LinkIcon size={12} />
                            <span className="max-w-[150px] truncate">{link.title}</span>
                            <ExternalLink size={10} className="opacity-50" />
                        </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};