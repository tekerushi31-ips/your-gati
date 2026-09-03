import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../Common/StatusBadge';
import { 
  Clock, 
  MapPin, 
  PlusCircle, 
  ArrowRight
} from 'lucide-react';

export const CitizenChallengesList: React.FC = () => {
  const { challenges, setSelectedChallenge, setActivePage } = useApp();
  const { profile } = useAuth();

  const myChallenges = challenges.filter(c => {
    if (profile?.id && c.createdBy) return c.createdBy === profile.id;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-600">Citizen Workspace</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">{profile?.fullName || 'Citizen Reporter'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">My Challenges</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registry of societal issues reported by your account across Jharkhand.
          </p>
        </div>

        <button
          onClick={() => setActivePage('citizen-report')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Report Challenge</span>
        </button>
      </div>

      {/* Challenges List */}
      {myChallenges.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No challenges submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Report a local challenge and let YOUR GATI connect it with the right experts.
          </p>
          <button
            onClick={() => setActivePage('citizen-report')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            + Report Challenge
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myChallenges.map(ch => (
            <div key={ch.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    {ch.challengeCode}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Domain: <strong>{ch.domain}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                    ch.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                    ch.urgency === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Urgency: {ch.urgency}
                  </span>

                  <StatusBadge status={ch.status} />
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">{ch.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{ch.district} ({ch.block || 'Local District'})</span>
                </p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {ch.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Logged: {new Date(ch.createdAt).toLocaleDateString()}
                </span>

                <button
                  onClick={() => {
                    setSelectedChallenge(ch);
                    setActivePage('citizen-track');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <span>View Details & Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
