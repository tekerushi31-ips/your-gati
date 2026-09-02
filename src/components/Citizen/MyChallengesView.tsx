import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Clock, 
  PlusCircle, 
  GitBranch
} from 'lucide-react';

export const MyChallengesView: React.FC = () => {
  const { challenges, projects, setSelectedChallenge, setSelectedProject, setActivePage } = useApp();
  const { profile } = useAuth();

  const myChallenges = challenges.filter(c => {
    if (profile?.id && c.createdBy) return c.createdBy === profile.id;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-600">Citizen Portal</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">{profile?.fullName || 'Citizen Reporter'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">My Reported Societal Challenges</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track real-time progress as universities accept your report, create capstones, and onboard industry partners.
          </p>
        </div>

        <button
          onClick={() => setActivePage('submit-challenge')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Report New Challenge</span>
        </button>
      </div>

      {/* Empty State */}
      {myChallenges.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No community challenges reported yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Be the first to report a societal issue affecting your community in Jharkhand.
          </p>
          <button
            onClick={() => setActivePage('submit-challenge')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Report a Challenge
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myChallenges.map((ch) => {
            const relatedProject = projects.find(p => p.challengeId === ch.id || p.challengeCode === ch.challengeCode);
            const isUniAccepted = ch.status === 'UNIVERSITY_ACCEPTED' || ch.status === 'PROJECT_CREATED' || ch.status === 'INDUSTRY_COLLABORATION' || Boolean(relatedProject);
            const isProjectCreated = ch.status === 'PROJECT_CREATED' || ch.status === 'INDUSTRY_COLLABORATION' || Boolean(relatedProject);
            const isIndustryJoined = Boolean(relatedProject && relatedProject.collaborations.length > 0);

            return (
              <div key={ch.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                
                {/* Challenge Header info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {ch.challengeCode}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Domain: <strong>{ch.domain}</strong></span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    ch.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                    ch.urgency === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Urgency: {ch.urgency}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">{ch.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{ch.district} District ({ch.block || 'Local Block'})</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{ch.description}</p>
                </div>

                {/* SINGLE SOURCE OF TRUTH REAL-TIME PROGRESS TRACKER */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Live System Resolution Progress
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    {/* Stage 1: Submitted */}
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submitted</span>
                      </div>
                      <p className="text-[10px] text-slate-300">Registered in Database</p>
                    </div>

                    {/* Stage 2: University Accepted */}
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      isUniAccepted ? 'bg-slate-800 border-blue-500/50 text-blue-300' : 'bg-slate-950/60 border-slate-850 text-slate-500'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold">
                        {isUniAccepted ? <CheckCircle2 className="w-4 h-4 text-blue-400" /> : <Clock className="w-4 h-4" />}
                        <span>University Accepted</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {isUniAccepted ? (ch.assignedUniversity || relatedProject?.universityName || 'BIT Sindri') : 'Pending Review'}
                      </p>
                    </div>

                    {/* Stage 3: Project Created */}
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      isProjectCreated ? 'bg-slate-800 border-purple-500/50 text-purple-300' : 'bg-slate-950/60 border-slate-850 text-slate-500'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold">
                        {isProjectCreated ? <CheckCircle2 className="w-4 h-4 text-purple-400" /> : <Clock className="w-4 h-4" />}
                        <span>Project Created</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {relatedProject ? relatedProject.title : 'Pending Team Assignment'}
                      </p>
                    </div>

                    {/* Stage 4: Industry Partner Joined */}
                    <div className={`p-3 rounded-xl border space-y-1 ${
                      isIndustryJoined ? 'bg-slate-800 border-emerald-500/50 text-emerald-300' : 'bg-slate-950/60 border-slate-850 text-slate-500'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold">
                        {isIndustryJoined ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4" />}
                        <span>Industry Partner</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {isIndustryJoined ? relatedProject?.collaborations[0]?.partnerName : 'Open Opportunity'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setSelectedChallenge(ch);
                      setActivePage('ai-analysis');
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Gemini Vision AI Analysis</span>
                  </button>

                  {relatedProject && (
                    <button
                      onClick={() => {
                        setSelectedProject(relatedProject);
                        setActivePage('project-lifecycle');
                      }}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Track Project Lifecycle ({relatedProject.progressPercentage}%)</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
