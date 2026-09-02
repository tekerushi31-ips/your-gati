import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const IndustryDashboardView: React.FC = () => {
  const { projects, setActivePage, setSelectedProject } = useApp();

  const activeCollabsCount = projects.reduce((acc, p) => acc + (p.collaborations ? p.collaborations.length : 0), 0);
  const openOpportunitiesCount = projects.length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto font-sans">
      
      {/* Page Title & Operational Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Partner with universities to turn societal challenges into deployable solutions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActivePage('industry-dashboard')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-2xs flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>PLEDGE CSR SUPPORT</span>
          </button>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">OPEN OPPORTUNITIES</span>
          <p className="text-3xl font-bold text-slate-900 font-mono">{openOpportunitiesCount}</p>
          <span className="text-[11px] text-slate-500 font-medium">University Capstones</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider block">ACTIVE COLLABORATIONS</span>
          <p className="text-3xl font-bold text-purple-600 font-mono">{activeCollabsCount}</p>
          <span className="text-[11px] text-purple-700 font-semibold">CSR Partnerships</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">SUPPORT PLEDGED</span>
          <p className="text-3xl font-bold text-emerald-600 font-mono">Hardware + Funding</p>
          <span className="text-[11px] text-emerald-700 font-semibold">R&D Lab Sponsorship</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">PILOT DEPLOYMENTS</span>
          <p className="text-3xl font-bold text-blue-600 font-mono">2</p>
          <span className="text-[11px] text-blue-700 font-semibold">Field Implementations</span>
        </div>

      </div>

      {/* UNIVERSITY PROJECT OPPORTUNITIES */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900">University Project Opportunities</h2>
          <p className="text-xs text-slate-500">Active university capstone teams requesting hardware, mentorship, or pilot deployment support.</p>
        </div>

        <div className="space-y-3">
          {projects.map(proj => (
            <div key={proj.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">{proj.challengeCode}</span>
                  <span className="text-xs font-bold text-indigo-700">{proj.universityName}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{proj.title}</h4>
                <p className="text-xs text-slate-600 mt-1">Mentor: <strong>{proj.facultyMentor}</strong> | District: <strong>{proj.district}</strong></p>
              </div>

              <button
                onClick={() => {
                  setSelectedProject(proj);
                  setActivePage('project-lifecycle');
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg shadow-2xs shrink-0 flex items-center gap-1 transition-all"
              >
                <span>View & Collaborate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
