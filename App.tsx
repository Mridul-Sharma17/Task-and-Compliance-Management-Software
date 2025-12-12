import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import { Task } from './types';
import { MOCK_TASKS } from './constants';
import { Bell, Search } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleToggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'Completed' ? 'In Progress' : 'Completed',
          progress: t.status === 'Completed' ? 50 : 100
        };
      }
      return t;
    }));
  };

  // Ensure selectedTask updates if the underlying data changes
  const currentSelectedTask = selectedTask ? tasks.find(t => t.id === selectedTask.id) || null : null;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar Navigation - Full Height */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex-1 flex flex-col h-full p-4 lg:p-8 overflow-hidden">
            
            {/* Top Header */}
            <header className="flex items-center justify-between mb-8 px-2 shrink-0">
            <h1 className="text-xl font-medium text-slate-500">
                {activeTab === 'dashboard' ? 'Overview' : 
                activeTab === 'tasks' ? 'Workstreams' : 
                activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>

            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sea-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search client or matter..." 
                        className="pl-10 pr-4 py-2 rounded-xl bg-white/40 border border-white/50 focus:bg-white/60 focus:outline-none focus:ring-2 focus:ring-sea-200 text-sm text-slate-700 w-64 placeholder-slate-400 shadow-sm transition-all"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl bg-white/40 hover:bg-white/60 transition-colors border border-white/50 shadow-sm">
                    <Bell size={20} className="text-slate-600" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-300/30">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-700 leading-none">Alex Morgan</p>
                        <p className="text-xs text-slate-400 mt-1">Senior Associate</p>
                    </div>
                    <img 
                        src="https://picsum.photos/100/100" 
                        alt="User" 
                        className="w-10 h-10 rounded-xl border-2 border-white shadow-md object-cover"
                    />
                </div>
            </div>
            </header>

            {/* Scrollable Main View */}
            <main className="flex-1 overflow-y-auto pr-2 pb-10">
            {activeTab === 'dashboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Dashboard tasks={tasks} />
                    <div className="mt-8">
                        <TaskList tasks={tasks.slice(0, 3)} onTaskClick={handleTaskClick} />
                    </div>
                </div>
            )}

            {activeTab === 'tasks' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
                </div>
            )}

            {/* Placeholders for other tabs */}
            {(activeTab !== 'dashboard' && activeTab !== 'tasks') && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <div className="p-8 rounded-full bg-white/20 mb-4 backdrop-blur-sm">
                        <Search size={48} className="opacity-50" />
                    </div>
                    <p>This module is currently under development.</p>
                </div>
            )}
            </main>
        </div>
      </div>

      {/* Detail Overlay */}
      {selectedTask && (
        <TaskModal 
          task={currentSelectedTask} 
          onClose={() => setSelectedTask(null)} 
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
};

export default App;