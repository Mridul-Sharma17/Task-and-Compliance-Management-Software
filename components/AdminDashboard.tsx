import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import GlassPanel from './GlassPanel';
import CreateTaskModal from './CreateTaskModal';
import { Task } from '../src/services/taskService';
import { useAuth } from '../src/contexts/AuthContext';
import { Plus } from 'lucide-react';

interface AdminDashboardProps {
  tasks: Task[];
  onTasksUpdated?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ tasks, onTasksUpdated }) => {
  const { profile } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Calculate stats for ALL tasks
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  const overdue = tasks.filter(t =>
    t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
  ).length;

  const completionRate = Math.round((completed / total) * 100) || 0;

  const statusData = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending },
  ];

  const COLORS = ['#14b8a6', '#cbd5e1']; // Sea Green & Slate

  // Calculate real weekly throughput data (past 7 days)
  const getWeeklyThroughput = () => {
    const today = new Date();
    const past7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return past7Days.map((date) => {
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      const tasksCompletedOnDay = tasks.filter((task) => {
        if (task.status !== 'completed' || !task.updated_at) return false;
        const taskDate = new Date(task.updated_at);
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        );
      }).length;
      return { name: dayName, tasks: tasksCompletedOnDay };
    });
  };

  const activityData = getWeeklyThroughput();

  // Calculate staff workload
  const workloadByAssignee: { [key: string]: number } = {};
  tasks.forEach(task => {
    const assigneeName = typeof task.assignee === 'string'
      ? task.assignee
      : task.assignee?.full_name || 'Unassigned';
    workloadByAssignee[assigneeName] = (workloadByAssignee[assigneeName] || 0) + 1;
  });

  const staffWorkloadData = Object.entries(workloadByAssignee).map(([name, count]) => ({
    name,
    tasks: count
  })).slice(0, 5); // Show top 5

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Welcome Section */}
      <div className="col-span-12 mb-2">
        <h1 className="text-2xl font-semibold text-slate-800">
          {getGreeting()}, {profile?.full_name || 'Admin'}
        </h1>
        <p className="text-slate-500">Here's the compliance overview for today.</p>
        <p className="text-xs text-slate-400 mt-1 capitalize">Role: {profile?.role || 'user'}</p>
      </div>

      {/* Main Stats Cards */}
      <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-6">
        <GlassPanel className="p-6 flex flex-col justify-between col-span-3 lg:col-span-1">
          <h3 className="text-sm font-medium text-slate-500">Tasks Completed</h3>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-semibold text-slate-700">{completed}</span>
            <span className="text-sm text-slate-400 mb-1">/ {total}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-sea-500 rounded-full" style={{ width: `${completionRate}%` }}></div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 flex flex-col justify-between col-span-3 lg:col-span-1">
          <h3 className="text-sm font-medium text-slate-500">Pending Actions</h3>
          <div className="mt-2">
            <span className="text-3xl font-semibold text-amber-500">{pending}</span>
          </div>
          <p className="text-xs text-slate-400 mt-4">Awaiting action</p>
        </GlassPanel>

        <GlassPanel className="p-6 flex flex-col justify-between col-span-3 lg:col-span-1">
          <h3 className="text-sm font-medium text-slate-500">Overdue Tasks</h3>
          <div className="mt-2">
            <span className="text-3xl font-semibold text-rose-500">{overdue}</span>
          </div>
          <p className="text-xs text-slate-400 mt-4">Requires attention</p>
        </GlassPanel>

        {/* Bar Chart Section - Weekly Throughput */}
        <GlassPanel className="p-6 col-span-3 h-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Weekly Throughput</h3>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar
                dataKey="tasks"
                fill="#14b8a6"
                radius={[4, 4, 4, 4]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassPanel>

        {/* Bar Chart Section - Staff Workload */}
        <GlassPanel className="p-6 col-span-3 h-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Staff Workload</h3>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={staffWorkloadData} layout="vertical">
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={100} />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar
                dataKey="tasks"
                fill="#14b8a6"
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassPanel>
      </div>

      {/* Side Stats / Chart + Create Button */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Create Task Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full py-3 px-4 bg-sea-500 hover:bg-sea-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-sea-500/20 hover:shadow-sea-500/40 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Create Task
        </button>

        {/* Completion Status Pie Chart */}
        <GlassPanel className="p-6 h-full min-h-[300px] flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-slate-700 w-full text-left mb-4">Completion Status</h3>
          <div className="w-48 h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text for Donut */}
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-bold text-slate-700">{completionRate}%</span>
              <span className="text-xs text-slate-400">Done</span>
            </div>
          </div>

          <div className="w-full mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sea-500"></span>
                <span className="text-slate-600">Completed</span>
              </div>
              <span className="font-medium text-slate-700">{completed}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                <span className="text-slate-600">Pending</span>
              </div>
              <span className="font-medium text-slate-700">{pending}</span>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          onTasksUpdated?.();
        }}
      />
    </div>
  );
};

export default AdminDashboard;
