import React from 'react';
import { useApp } from '../context/AppContext';

export const GovernmentDashboard: React.FC = () => {
  const { challenges, projects, universities, industryPartners } = useApp();

  // Compute real database metrics
  const totalChallenges = challenges.length;
  const acceptedChallenges = challenges.filter(c => c.status !== 'SUBMITTED' && c.status !== 'VALIDATED').length;
  const totalProjects = projects.length;
  const partneredProjects = projects.filter(p => p.collaborations.length > 0).length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">Jharkhand State Administration</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-mono text-emerald-400">Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Jharkhand Innovation Command Center</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            System-wide aggregated metrics across all 24 districts, academic institutions, and industry partnerships.
          </p>
        </div>
      </div>

      {/* REAL DATABASE AGGREGATE KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Challenges Logged</span>
          <p className="text-3xl font-black text-slate-900 font-mono mt-1">{totalChallenges}</p>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">100% Real DB Queries</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">University Accepted</span>
          <p className="text-3xl font-black text-blue-600 font-mono mt-1">{acceptedChallenges}</p>
          <span className="text-[10px] text-blue-600 font-semibold block mt-1">{universities.length} Institutions Connected</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Capstone Projects</span>
          <p className="text-3xl font-black text-purple-600 font-mono mt-1">{totalProjects}</p>
          <span className="text-[10px] text-purple-600 font-semibold block mt-1">Under Faculty Mentorship</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Industry Collaborations</span>
          <p className="text-3xl font-black text-emerald-600 font-mono mt-1">{partneredProjects}</p>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">{industryPartners.length} Corporate Partners</span>
        </div>

      </div>

      {/* RECENT SYSTEM-WIDE CHALLENGES TABLE */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Statewide Challenges Overview</h3>
            <p className="text-xs text-slate-500">Live database registry of community reports across Jharkhand.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Ref Code</th>
                <th className="p-3">Title</th>
                <th className="p-3">District</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {challenges.map(ch => (
                <tr key={ch.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-600">{ch.challengeCode}</td>
                  <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{ch.title}</td>
                  <td className="p-3 text-slate-700">{ch.district}</td>
                  <td className="p-3 text-slate-700">{ch.domain}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {ch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
