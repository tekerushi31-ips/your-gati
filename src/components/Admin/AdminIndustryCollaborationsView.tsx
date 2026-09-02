import React from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase } from 'lucide-react';

export const AdminIndustryCollaborationsView: React.FC = () => {
  const { industryPartners, projects } = useApp();

  const allCollaborations = projects.flatMap(p => 
    (p.collaborations || []).map(c => ({
      ...c,
      projectTitle: p.title,
      projectCode: p.challengeCode,
      universityName: p.universityName
    }))
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-purple-700">Corporate CSR Registry</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-semibold">Industry-Academia Partnerships</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Industry Collaborations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor corporate CSR support, funding, mentorship, and pilot deployments pledged across Jharkhand.
          </p>
        </div>
      </div>

      {/* INDUSTRY PARTNERS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {industryPartners.map(partner => (
          <div key={partner.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-black">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{partner.name}</h3>
                  <p className="text-xs text-slate-500">{partner.sector} | {partner.location || 'Jharkhand'}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded-full border border-purple-300">
                ACTIVE PARTNER
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Contact Representative</span>
              <p className="font-bold text-slate-800 mt-0.5">{partner.contactPerson || 'CSR Lead'} ({partner.email || 'csr@partner.com'})</p>
            </div>

          </div>
        ))}
      </div>

      {/* ACTIVE COLLABORATIONS TABLE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Active Corporate Project Collaborations</h2>
          <p className="text-xs text-slate-500">Live pledges matched to university capstone innovation teams.</p>
        </div>

        {allCollaborations.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            No active corporate collaborations logged in database yet.
          </p>
        ) : (
          <div className="space-y-3">
            {allCollaborations.map(col => (
              <div key={col.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-slate-900">{col.projectCode}</span>
                    <span className="text-xs font-extrabold text-purple-700">{col.partnerName}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded">
                    Status: {col.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900">{col.projectTitle}</h4>
                <p className="text-xs text-slate-600">University Lead: <strong>{col.universityName}</strong></p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {(col.supportTypes || []).map((st: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
