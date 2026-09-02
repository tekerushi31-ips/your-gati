import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2 } from 'lucide-react';

export const AdminUniversityAssignmentsView: React.FC = () => {
  const { universities, challenges, projects, assignUniversityToChallenge, setSelectedChallenge, setActivePage } = useApp();

  const validatedChallenges = challenges.filter(c => c.status === 'SUBMITTED' || c.status === 'VALIDATED' || c.status === 'submitted');

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-700">Institution Control</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-semibold">Higher Education R&D Network</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Universities & Challenge Routing</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign validated community challenges to engineering HEIs across Jharkhand.
          </p>
        </div>
      </div>

      {/* UNIVERSITIES LIST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {universities.map(uni => {
          const assignedCount = challenges.filter(c => c.assignedUniversity === uni.name || c.universityName === uni.name).length;
          const activeProjCount = projects.filter(p => p.universityName === uni.name).length;

          return (
            <div key={uni.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{uni.name}</h3>
                    <p className="text-xs text-slate-500">{uni.district} District, Jharkhand</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-300">
                  ACTIVE HEI
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Assigned</span>
                  <span className="font-extrabold text-slate-900">{assignedCount}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Projects</span>
                  <span className="font-extrabold text-indigo-600">{activeProjCount}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Status</span>
                  <span className="font-extrabold text-emerald-600">Active</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Key R&D Expertise</span>
                <div className="flex flex-wrap gap-1">
                  {(uni.expertise || ['Civil Engineering', 'Systems Innovation']).map((spec: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* CHALLENGE ASSIGNMENT MATCHMAKER TABLE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Challenges Ready for University Assignment</h2>
          <p className="text-xs text-slate-500">Route validated citizen challenges to matching university innovation labs.</p>
        </div>

        <div className="space-y-3">
          {validatedChallenges.map(ch => (
            <div key={ch.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-slate-900">{ch.challengeCode}</span>
                  <span className="text-xs text-slate-500 font-semibold">{ch.district} District</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{ch.title}</h4>
                <p className="text-xs text-slate-600 mt-1">Domain: <strong>{ch.domain}</strong> | Urgency: <strong>{ch.urgency}</strong></p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => assignUniversityToChallenge(ch.id, 'BIT Sindri')}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
                >
                  Assign BIT Sindri
                </button>

                <button
                  onClick={() => {
                    setSelectedChallenge(ch);
                    setActivePage('admin-pending');
                  }}
                  className="px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl border border-slate-300 transition-all"
                >
                  Review Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
