import React, { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import GlassPanel from './GlassPanel';
import { User, Mail, Shield, Calendar } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'partner' | 'manager' | 'staff';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'partner':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'manager':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'staff':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-rose-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Users</h2>
        <div className="text-sm text-slate-500">
          {users.length} {users.length === 1 ? 'user' : 'users'}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          No users found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <GlassPanel key={user.id} className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sea-400 to-sea-600 flex items-center justify-center text-white font-semibold">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">
                    {user.full_name || 'No Name'}
                  </h3>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border mt-1 ${getRoleBadgeColor(user.role)}`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} className="flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Shield size={14} className="flex-shrink-0" />
                  <span className="capitalize">{user.role} Access</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-200">
                  <Calendar size={12} />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
