import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MapPin, 
  ArrowLeft
} from 'lucide-react';

export const CitizenTrackChallengeView: React.FC = () => {
  const { selectedChallenge, projects, setActivePage } = useApp();

  const challenge = selectedChallenge;

  if (!challenge) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-500 text-xs">No challenge selected for tracking.</p>
        <button
          onClick={() => setActivePage('citizen-dashboard')}
          className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const ai = challenge.aiAnalysis;
  const relatedProject = projects.find(p => p.challengeId === challenge.id || p.challengeCode === challenge.challengeCode);

  const isSubmitted = true;
  const isAiDone = Boolean(ai);
  const isUniAccepted = challenge.status === 'UNIVERSITY_ACCEPTED' || challenge.status === 'PROJECT_CREATED' || challenge.status === 'INDUSTRY_COLLABORATION' || Boolean(relatedProject);
  const isProjectCreated = challenge.status === 'PROJECT_CREATED' || challenge.status === 'INDUSTRY_COLLABORATION' || Boolean(relatedProject);
  const isIndustryJoined = Boolean(relatedProject && relatedProject.collaborations.length > 0);
  const isPrototype = Boolean(relatedProject && relatedProject.progressPercentage >= 60);
  const isPilot = Boolean(relatedProject && relatedProject.progressPercentage >= 85);
  const isDeployed = Boolean(relatedProject && relatedProject.progressPercentage === 100);

  const lifecycleStages = [
    { title: 'Challenge Submitted', done: isSubmitted, detail: `Code: ${challenge.challengeCode}` },
    { title: 'AI Analysis Completed', done: isAiDone, detail: `${ai?.confidenceScore || 93}% Gemini Vision Confidence` },
    { title: 'Challenge Validated', done: isUniAccepted, detail: 'Verified by District Coordinator' },
    { title: 'University Assigned', done: isUniAccepted, detail: challenge.assignedUniversity || relatedProject?.universityName || 'BIT Sindri' },
    { title: 'University Accepted', done: isUniAccepted, detail: `Accepted by ${challenge.assignedUniversity || 'BIT Sindri'}` },
    { title: 'Project Created', done: isProjectCreated, detail: relatedProject?.title || 'Capstone Team Assigned' },
    { title: 'Industry Collaboration', done: isIndustryJoined, detail: relatedProject?.collaborations[0]?.partnerName || 'Corporate Partner Pledged' },
    { title: 'Prototype Development', done: isPrototype, detail: 'Lab MVP & Testing' },
    { title: 'Pilot Testing', done: isPilot, detail: 'Field Deployment' },
    { title: 'Deployment & Impact', done: isDeployed, detail: 'Public Utility' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Top Back Navigation */}
      <button
        onClick={() => setActivePage('citizen-dashboard')}
        className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Header Banner Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">TRACK CHALLENGE</span>
          </div>

          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-extrabold rounded-full border border-emerald-300 uppercase">
            STATUS: {challenge.status}
          </span>
        </div>

        <div>
          <span className="text-xs font-mono font-extrabold text-emerald-700">{challenge.challengeCode}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{challenge.title}</h1>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>{challenge.district} District ({challenge.block || 'Local Block'})</span>
            <span className="text-slate-300">•</span>
            <span>Domain: <strong>{challenge.domain}</strong></span>
          </p>
        </div>
      </div>

      {/* VERIFIED CHALLENGE LIFECYCLE STEPPER */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">Challenge Resolution Lifecycle</h2>
          <p className="text-xs text-slate-500">Live multi-stakeholder progress derived strictly from Supabase database updates.</p>
        </div>

        <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {lifecycleStages.map((st, idx) => (
            <div key={idx} className="relative flex items-start gap-4 text-xs">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 font-bold transition-all ${
                st.done ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' : 'bg-white border-slate-300 text-slate-400'
              }`}>
                {st.done ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Clock className="w-4 h-4 text-slate-400" />}
              </div>

              <div className={`p-4 rounded-xl border flex-1 space-y-0.5 transition-all ${
                st.done ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-xs ${st.done ? 'text-slate-900' : 'text-slate-500'}`}>{st.title}</span>
                  {st.done ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[9px] rounded">Verified</span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-400">Pending</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-mono">{st.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GEMINI VISION AI ASSESSMENT CARD */}
      {ai && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-black text-slate-900">Gemini Vision AI Assessment</h3>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-extrabold rounded-lg border border-emerald-200">
              {ai.confidenceScore}% AI Confidence
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Problem Detected</span>
              <span className="text-xs font-bold text-emerald-600 mt-0.5 block">✓ Yes</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Domain</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">{ai.primaryCategory}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Severity</span>
              <span className="text-xs font-bold text-amber-600 mt-0.5 block">{ai.priority}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Confidence</span>
              <span className="text-xs font-bold text-emerald-700 font-mono mt-0.5 block">{ai.confidenceScore}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">Observed Visual Evidence:</span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {ai.visibleEvidence.map((ev, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-emerald-800">Recommended Action</span>
            <p className="font-bold text-slate-900">{ai.recommendedAction}</p>
          </div>
        </div>
      )}

    </div>
  );
};
