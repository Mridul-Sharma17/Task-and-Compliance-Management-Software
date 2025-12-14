import React, { useEffect, useState } from 'react';
import GlassPanel from './GlassPanel';
import { Bell, CheckCircle, AlertCircle, UserPlus, FileText, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'task' | 'user' | 'document' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'task',
      title: 'New Task Assigned',
      message: 'You have been assigned to "Annual Report Filing"',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'task',
      title: 'Task Completed',
      message: 'Task "Board Meeting Minutes" has been completed',
      time: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'document',
      title: 'Document Uploaded',
      message: 'New document added to "Compliance Audit 2024"',
      time: '1 day ago',
      read: true,
    },
    {
      id: '4',
      type: 'user',
      title: 'New Team Member',
      message: 'John Doe joined the team as a Partner',
      time: '2 days ago',
      read: true,
    },
    {
      id: '5',
      type: 'system',
      title: 'System Update',
      message: 'New features are now available in the dashboard',
      time: '3 days ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle size={18} className="text-sea-600" />;
      case 'user':
        return <UserPlus size={18} className="text-purple-600" />;
      case 'document':
        return <FileText size={18} className="text-blue-600" />;
      case 'system':
        return <AlertCircle size={18} className="text-amber-600" />;
      default:
        return <Bell size={18} className="text-slate-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div className="fixed top-20 right-4 z-50 w-96 max-h-[600px] animate-in slide-in-from-top-4 duration-200">
        <GlassPanel className="shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-slate-700" />
              <h3 className="font-semibold text-slate-800">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-rose-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-slate-500" />
            </button>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="px-4 py-2 border-b border-slate-200 bg-white/40">
              <button
                onClick={markAllAsRead}
                className="text-xs text-sea-600 hover:text-sea-700 font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[500px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell size={48} className="mx-auto mb-2 opacity-20" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 hover:bg-white/40 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-sea-50/30' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`text-sm font-medium ${
                              !notification.read ? 'text-slate-900' : 'text-slate-700'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-sea-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassPanel>
      </div>
    </>
  );
};

export default NotificationPanel;
