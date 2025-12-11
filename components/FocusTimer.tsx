import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Timer, Minimize2, Calendar } from 'lucide-react';
import { Task } from '../types';

interface FocusTimerProps {
  activeTask: Task | null;
  onUpdateTaskTime: (taskId: string, newTime: number) => void;
  onStop: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ activeTask, onUpdateTaskTime, onStop }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Initialize/Reset logic
  useEffect(() => {
    if (activeTask) {
      // Only set elapsed if we are switching tasks. 
      // If activeTask updates (e.g. from parent sync), we trust our local timer first to avoid jitter.
      // However, if we start a fresh session, we pull from activeTask.
      setElapsed(activeTask.timeSpentSeconds || 0);
      setIsRunning(true);
      setIsMinimized(false);
    } else {
        setIsRunning(false);
    }
  }, [activeTask?.id]); // Depend only on ID to avoid resetting when 'activeTask' object reference changes due to updates

  // Timer Tick
  useEffect(() => {
    if (isRunning && activeTask) {
      intervalRef.current = window.setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, activeTask]);

  // Sync to Parent
  useEffect(() => {
    // Sync every 10 seconds or if stopping would happen
    if(isRunning && activeTask && elapsed > 0 && elapsed % 10 === 0) {
        // Only sync if local elapsed is greater than what we might have started with
        onUpdateTaskTime(activeTask.id, elapsed);
    }
  }, [elapsed, isRunning, activeTask, onUpdateTaskTime]);

  const toggleTimer = () => {
    if (isRunning && activeTask) {
       onUpdateTaskTime(activeTask.id, elapsed);
    }
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    if (activeTask) {
        onUpdateTaskTime(activeTask.id, elapsed);
    }
    setIsRunning(false);
    onStop();
  };

  if (!activeTask) return null;

  const formatTime = (seconds: number) => {
    const safeSeconds = seconds || 0;
    const h = Math.floor(safeSeconds / 3600);
    const m = Math.floor((safeSeconds % 3600) / 60);
    const s = safeSeconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDueTime = (isoString: string | null) => {
    if(!isoString) return null;
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  if (isMinimized) {
      return (
          <div className="fixed bottom-6 right-6 z-40 bg-indigo-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-all flex items-center gap-2 animate-bounce" onClick={() => setIsMinimized(false)}>
              <Timer size={20} className="animate-pulse" />
              <span className="font-mono font-bold text-sm">{formatTime(elapsed)}</span>
          </div>
      );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-white border border-indigo-100 p-6 rounded-3xl shadow-2xl w-80 animate-slide-in-up">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2 text-indigo-600">
            <Timer size={20} />
            <span className="font-bold text-xs uppercase tracking-widest">Focus Mode</span>
        </div>
        <button onClick={() => setIsMinimized(true)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Minimize2 size={18} />
        </button>
      </div>

      <div className="mb-8">
        <h4 className="font-bold text-gray-800 text-xl leading-tight line-clamp-2 mb-2" title={activeTask.title}>
            {activeTask.title}
        </h4>
        <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100`}>
                {activeTask.project}
            </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-indigo-50 rounded-full blur-3xl opacity-50 z-0"></div>
        <div className="text-6xl font-mono font-bold text-gray-800 tracking-tighter relative z-10 tabular-nums">
            {formatTime(elapsed)}
        </div>
        <p className="text-xs font-medium text-gray-400 mt-2 uppercase tracking-wide">time spent</p>
      </div>
      
      {activeTask.dueDate && (
        <div className="mb-8 flex items-center justify-center gap-2 text-sm bg-orange-50 text-orange-700 py-2 px-3 rounded-lg border border-orange-100">
            <Calendar size={14} />
            <span className="font-medium">Due: {formatDueTime(activeTask.dueDate)}</span>
        </div>
      )}

      <div className="flex items-center justify-center gap-6">
        <button 
            onClick={toggleTimer}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg transform active:scale-95 ${isRunning ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
        >
            {isRunning ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        <button 
            onClick={handleStop}
            className="w-14 h-14 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-all shadow hover:shadow-md"
        >
            <Square size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};