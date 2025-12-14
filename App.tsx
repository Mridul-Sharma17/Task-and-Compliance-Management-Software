import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/AdminDashboard';
import PartnerDashboard from './components/PartnerDashboard';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import CompanyList from './components/CompanyList';
import UserList from './components/UserList';
import Settings from './components/Settings';
import NotificationPanel from './components/NotificationPanel';
import NotificationBell from './components/NotificationBell';
import Login from './src/components/Login';
import { Task } from './src/services/taskService';
import { Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from './src/contexts/AuthContext';
import { useRealtimeTasks } from './src/hooks/useRealtimeTasks';
import { useDebounce } from './src/hooks/useDebounce';
import { taskService } from './src/services/taskService';

const App: React.FC = () => {
  const { user, loading: authLoading, profile, signOut } = useAuth();
  const { tasks, loading: tasksLoading, error } = useRealtimeTasks();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!debouncedSearch.trim()) return tasks;

    const query = debouncedSearch.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.company?.name.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  }, [tasks, debouncedSearch]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-lg">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleToggleStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const newStatus = task.status === 'completed' ? 'in_progress' : 'completed';
      const newProgress = newStatus === 'completed' ? 100 : 50;

      await taskService.updateTask(id, {
        status: newStatus,
        progress: newProgress
      });
      // The realtime subscription will update the UI automatically
    } catch (err) {
      console.error('Failed to update task:', err);
    }
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-xl bg-white/40 border border-white/50 focus:bg-white/60 focus:outline-none focus:ring-2 focus:ring-sea-200 text-sm text-slate-700 w-64 placeholder-slate-400 shadow-sm transition-all"
                    />
                </div>

                {/* Notifications */}
                <NotificationBell />

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-300/30">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-700 leading-none">
                          {profile?.full_name || user.email}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 capitalize">{profile?.role || 'User'}</p>
                    </div>
                    <img
                        src={profile?.avatar_url || "https://picsum.photos/100/100"}
                        alt="User"
                        className="w-10 h-10 rounded-xl border-2 border-white shadow-md object-cover"
                    />
                    <button
                      onClick={signOut}
                      className="p-2 rounded-xl bg-white/40 hover:bg-white/60 transition-colors border border-white/50 shadow-sm"
                      title="Logout"
                    >
                      <LogOut size={18} className="text-slate-600" />
                    </button>
                </div>
            </div>
            </header>

            {/* Scrollable Main View */}
            <main className="flex-1 overflow-y-auto pr-2 pb-10">
            {activeTab === 'dashboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {profile?.role === 'admin' ? (
                        <>
                            <AdminDashboard tasks={filteredTasks} onTasksUpdated={() => {}} />
                            <div className="mt-8">
                                <TaskList
                                  tasks={[...filteredTasks].sort((a, b) =>
                                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                                  ).slice(0, 3)}
                                  onTaskClick={handleTaskClick}
                                  userRole={profile?.role}
                                  userId={user?.id}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <PartnerDashboard tasks={filteredTasks} userId={user?.id} />
                            <div className="mt-8">
                                <TaskList
                                  tasks={[...filteredTasks].sort((a, b) =>
                                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                                  ).slice(0, 3)}
                                  onTaskClick={handleTaskClick}
                                  userRole={profile?.role}
                                  userId={user?.id}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}

            {activeTab === 'tasks' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <TaskList
                      tasks={filteredTasks}
                      onTaskClick={handleTaskClick}
                      userRole={profile?.role}
                      userId={user?.id}
                    />
                </div>
            )}

            {/* Companies Tab */}
            {activeTab === 'companies' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CompanyList />
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <UserList />
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Settings />
                </div>
            )}

            {/* Placeholders for other tabs */}
            {(activeTab !== 'dashboard' && activeTab !== 'tasks' && activeTab !== 'companies' && activeTab !== 'users' && activeTab !== 'settings') && (
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

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};

export default App;