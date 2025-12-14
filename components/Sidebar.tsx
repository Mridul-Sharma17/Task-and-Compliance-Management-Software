import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, FileText, Calendar, Settings, PieChart, LogOut, ChevronLeft, ChevronRight, Menu, Building, Users } from 'lucide-react';
import GlassPanel from './GlassPanel';
import { useAuth } from '../src/contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut, profile } = useAuth();

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'All Tasks', icon: CheckSquare },
    { id: 'companies', label: 'Companies', icon: Building },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  const partnerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  const menuItems = profile?.role === 'admin' ? adminMenuItems : partnerMenuItems;

  return (
    <GlassPanel className={`h-full flex flex-col p-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} !rounded-none border-y-0 border-l-0 z-10`}>
      
      {/* Header / Logo / Toggle */}
      <div className={`flex items-center mb-8 mt-2 relative ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
        {!isCollapsed ? (
            <>
                <div className="flex items-center overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-sea-500 flex items-center justify-center shadow-md shadow-sea-500/30 flex-shrink-0">
                      <span className="text-white font-bold">G</span>
                    </div>
                    <span className="ml-3 text-lg font-semibold text-slate-700 tracking-tight whitespace-nowrap">
                      GlassDesk<span className="text-sea-500">.cs</span>
                    </span>
                </div>
                <button 
                    onClick={() => setIsCollapsed(true)}
                    className="p-1.5 rounded-lg hover:bg-white/50 text-slate-400 hover:text-slate-600 transition-colors absolute -right-2"
                >
                    <ChevronLeft size={16} />
                </button>
            </>
        ) : (
            <div className="flex flex-col items-center w-full gap-6">
                 <div className="w-8 h-8 rounded-lg bg-sea-500 flex items-center justify-center shadow-md shadow-sea-500/30">
                    <span className="text-white font-bold">G</span>
                 </div>
                 <button 
                    onClick={() => setIsCollapsed(false)}
                    className="p-1.5 rounded-lg hover:bg-white/50 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-sea-500/10 text-sea-700 shadow-sm border border-sea-500/20' 
                  : 'text-slate-500 hover:bg-white/40 hover:text-slate-700'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-sea-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {!isCollapsed && (
                  <span className={`ml-3 font-medium whitespace-nowrap overflow-hidden ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
              )}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sea-500 shadow-sm shadow-sea-500/50" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto pt-6 border-t border-slate-200/50 space-y-2">
        <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center p-3 rounded-xl text-slate-500 hover:bg-white/40 hover:text-slate-700 transition-colors ${isCollapsed ? 'justify-center' : ''} ${activeTab === 'settings' ? 'bg-white/60 text-sea-600' : ''}`}
            title={isCollapsed ? "Settings" : undefined}
        >
          <Settings size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">Settings</span>}
        </button>
        
        <button
            onClick={signOut}
            className={`w-full flex items-center p-3 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </GlassPanel>
  );
};

export default Sidebar;