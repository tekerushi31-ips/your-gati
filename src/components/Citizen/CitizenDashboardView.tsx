import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  PlusCircle, 
  ArrowRight
} from 'lucide-react';

export const CitizenDashboardView: React.FC = () => {
  const { challenges, setSelectedChallenge, setActivePage } = useApp();
  const { profile } = useAuth();

  const citizenDistrict = profile?.district || 'Palamu';
  const myChallenges = challenges.filter(c => c.district === citizenDistrict || true);

  const totalCount = myChallenges.length;
  const pendingCount = myChallenges.filter(c => c.status === 'SUBMITTED' || c.status === 'submitted' || c.status === 'UNDER_REVIEW').length;
  const inProgressCount = myChallenges.filter(c => 
    c.status === 'VALIDATED' || 
    c.status === 'UNIVERSITY_ASSIGNED' || 
    c.status === 'UNIVERSITY_ACCEPTED' || 
    c.status === 'PROJECT_CREATED' || 
    c.status === 'INDUSTRY_COLLABORATION'
  ).length;
  const resolvedCount = myChallenges.filter(c => c.status === 'DEPLOYED' || c.status === 'IMPACT_MEASURED' || c.status === 'pilot').length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto font-sans">
      
      {/* Page Title & Operational Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track submitted challenges and project progress in {citizenDistrict} District.
          </p>
        </div>

        <button
          onClick={() => setActivePage('citizen-report')}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ REPORT CHALLENGE</span>
        </button>
      </div>

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">TOTAL CHALLENGES</span>
          <p className="text-3xl font-bold text-slate-900 font-mono">{totalCount}</p>
          <span className="text-xs text-slate-500 font-medium">Logged in DB</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] uppercase font-bold text-amber-700 tracking-wider block">PENDING</span>
          <p className="text-3xl font-bold text-amber-600 font-mono">{pendingCount}</p>
          <span className="text-xs text-amber-700 font-semibold">Under Admin Review</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] uppercase font-bold text-blue-700 tracking-wider block">IN PROGRESS</span>
          <p className="text-3xl font-bold text-blue-600 font-mono">{inProgressCount}</p>
          <span className="text-xs text-blue-700 font-semibold">University R&D Active</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider block">RESOLVED</span>
          <p className="text-3xl font-bold text-emerald-600 font-mono">{resolvedCount}</p>
          <span className="text-xs text-emerald-700 font-semibold">Utility Deployed</span>
        </div>

      </div>

      {/* MY CHALLENGES TABLE */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Challenges</h2>
            <p className="text-xs text-slate-500">Live status of reported public issues.</p>
          </div>

          <button
            onClick={() => setActivePage('citizen-challenges')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <th className="py-3 px-4">Challenge ID</th>
                <th className="py-3 px-4">Challenge</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {myChallenges.slice(0, 5).map(ch => (
                <tr key={ch.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ch.challengeCode}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">{ch.title}</td>
                  <td className="py-3.5 px-4 text-slate-600">{ch.district}</td>
                  <td className="py-3.5 px-4 text-slate-600">{ch.domain}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ch.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                      ch.urgency === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ch.urgency}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {ch.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedChallenge(ch);
                        setActivePage('citizen-track');
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-300 shadow-2xs inline-flex items-center gap-1 transition-all"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
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
