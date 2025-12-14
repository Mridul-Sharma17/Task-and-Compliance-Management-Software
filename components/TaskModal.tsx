import React, { useState } from 'react';
import { X, Calendar, User, Flag, Paperclip, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../src/services/taskService';
import GlassPanel from './GlassPanel';
import DocumentUpload from './DocumentUpload';
import DocumentList from './DocumentList';

type Priority = 'high' | 'medium' | 'low';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
}

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const colors = {
    high: 'text-rose-600 bg-rose-50 ring-1 ring-rose-200',
    medium: 'text-amber-600 bg-amber-50 ring-1 ring-amber-200',
    low: 'text-sky-600 bg-sky-50 ring-1 ring-sky-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${colors[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
    </span>
  );
};

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onToggleStatus }) => {
  const [refreshDocuments, setRefreshDocuments] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!task) return null;

  const isCompleted = task.status === 'completed';

  const handleToggleStatus = () => {
    if (!isCompleted) {
      // Show confirmation only when marking as complete
      setShowConfirmation(true);
    } else {
      // Directly mark as incomplete
      onToggleStatus(task.id);
      onClose();
    }
  };

  const confirmComplete = () => {
    setShowConfirmation(false);
    onToggleStatus(task.id);
    onClose();
  };

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
             {task.company?.name || 'Unknown Company'}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Calendar size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Due Date</p>
                <p className="text-sm font-medium">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg">
                <User size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Assignee</p>
                <p className="text-sm font-medium">{typeof task.assignee === 'string' ? task.assignee : task.assignee?.full_name || 'Unassigned'}</p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-700">Progress</h3>
              <span className="text-sm font-medium text-slate-600">{task.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sea-500 transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Description</h3>
            <p className="text-slate-600 leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Attachments Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Documents</h3>

            {/* Document List */}
            <div className="mb-4">
              <DocumentList
                key={refreshDocuments}
                taskId={task.id}
                onDocumentDeleted={() => setRefreshDocuments(prev => prev + 1)}
              />
            </div>

            {/* Document Upload */}
            <div className="mb-2">
              <p className="text-xs text-slate-500 mb-3">Add new documents:</p>
              <DocumentUpload
                taskId={task.id}
                onUploadSuccess={() => setRefreshDocuments(prev => prev + 1)}
              />
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
             onClick={handleToggleStatus}
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

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowConfirmation(false)}
          />

          {/* Dialog */}
          <GlassPanel className="relative max-w-md bg-white/70 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Mark Task Complete?</h3>
              <p className="text-sm text-slate-600">
                Are you sure you want to mark <span className="font-medium">"{task.title}"</span> as complete?
              </p>
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmComplete}
                  className="px-4 py-2 rounded-lg bg-sea-500 text-white hover:bg-sea-600 transition"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};

export default TaskModal;