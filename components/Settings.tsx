import React, { useState } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import GlassPanel from './GlassPanel';
import { User, Mail, Shield, Key, Bell, Palette } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    taskUpdates: true,
    deadlineReminders: true,
    weeklyDigest: false,
  });

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Settings</h2>

      {/* Profile Section */}
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-sea-600" size={24} />
          <h3 className="text-lg font-semibold text-slate-800">Profile Information</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profile?.full_name || ''}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-sea-600" />
              <span className="capitalize font-medium text-slate-700">{profile?.role}</span>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Notification Settings */}
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-sea-600" size={24} />
          <h3 className="text-lg font-semibold text-slate-800">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-700">Email Notifications</div>
              <div className="text-sm text-slate-500">Receive email notifications for important updates</div>
            </div>
            <button
              onClick={() => handleNotificationToggle('email')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.email ? 'bg-sea-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-700">Task Updates</div>
              <div className="text-sm text-slate-500">Get notified when tasks are assigned or updated</div>
            </div>
            <button
              onClick={() => handleNotificationToggle('taskUpdates')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.taskUpdates ? 'bg-sea-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.taskUpdates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-700">Deadline Reminders</div>
              <div className="text-sm text-slate-500">Receive reminders for upcoming task deadlines</div>
            </div>
            <button
              onClick={() => handleNotificationToggle('deadlineReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.deadlineReminders ? 'bg-sea-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.deadlineReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-700">Weekly Digest</div>
              <div className="text-sm text-slate-500">Get a weekly summary of your tasks and activities</div>
            </div>
            <button
              onClick={() => handleNotificationToggle('weeklyDigest')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.weeklyDigest ? 'bg-sea-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* Appearance */}
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="text-sea-600" size={24} />
          <h3 className="text-lg font-semibold text-slate-800">Appearance</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
            <div className="text-sm text-slate-500">Theme customization coming soon</div>
          </div>
        </div>
      </GlassPanel>

      {/* Security */}
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="text-sea-600" size={24} />
          <h3 className="text-lg font-semibold text-slate-800">Security</h3>
        </div>

        <div className="space-y-4">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
            Change Password
          </button>
          <div className="text-sm text-slate-500">Password management coming soon</div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default Settings;
