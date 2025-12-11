export interface LinkItem {
  id: string;
  url: string;
  title: string;
}

export interface NotificationConfig {
  enabled: boolean;
  notifyAtTime: boolean;
  notifyBeforeMinutes: number | null; // e.g., 15 minutes before
}

export interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  links: LinkItem[];
  dueDate: string | null; // ISO string
  completed: boolean;
  createdAt: string;
  notificationConfig: NotificationConfig;
  timeSpentSeconds: number; // For the timer feature
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export type FilterType = 'all' | 'today' | 'upcoming' | 'completed';

export const COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
];