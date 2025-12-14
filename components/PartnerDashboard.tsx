import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import GlassPanel from './GlassPanel';
import { Task } from '../src/services/taskService';
import { useAuth } from '../src/contexts/AuthContext';

interface PartnerDashboardProps {
  tasks: Task[];
  userId?: string;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ tasks, userId }) => {
  const { profile, user } = useAuth();
  const currentUserId = userId || user?.id;

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Filter tasks for current user only
  const myTasks = tasks.filter(t => t.assignee_id === currentUserId);

  // Calculate stats for personal tasks
  const total = myTasks.length;
  const completed = myTasks.filter(t => t.status === 'completed').length;
  const pending = myTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  const overdue = myTasks.filter(t =>
    t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
  ).length;

  const completionRate = Math.round((completed / total) * 100) || 0;

  const statusData = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending },
  ];

  const COLORS = ['#14b8a6', '#cbd5e1']; // Sea Green & Slate

  // Calculate real weekly progress data (past 7 days - personal tasks only)
  const getWeeklyProgress = () => {
    const today = new Date();
    const past7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return past7Days.map((date) => {
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      const tasksCompletedOnDay = myTasks.filter((task) => {
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

  const activityData = getWeeklyProgress();

  // Get next 5 tasks by due date
  const upcomingTasks = myTasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 5);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Welcome Section */}
      <div className="col-span-12 mb-2">
        <h1 className="text-2xl font-semibold text-slate-800">
          {getGreeting()}, {profile?.full_name || 'Partner'}
        </h1>
        <p className="text-slate-500">Here are your tasks for today.</p>
        <p className="text-xs text-slate-400 mt-1 capitalize">Role: {profile?.role || 'user'}</p>
      </div>

      {/* Main Stats Cards */}
      <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-6">
        <GlassPanel className="p-6 flex flex-col justify-between col-span-3 lg:col-span-1">
          <h3 className="text-sm font-medium text-slate-500">My Completed</h3>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-semibold text-slate-700">{completed}</span>
            <span className="text-sm text-slate-400 mb-1">/ {total}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-sea-500 rounded-full" style={{ width: `${completionRate}%` }}></div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 flex flex-col justify-between col-span-3 lg:col-span-1">
          <h3 className="text-sm font-medium text-slate-500">My Pending</h3>
          <div className="mt-2">
            <span className="text-3xl font-semibold text-amber-500">{pending}</span>
          </div>
          <p className="text-xs text-slate-400 mt-4">Awaiting action</p>
        </GlassPanel>

        <GlassPanel className="p-6 flex flex-col justify-between col-span-3 lg:col-span-1">
          <h3 className="text-sm font-medium text-slate-500">My Overdue</h3>
          <div className="mt-2">
            <span className="text-3xl font-semibold text-rose-500">{overdue}</span>
          </div>
          <p className="text-xs text-slate-400 mt-4">Requires attention</p>
        </GlassPanel>

        {/* Bar Chart Section - Personal Progress */}
        <GlassPanel className="p-6 col-span-3 h-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">My Weekly Progress</h3>
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
      </div>

      {/* Side Stats / Chart */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Upcoming Deadlines */}
        <GlassPanel className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => (
                <div key={task.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-b-0">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-sea-500 mt-1.5"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{task.title}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No upcoming tasks</p>
            )}
          </div>
        </GlassPanel>

        {/* Completion Status Pie Chart */}
        <GlassPanel className="p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-slate-700 w-full text-left mb-4">Completion Rate</h3>
          <div className="w-40 h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
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
              <span className="text-xl font-bold text-slate-700">{completionRate}%</span>
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
    </div>
  );
};

export default PartnerDashboard;
