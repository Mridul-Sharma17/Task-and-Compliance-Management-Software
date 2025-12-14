import React, { useState } from 'react';
import { Task } from '../src/services/taskService';
import GlassPanel from './GlassPanel';
import { STATUS_COLORS } from '../constants';
import { Clock, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  userRole?: 'admin' | 'partner' | 'manager' | 'staff';
  userId?: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick, userRole = 'admin', userId }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter tasks based on role and filters
  let filteredTasks = tasks;

  // Role-based filtering (only show assigned tasks for non-admin)
  if (userRole !== 'admin' && userId) {
    filteredTasks = filteredTasks.filter(t => t.assignee_id === userId);
  }

  // Status filtering
  if (statusFilter !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.status === statusFilter);
  }

  // Priority filtering
  if (priorityFilter !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);
  }

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-slate-800">Active Tasks</h2>
        <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium px-2 py-1 bg-white/50 hover:bg-white/70 rounded text-slate-500 cursor-pointer outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs font-medium px-2 py-1 bg-white/50 hover:bg-white/70 rounded text-slate-500 cursor-pointer outline-none"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-20 text-slate-400">No tasks found.</div>
      ) : (
        filteredTasks.map((task) => (
          <GlassPanel 
            key={task.id} 
            onClick={() => onTaskClick(task)}
            className="p-4 group relative overflow-hidden"
          >
             {/* Left color bar indicator based on priority */}
             <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                 task.priority === 'high' ? 'bg-rose-400' :
                 task.priority === 'medium' ? 'bg-amber-400' : 'bg-slate-300'
             }`} />

            <div className="flex flex-col md:flex-row md:items-center justify-between pl-3 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-sea-600 uppercase tracking-wide">{task.client || task.company?.name || 'Unknown'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className={`text-[10px] px-1.5 rounded border ${
                        task.priority === 'high' ? 'border-rose-200 text-rose-500' : 'border-slate-200 text-slate-400'
                    }`}>
                        {task.priority}
                    </span>
                </div>
                <h3 className={`font-medium text-slate-800 group-hover:text-sea-700 transition-colors ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                </h3>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-500 w-32">
                    <Clock size={14} />
                    <span>{task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</span>
                </div>

                <div className="w-24">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[task.status] || 'text-slate-500'}`}>
                        {task.status}
                    </span>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-white shadow-sm">
                    {typeof task.assignee === 'string' ? task.assignee.charAt(0) : task.assignee?.full_name?.charAt(0) || '?'}
                </div>
              </div>
            </div>
            
            {/* Progress Bar (Subtle) */}
            {task.status !== 'completed' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100">
                    <div
                        className="h-full bg-sea-400 opacity-50"
                        style={{ width: `${task.progress}%` }}
                    />
                </div>
            )}
          </GlassPanel>
        ))
      )}
    </div>
  );
};

export default TaskList;