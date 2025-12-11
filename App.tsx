import React, { useState, useEffect } from 'react';
import { Plus, ListFilter, Layout, Search, BellRing, Briefcase, CheckSquare, Calendar, Trash2 } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, Project, FilterType, COLORS } from './types';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { LinkModal } from './components/LinkModal';
import { FocusTimer } from './components/FocusTimer';

const App: React.FC = () => {
  // --- State ---
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', [
    { id: '1', name: 'Personal', color: COLORS[0] },
    { id: '2', name: 'Work', color: COLORS[7] },
  ]);
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [viewingLink, setViewingLink] = useState<string | null>(null);
  
  // Track active timer task by ID to avoid stale state objects
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // --- Derived State ---
  const activeTaskForTimer = activeTaskId ? tasks.find(t => t.id === activeTaskId) || null : null;

  const filteredTasks = tasks.filter(task => {
    // 1. Filter by Search
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Filter by Project Selection
    if (selectedProject && task.project !== selectedProject) return false;

    // 3. Filter by Tab (All, Today, Upcoming, Completed)
    if (filter === 'completed') return task.completed;
    if (filter === 'all') return !task.completed;
    
    if (filter === 'today') {
       if (task.completed) return false;
       if (!task.dueDate) return false;
       const today = new Date();
       const d = new Date(task.dueDate);
       return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    }
    
    if (filter === 'upcoming') {
        if (task.completed) return false;
        if (!task.dueDate) return false;
        return new Date(task.dueDate) > new Date();
    }

    return !task.completed;
  });

  // --- Handlers ---

  const handleCreateProject = (name: string) => {
    const existing = projects.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing.name;
    const newProject = { 
        id: Date.now().toString(), 
        name, 
        color: COLORS[projects.length % COLORS.length] 
    };
    setProjects([...projects, newProject]);
    return name;
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'timeSpentSeconds' | 'completed'>) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        completed: false,
        timeSpentSeconds: 0,
        ...taskData
      };
      setTasks([newTask, ...tasks]);
    }
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
      if (activeTaskId === id) setActiveTaskId(null);
    }
  };
  
  const clearCompletedTasks = () => {
    if (window.confirm('Are you sure you want to delete ALL completed tasks? This cannot be undone.')) {
        setTasks(tasks.filter(t => !t.completed));
    }
  };

  const updateTaskTime = (id: string, time: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, timeSpentSeconds: time } : t));
  };

  const handleStartTimer = (task: Task) => {
    setActiveTaskId(task.id);
  };

  // --- Notifications Logic ---
  useEffect(() => {
    const checkNotifications = () => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const now = new Date();
      
      tasks.forEach(task => {
        if (task.completed || !task.dueDate || !task.notificationConfig.enabled) return;
        
        const due = new Date(task.dueDate);
        const timeDiff = due.getTime() - now.getTime();
        const minutesDiff = Math.round(timeDiff / 60000);

        // Unique key for session storage to prevent spamming the same notification
        const notifKey = `notif-${task.id}-${due.getTime()}`;

        // Exact time notification (within 1 minute window)
        if (task.notificationConfig.notifyAtTime && Math.abs(minutesDiff) < 1) {
             if (!sessionStorage.getItem(notifKey + '-exact')) {
                 new Notification(`Task Due: ${task.title}`, { body: 'This task is due now!', icon: '/vite.svg' });
                 sessionStorage.setItem(notifKey + '-exact', 'true');
             }
        }

        // Before time notification
        const beforeMins = task.notificationConfig.notifyBeforeMinutes;
        if (beforeMins && Math.abs(minutesDiff - beforeMins) < 1) {
            if (!sessionStorage.getItem(notifKey + '-before')) {
                new Notification(`Upcoming Task: ${task.title}`, { body: `Due in ${beforeMins} minutes.`, icon: '/vite.svg' });
                sessionStorage.setItem(notifKey + '-before', 'true');
            }
        }
      });
    };

    const interval = setInterval(checkNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [tasks]);

  const getPageTitle = () => {
    if (selectedProject) return selectedProject;
    switch(filter) {
        case 'all': return 'All Tasks';
        case 'today': return 'Today';
        case 'upcoming': return 'Upcoming';
        case 'completed': return 'Completed Tasks';
        default: return 'TaskFlow';
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full">
        <div className="p-6">
            <h1 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <CheckSquare size={20} className="text-white" strokeWidth={3} />
                </div>
                TaskFlow
            </h1>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-6">
            {/* Filters */}
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Filters</p>
                <ul className="space-y-1">
                    {[
                        { id: 'all', icon: Layout, label: 'All Tasks' },
                        { id: 'today', icon: BellRing, label: 'Today' },
                        { id: 'upcoming', icon: Calendar, label: 'Upcoming' },
                        { id: 'completed', icon: CheckSquare, label: 'Completed' }
                    ].map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => { setFilter(item.id as FilterType); setSelectedProject(null); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === item.id && !selectedProject ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Projects */}
            <div>
                <div className="flex items-center justify-between px-2 mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Projects</p>
                    <span className="text-xs text-gray-300">{projects.length}</span>
                </div>
                <ul className="space-y-1">
                    {projects.map(proj => (
                        <li key={proj.id}>
                            <button
                                onClick={() => { setSelectedProject(proj.name); setFilter('all'); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedProject === proj.name ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Briefcase size={18} className={selectedProject === proj.name ? 'text-indigo-600' : 'text-gray-400'} />
                                {proj.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
             <div className="flex items-center gap-4 md:hidden">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <CheckSquare size={20} className="text-white" />
                </div>
                <span className="font-bold text-gray-800">TaskFlow</span>
             </div>

             <div className="hidden md:block text-lg font-semibold text-gray-800">
                {getPageTitle()}
             </div>

             <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-1.5 bg-gray-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-full text-sm outline-none transition-all w-40 md:w-64"
                    />
                </div>
                
                <button 
                    onClick={() => { setEditingTask(undefined); setIsFormOpen(true); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Add Task</span>
                </button>
             </div>
        </header>

        {/* Task List Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header for Completed Tasks Page */}
                {filter === 'completed' && !selectedProject && tasks.some(t => t.completed) && (
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={clearCompletedTasks}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Trash2 size={16} />
                            Clear All Completed
                        </button>
                    </div>
                )}
                
                <TaskList 
                    tasks={filteredTasks}
                    onToggleComplete={toggleComplete}
                    onDelete={deleteTask}
                    onEdit={(t) => { setEditingTask(t); setIsFormOpen(true); }}
                    onStartTimer={handleStartTimer}
                    onOpenLink={setViewingLink}
                />
            </div>
        </div>
      </main>

      {/* Modals & Overlays */}
      {isFormOpen && (
        <TaskForm 
            projects={projects}
            onSave={handleSaveTask}
            onCancel={() => setIsFormOpen(false)}
            initialData={editingTask}
            onCreateProject={handleCreateProject}
        />
      )}

      {viewingLink && (
        <LinkModal 
            url={viewingLink}
            onClose={() => setViewingLink(null)}
        />
      )}

      <FocusTimer 
        activeTask={activeTaskForTimer}
        onStop={() => setActiveTaskId(null)}
        onUpdateTaskTime={updateTaskTime}
      />
    </div>
  );
};

export default App;