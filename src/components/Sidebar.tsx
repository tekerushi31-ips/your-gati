import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { PageView } from '../context/AppContext';
import type { UserRole } from '../types';
import { 
  Home, 
  PlusCircle, 
  Cpu, 
  Building2, 
  Briefcase, 
  GitBranch, 
  MapPin,
  ListOrdered,
  User,
  Settings,
  Bell,
  LogOut,
  HelpCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  Layers,
  Users,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage } = useApp();
  const { profile, logout } = useAuth();

  const currentRole: UserRole = profile?.role || 'citizen';

  const roleNavItems: Record<UserRole, { id: PageView; label: string; icon: any; section?: string }[]> = {
    citizen: [
      { id: 'citizen-dashboard', label: 'Dashboard', icon: Home, section: 'OVERVIEW' },
      { id: 'citizen-challenges', label: 'My Challenges', icon: ListOrdered, section: 'CHALLENGES' },
      { id: 'citizen-track', label: 'Track Challenge', icon: GitBranch, section: 'CHALLENGES' },
      { id: 'citizen-report', label: 'Report Challenge', icon: PlusCircle, section: 'REPORTING' },
      { id: 'citizen-nearby', label: 'Nearby Issues', icon: MapPin, section: 'REPORTING' },
      { id: 'citizen-notifications', label: 'Notifications', icon: Bell, section: 'ACCOUNT' },
      { id: 'citizen-profile', label: 'Profile', icon: User, section: 'ACCOUNT' },
      { id: 'citizen-settings', label: 'Settings', icon: Settings, section: 'ACCOUNT' }
    ],
    university: [
      { id: 'university-dashboard', label: 'Dashboard', icon: Building2, section: 'OVERVIEW' },
      { id: 'create-project', label: 'Create Project', icon: PlusCircle, section: 'PROJECTS' },
      { id: 'project-lifecycle', label: 'My Projects', icon: GitBranch, section: 'PROJECTS' },
      { id: 'industry-dashboard', label: 'Industry Collaboration', icon: Briefcase, section: 'COLLABORATION' },
      { id: 'ai-analysis', label: 'AI Intelligence Hub', icon: Cpu, section: 'ANALYTICS' }
    ],
    industry: [
      { id: 'industry-dashboard', label: 'Dashboard', icon: Briefcase, section: 'OVERVIEW' },
      { id: 'project-lifecycle', label: 'Active Projects', icon: GitBranch, section: 'PROJECTS' },
      { id: 'university-dashboard', label: 'University Network', icon: Building2, section: 'COLLABORATION' },
      { id: 'ai-analysis', label: 'AI Reports', icon: Cpu, section: 'ANALYTICS' }
    ],
    admin: [
      { id: 'admin-dashboard', label: 'Dashboard', icon: Home, section: 'OVERVIEW' },
      { id: 'admin-challenges', label: 'All Challenges', icon: ListOrdered, section: 'CHALLENGE MANAGEMENT' },
      { id: 'admin-pending', label: 'Pending Validation', icon: Clock, section: 'CHALLENGE MANAGEMENT' },
      { id: 'admin-in-progress', label: 'In Progress', icon: GitBranch, section: 'CHALLENGE MANAGEMENT' },
      { id: 'admin-resolved', label: 'Resolved', icon: CheckCircle2, section: 'CHALLENGE MANAGEMENT' },
      { id: 'admin-overdue', label: 'Overdue Alerts', icon: AlertTriangle, section: 'CHALLENGE MANAGEMENT' },
      { id: 'admin-universities', label: 'Universities', icon: Building2, section: 'INSTITUTION CONTROL' },
      { id: 'admin-assignments', label: 'Assignments', icon: ShieldCheck, section: 'INSTITUTION CONTROL' },
      { id: 'admin-industry', label: 'Industry Partners', icon: Briefcase, section: 'INDUSTRY COLLABORATION' },
      { id: 'admin-map', label: 'District Telemetry Map', icon: MapPin, section: 'FIELD OPERATIONS' },
      { id: 'admin-staff', label: 'Field Staff', icon: Users, section: 'FIELD OPERATIONS' },
      { id: 'admin-analytics', label: 'Analytics', icon: BarChart3, section: 'ANALYTICS' },
      { id: 'admin-reports', label: 'Reports', icon: FileSpreadsheet, section: 'ANALYTICS' },
      { id: 'admin-departments', label: 'Departments', icon: Layers, section: 'ANALYTICS' }
    ]
  };

  const navItems = roleNavItems[currentRole];
  const sections = Array.from(new Set(navItems.map(i => i.section || 'MAIN')));

  return (
    <aside className="w-[260px] bg-white border-r border-slate-200 hidden md:flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] select-none font-sans">
      <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
        
        {/* Brand Header */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-2xs">
              G
            </div>
            <span className="font-bold text-sm text-slate-900 tracking-tight">YOUR GATI</span>
          </div>
          <div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold rounded uppercase tracking-wider">
              {currentRole === 'admin' ? 'GOVERNMENT PORTAL' : `${currentRole.toUpperCase()} PORTAL`}
            </span>
          </div>
        </div>

        {/* Sectional Navigation */}
        {sections.map(section => {
          const items = navItems.filter(i => (i.section || 'MAIN') === section);
          return (
            <div key={section} className="space-y-1">
              <p className="px-3 text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                {section}
              </p>
              {items.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs transition-all text-left ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-950 font-semibold border-l-[3px] border-emerald-600 shadow-2xs' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}

      </div>

      {/* Footer Support & Logout */}
      <div className="p-4 border-t border-slate-200 space-y-1 bg-slate-50/50 text-xs">
        <button
          onClick={() => setActivePage('help-support')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Help & Support</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
