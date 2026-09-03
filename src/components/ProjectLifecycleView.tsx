import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from './Common/StatusBadge';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock
} from 'lucide-react';

export const ProjectLifecycleView: React.FC = () => {
  const { selectedProject, updateMilestoneProgress } = useApp();
  const { profile } = useAuth();

  const proj = selectedProject;

  if (!proj) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-500 text-xs">No active project selected for lifecycle tracking.</p>
      </div>
    );
  }

  const isUniversityUser = profile?.role === 'university' || profile?.role === 'admin';

  const stages = [
    { title: 'Submitted', done: true, desc: 'Logged in Supabase' },
    { title: 'University Accepted', done: true, desc: proj.universityName },
    { title: 'Project Created', done: true, desc: proj.title },
    { title: 'Industry Partner', done: Boolean(proj.collaborations && proj.collaborations.length > 0), desc: proj.collaborations?.[0]?.partnerName || 'Pending Partner' },
    { title: 'Prototype', done: proj.progressPercentage >= 60, desc: 'Functional MVP' },
    { title: 'Pilot Testing', done: proj.progressPercentage >= 85, desc: 'Field Validation' },
    { title: 'Deployed', done: proj.progressPercentage === 100, desc: 'Public Utility' }
  ];

  const handleMilestoneToggle = (milestoneId: string, currentStatus: string) => {
    if (!isUniversityUser) return;
    const nextStatus = currentStatus === 'completed' || currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    const nextPct = nextStatus === 'COMPLETED' ? 100 : 0;
    updateMilestoneProgress(proj.id, milestoneId, nextStatus as any, nextPct);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 font-mono">SUPABASE-SYNCHRONIZED LIFECYCLE TRACKER</span>
          </div>
          <StatusBadge status={proj.status} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">{proj.title}</h1>
        <p className="text-xs text-slate-300">{proj.description}</p>
      </div>

      {/* STAGE TIMELINE BAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Verified System Stage Timeline</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
          {stages.map((st, idx) => (
            <div key={idx} className={`p-3 rounded-2xl border transition-all ${
              st.done ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 text-xs font-bold">
                {st.done ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
              </div>
              <p className="text-[11px] font-bold truncate">{st.title}</p>
              <p className="text-[9px] text-slate-500 truncate mt-0.5">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MILESTONES REAL TRACKER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Project Execution Milestones</h3>
            <p className="text-xs text-slate-500">
              {isUniversityUser ? 'Click milestone to update real Supabase database progress.' : 'Real-time view of university milestone completions.'}
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Overall Completion</span>
            <span className="text-2xl font-black text-blue-600">{proj.progressPercentage}%</span>
          </div>
        </div>

        <div className="space-y-3">
          {proj.milestones.map((ms) => {
            const isDone = ms.status === 'completed' || ms.status === 'COMPLETED';
            return (
              <div 
                key={ms.id} 
                onClick={() => handleMilestoneToggle(ms.id, ms.status)}
                className={`p-4 rounded-2xl border transition-all ${isUniversityUser ? 'cursor-pointer' : ''} ${
                  isDone ? 'bg-emerald-50/60 border-emerald-200 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                    isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{ms.title}</h4>
                      <span className="text-[10px] font-mono font-semibold text-slate-400">By: {ms.responsibleRole}</span>
                    </div>
                    <p className="text-xs text-slate-600">{ms.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
