import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  PlusCircle, 
  ArrowRight
} from 'lucide-react';

export const UniversityDashboardView: React.FC = () => {
  const { challenges, projects, setSelectedChallenge, setActivePage } = useApp();
  const { profile } = useAuth();

  const uniName = profile?.organizationName || 'BIT Sindri';

  const assignedCount = challenges.filter(c => c.assignedUniversity === uniName || c.universityName === uniName || true).length;
  const activeProjectsCount = projects.filter(p => p.universityName === uniName || true).length;
  const acceptedCount = challenges.filter(c => c.status === 'UNIVERSITY_ACCEPTED' || c.status === 'PROJECT_CREATED' || c.status === 'INDUSTRY_COLLABORATION').length;
  const completedCount = projects.filter(p => p.progressPercentage === 100).length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto font-sans">
      
      {/* Page Title & Operational Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover societal challenges, build multidisciplinary solutions and track community impact.
          </p>
        </div>

        <button
          onClick={() => setActivePage('create-project')}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-2xs flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ CREATE PROJECT</span>
        </button>
      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">ASSIGNED</span>
          <p className="text-2xl font-bold text-slate-900 font-mono">{assignedCount}</p>
          <span className="text-[11px] text-slate-500 font-medium">Government Routed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">ACCEPTED</span>
          <p className="text-2xl font-bold text-emerald-600 font-mono">{acceptedCount}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">R&D Onboarded</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider block">ACTIVE PROJECTS</span>
          <p className="text-2xl font-bold text-indigo-600 font-mono">{activeProjectsCount}</p>
          <span className="text-[11px] text-indigo-700 font-semibold">Capstone Teams</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider block">INDUSTRY PARTNERS</span>
          <p className="text-2xl font-bold text-purple-600 font-mono">3</p>
          <span className="text-[11px] text-purple-700 font-semibold">CSR Sponsors</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block">COMPLETED</span>
          <p className="text-2xl font-bold text-teal-600 font-mono">{completedCount}</p>
          <span className="text-[11px] text-teal-700 font-semibold">Deployed Utility</span>
        </div>

      </div>

      {/* ASSIGNED CHALLENGES SECTION */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Challenges Assigned to {uniName}</h2>
            <p className="text-xs text-slate-500">Validated challenges routed by Government Admin based on required engineering expertise.</p>
          </div>

          <button
            onClick={() => setActivePage('university-dashboard')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {challenges.slice(0, 4).map(ch => (
            <div key={ch.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">{ch.challengeCode}</span>
                  <span className="text-xs font-medium text-slate-600">{ch.district} District</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded">
                    {ch.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{ch.title}</h4>
                <p className="text-xs text-slate-600 mt-1">Domain: <strong>{ch.domain}</strong> | Urgency: <strong>{ch.urgency}</strong></p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setSelectedChallenge(ch);
                    setActivePage('create-project');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-2xs transition-all"
                >
                  Accept & Build Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
