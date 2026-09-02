import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { 
  Bell, 
  Search, 
  Globe, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { activePage, language, setLanguage, notifications, markNotificationRead } = useApp();
  const { profile, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, string> = {
    citizen: 'CITIZEN',
    admin: 'GOVERNMENT',
    university: 'UNIVERSITY',
    industry: 'INDUSTRY'
  };

  const getPageTitle = (page: string) => {
    switch (page) {
      case 'citizen-dashboard': return 'Dashboard';
      case 'citizen-challenges': return 'My Challenges';
      case 'citizen-track': return 'Track Challenge';
      case 'citizen-report': return 'Report Challenge';
      case 'citizen-nearby': return 'Jharkhand Map';
      case 'admin-dashboard': return 'Dashboard';
      case 'admin-pending': return 'Validation Workspace';
      case 'admin-universities': return 'University Control';
      case 'admin-industry': return 'Industry Collaborations';
      case 'admin-map': return 'District Telemetry Map';
      case 'admin-analytics': return 'State Analytics';
      case 'university-dashboard': return 'Dashboard';
      case 'create-project': return 'Create Project';
      case 'industry-dashboard': return 'Dashboard';
      case 'project-lifecycle': return 'Project Lifecycle';
      default: return 'Dashboard';
    }
  };

  const getUserSubtext = () => {
    if (!profile) return 'Jharkhand';
    if (profile.role === 'citizen') return `${profile.district || 'Palamu'} District`;
    if (profile.role === 'admin') return profile.organizationName || 'Public Works Dept';
    if (profile.role === 'university') return profile.organizationName || 'BIT Sindri';
    if (profile.role === 'industry') return profile.organizationName || 'Tata Steel';
    return 'Jharkhand';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans shadow-2xs">
      
      {/* LEFT: Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {getPageTitle(activePage)}
        </h1>
      </div>

      {/* CENTER: Compact Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search challenges by code or keyword..."
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-9 pr-4 py-2 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
        />
      </div>

      {/* RIGHT: Controls & Compact Profile */}
      <div className="flex items-center gap-3">
        
        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase">{language}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-md py-1 w-28 text-xs font-semibold z-40">
              <button
                onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                className={`w-full px-3 py-1.5 text-left hover:bg-slate-50 ${language === 'en' ? 'text-emerald-700 font-bold' : 'text-slate-700'}`}
              >
                English
              </button>
              <button
                onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                className={`w-full px-3 py-1.5 text-left hover:bg-slate-50 ${language === 'hi' ? 'text-emerald-700 font-bold' : 'text-slate-700'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => { setLanguage('mr'); setShowLangMenu(false); }}
                className={`w-full px-3 py-1.5 text-left hover:bg-slate-50 ${language === 'mr' ? 'text-emerald-700 font-bold' : 'text-slate-700'}`}
              >
                मराठी
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-1.5 right-1.5"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-40 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] font-semibold text-emerald-700">{unreadCount} Unread</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {notifications.slice(0, 4).map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-2 rounded-lg text-xs cursor-pointer ${n.read ? 'bg-slate-50 text-slate-600' : 'bg-emerald-50/70 text-slate-900 font-medium'}`}
                  >
                    <p className="font-bold text-[11px]">{n.title}</p>
                    <p className="text-[10px] text-slate-500 truncate">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200"></div>

        {/* Compact User Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center">
            {profile?.fullName ? profile.fullName.charAt(0) : 'U'}
          </div>

          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 leading-none">
                {profile?.fullName || 'User'}
              </span>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded uppercase">
                {roleLabels[profile?.role || 'citizen']}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              {getUserSubtext()}
            </span>
          </div>

          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

    </header>
  );
};
