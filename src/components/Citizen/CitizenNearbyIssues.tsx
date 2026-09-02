import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { MapPin, ArrowRight } from 'lucide-react';

export const CitizenNearbyIssues: React.FC = () => {
  const { challenges, setSelectedChallenge, setActivePage } = useApp();
  const { profile } = useAuth();

  const userDistrict = profile?.district || 'Palamu';
  const nearbyChallenges = challenges.filter(c => c.district.toLowerCase() === userDistrict.toLowerCase() || true);

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700">Geo Telemetry</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono font-bold text-slate-600">{userDistrict} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Nearby Issues</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore reported societal challenges around your selected location in {userDistrict}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nearbyChallenges.map(ch => (
          <div key={ch.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {ch.challengeCode}
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded">
                  {ch.status}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900">{ch.title}</h3>

              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{ch.district} ({ch.block || 'Local District'})</span>
              </p>

              <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                {ch.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Domain: {ch.domain}</span>

              <button
                onClick={() => {
                  setSelectedChallenge(ch);
                  setActivePage('citizen-track');
                }}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors border border-emerald-200"
              >
                <span>View Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
