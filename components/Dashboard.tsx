import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import GlassPanel from './GlassPanel';
import { Task } from '../src/services/taskService';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pending = total - completed;
  
  const completionRate = Math.round((completed / total) * 100) || 0;

  const statusData = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending },
  ];

  const COLORS = ['#14b8a6', '#cbd5e1']; // Sea Green & Slate

  // Mock data for weekly activity
  const activityData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 3 },
    { name: 'Wed', tasks: 7 },
    { name: 'Thu', tasks: 2 },
    { name: 'Fri', tasks: 5 },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Welcome Section */}
      <div className="col-span-12 mb-2">
        <h1 className="text-2xl font-semibold text-slate-800">Good Morning, Partner</h1>
        <p className="text-slate-500">Here's the compliance overview for today.</p>
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
            <p className="text-xs text-slate-400 mt-4">2 High Priority</p>
         </GlassPanel>

         <GlassPanel className="p-6 flex flex-col justify-between col-span-3 lg:col-span-1">
            <h3 className="text-sm font-medium text-slate-500">Upcoming Deadlines</h3>
             <div className="mt-2">
                <span className="text-3xl font-semibold text-slate-700">3</span>
            </div>
            <p className="text-xs text-slate-400 mt-4">Next 7 days</p>
         </GlassPanel>

         {/* Bar Chart Section */}
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
      </div>

      {/* Side Stats / Chart */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
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
    </div>
  );
};

export default Dashboard;