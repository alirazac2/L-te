import React, { useState, useEffect } from 'react';
import { X, Plus, Link as LinkIcon, Bell, Calendar, Clock, Trash2 } from 'lucide-react';
import { Project, Task, LinkItem, NotificationConfig } from '../types';

interface TaskFormProps {
  projects: Project[];
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'timeSpentSeconds' | 'completed'>) => void;
  onCancel: () => void;
  initialData?: Task;
  onCreateProject: (name: string) => string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ projects, onSave, onCancel, initialData, onCreateProject }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [project, setProject] = useState(initialData?.project || (projects[0]?.name || 'Inbox'));
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [links, setLinks] = useState<LinkItem[]>(initialData?.links || []);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  
  const [notifConfig, setNotifConfig] = useState<NotificationConfig>(initialData?.notificationConfig || {
    enabled: false,
    notifyAtTime: true,
    notifyBeforeMinutes: 15
  });

  const handleAddLink = () => {
    if (!newLinkUrl) return;
    const item: LinkItem = {
      id: Date.now().toString(),
      url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`,
      title: newLinkTitle || newLinkUrl
    };
    setLinks([...links, item]);
    setNewLinkUrl('');
    setNewLinkTitle('');
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const handleNotificationToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = e.target.checked;
    
    if (isEnabled) {
      if (!('Notification' in window)) {
        alert("This browser does not support desktop notifications");
        return;
      }
      
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert('Notification permission denied. Please enable it in your browser settings.');
          // Do not enable the switch if permission is denied
          return;
        }
      }
    }
    
    setNotifConfig({...notifConfig, enabled: isEnabled});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalProject = project;
    if (isCreatingProject && newProjectName.trim()) {
      finalProject = onCreateProject(newProjectName);
    }

    onSave({
      title,
      description,
      project: finalProject,
      links,
      dueDate: dueDate || null,
      notificationConfig: notifConfig
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">{initialData ? 'Edit Task' : 'New Task'}</h2>
            <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add details..."
                rows={3}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                {!isCreatingProject ? (
                  <div className="flex gap-2">
                    <select
                      value={project}
                      onChange={e => setProject(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsCreatingProject(true)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                      title="New Project"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={e => setNewProjectName(e.target.value)}
                      placeholder="Project Name"
                      className="flex-1 px-4 py-2 bg-white border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCreatingProject(false)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            {/* Notifications Config */}
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-indigo-900 font-medium">
                  <Bell size={18} />
                  <span>Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notifConfig.enabled}
                    onChange={handleNotificationToggle}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              {notifConfig.enabled && (
                <div className="space-y-3 pl-1 animate-fade-in">
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={notifConfig.notifyAtTime}
                      onChange={e => setNotifConfig({...notifConfig, notifyAtTime: e.target.checked})}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    At exact due time
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={notifConfig.notifyBeforeMinutes !== null}
                        onChange={e => setNotifConfig({...notifConfig, notifyBeforeMinutes: e.target.checked ? 15 : null})}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      Remind me beforehand:
                    </label>
                    {notifConfig.notifyBeforeMinutes !== null && (
                      <select 
                        value={notifConfig.notifyBeforeMinutes}
                        onChange={e => setNotifConfig({...notifConfig, notifyBeforeMinutes: Number(e.target.value)})}
                        className="text-sm bg-white border border-gray-200 rounded-md px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none"
                      >
                        <option value={5}>5 mins</option>
                        <option value={10}>10 mins</option>
                        <option value={15}>15 mins</option>
                        <option value={30}>30 mins</option>
                        <option value={60}>1 hour</option>
                      </select>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Links Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Links & Resources</label>
              
              <div className="space-y-2 mb-3">
                {links.map(link => (
                  <div key={link.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg group border border-gray-100 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-600">
                             <LinkIcon size={14} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-gray-700 truncate">{link.title}</span>
                            <span className="text-xs text-gray-400 truncate">{link.url}</span>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => removeLink(link.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={e => setNewLinkTitle(e.target.value)}
                  placeholder="Link Title (e.g. Design Doc)"
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <input
                  type="text"
                  value={newLinkUrl}
                  onChange={e => setNewLinkUrl(e.target.value)}
                  placeholder="URL (e.g. google.com)"
                  className="flex-[2] px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newLinkUrl}
                  className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
            >
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};