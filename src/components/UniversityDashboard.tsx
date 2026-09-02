import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

export const UniversityDashboard: React.FC = () => {
  const { 
    challenges, 
    projects, 
    acceptChallenge, 
    setSelectedChallenge, 
    setActivePage
  } = useApp();

  const { profile } = useAuth();

  const [confirmAcceptId, setConfirmAcceptId] = useState<string | null>(null);

  const universityName = profile?.organizationName || 'BIT Sindri';

  const openChallenges = challenges.filter(c => c.status === 'SUBMITTED' || c.status === 'VALIDATED' || c.status === 'UNDER_REVIEW' || c.status === 'submitted');
  const acceptedChallenges = challenges.filter(c => c.status === 'UNIVERSITY_ACCEPTED' || c.status === 'PROJECT_CREATED' || c.status === 'INDUSTRY_COLLABORATION' || c.status === 'assigned');

  const handleConfirmAccept = (challengeId: string) => {
    acceptChallenge(challengeId, universityName);
    setConfirmAcceptId(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-400">Academic Portal</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-mono text-emerald-400">{universityName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">University Innovation Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Evaluate grassroot challenges, accept institution assignments, and create mentored student capstones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Accepted</span>
            <span className="text-lg font-black text-emerald-400">{acceptedChallenges.length}</span>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Open Opportunities</span>
            <span className="text-lg font-black text-blue-400">{openChallenges.length}</span>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL FOR CHALLENGE ACCEPTANCE */}
      {confirmAcceptId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4 animate-slide-up">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Accept Challenge Assignment?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your institution (<strong>{universityName}</strong>) will take ownership of this challenge and transition it into a mentored research project.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmAcceptId(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmAccept(confirmAcceptId)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Confirm & Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPEN COMMUNITY CHALLENGES AVAILABLE FOR ACCEPTANCE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Open Community Challenges</h2>
            <p className="text-xs text-slate-500">Filtered for university research & capstone matching across Jharkhand.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{openChallenges.length} Pending Assignment</span>
        </div>

        {openChallenges.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No unassigned community challenges currently pending.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {openChallenges.map(ch => (
              <div key={ch.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {ch.challengeCode}
                    </span>
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase">
                      Urgency: {ch.urgency}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">{ch.title}</h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{ch.district} ({ch.block || 'District'})</span>
                    </div>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{ch.domain}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {ch.description}
                  </p>

                  {/* Gemini AI Highlights if present */}
                  {ch.aiAnalysis && (
                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                      <div className="flex items-center gap-1 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Gemini Vision AI Analysis</span>
                        <span className="font-mono text-blue-700">({ch.aiAnalysis.confidenceScore}% Confidence)</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-normal">
                        {ch.aiAnalysis.summary}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setSelectedChallenge(ch);
                      setActivePage('ai-analysis');
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => setConfirmAcceptId(ch.id)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Challenge</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACCEPTED PROJECTS SECTION */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900">Active University Innovation Projects</h2>
          <p className="text-xs text-slate-500">Projects currently undergoing faculty mentorship and student team development.</p>
        </div>

        <div className="space-y-4">
          {projects.map(proj => (
            <div key={proj.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded font-mono">
                    {proj.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{proj.challengeCode}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{proj.title}</h3>
                <p className="text-xs text-slate-500">Mentor: <strong>{proj.facultyMentor}</strong></p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.studentTeam.map((st, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Progress</span>
                  <span className="text-xl font-black text-blue-600 font-mono">{proj.progressPercentage}%</span>
                </div>

                <button
                  onClick={() => setActivePage('project-lifecycle')}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <span>Manage Milestones</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
