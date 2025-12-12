import React from 'react';
import { X, Calendar, User, Flag, Paperclip, CheckCircle2, Circle } from 'lucide-react';
import { Task, Priority } from '../types';
import GlassPanel from './GlassPanel';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
}

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const colors = {
    High: 'text-rose-600 bg-rose-50 ring-1 ring-rose-200',
    Medium: 'text-amber-600 bg-amber-50 ring-1 ring-amber-200',
    Low: 'text-sky-600 bg-sky-50 ring-1 ring-sky-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${colors[priority]}`}>
      {priority} Priority
    </span>
  );
};

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onToggleStatus }) => {
  if (!task) return null;

  const isCompleted = task.status === 'Completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <GlassPanel className="relative w-full max-w-2xl bg-white/70 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
                {task.id}
             </div>
             <PriorityBadge priority={task.priority} />
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto">
          <h2 className={`text-2xl font-semibold text-slate-800 mb-2 ${isCompleted ? 'line-through decoration-slate-300 text-slate-400' : ''}`}>
            {task.title}
          </h2>
          <div className="text-sea-600 font-medium mb-6 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-sea-400"></span>
             {task.client}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Calendar size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Due Date</p>
                <p className="text-sm font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg">
                <User size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Assignee</p>
                <p className="text-sm font-medium">{task.assignee}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Description</h3>
            <p className="text-slate-600 leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Attachments Placeholder */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">Attachments</h3>
                <button className="text-xs font-medium text-sea-600 hover:text-sea-700">Add New</button>
            </div>
            <div className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50/50 hover:border-sea-300 transition-colors cursor-pointer group">
                <Paperclip size={24} className="mb-2 group-hover:text-sea-500 transition-colors" />
                <span className="text-sm">Click to upload working papers or drafts</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <div className="flex gap-2">
              {task.tags.map(tag => (
                  <span key={tag} className="text-xs text-slate-500 px-2 py-1 bg-white border border-slate-200 rounded-md">
                      #{tag}
                  </span>
              ))}
           </div>
           
           <button 
             onClick={() => {
                onToggleStatus(task.id);
                if (!isCompleted) onClose();
             }}
             className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all active:scale-95
                ${isCompleted 
                    ? 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700' 
                    : 'bg-sea-500 text-white hover:bg-sea-600 shadow-sea-500/20'}
             `}
           >
             {isCompleted ? (
                <>Mark Incomplete</>
             ) : (
                <>
                    <CheckCircle2 size={18} />
                    Mark as Complete
                </>
             )}
           </button>
        </div>
      </GlassPanel>
    </div>
  );
};

export default TaskModal;