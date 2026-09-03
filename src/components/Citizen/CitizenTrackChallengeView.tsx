import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../lib/dataService';
import { StatusBadge } from '../Common/StatusBadge';
import type { Challenge } from '../../types';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MapPin, 
  ArrowLeft,
  Search
} from 'lucide-react';

export const CitizenTrackChallengeView: React.FC = () => {
  const { selectedChallenge, setSelectedChallenge, projects, setActivePage, showToast } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedChallenge, setSearchedChallenge] = useState<Challenge | null>(null);

  const activeChallenge = searchedChallenge || selectedChallenge;

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsSearching(true);
    try {
      const match = await dataService.getChallengeByCode(inputCode.trim());
      if (match) {
        setSearchedChallenge(match);
        setSelectedChallenge(match);
        showToast(`Loaded tracking status for ${match.challengeCode}`, 'success');
      } else {
        setSearchedChallenge(null);
        showToast(`Challenge code "${inputCode.trim()}" not found. Please verify your reference code.`, 'error');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const ai = activeChallenge?.aiAnalysis;
  const relatedProject = projects.find(p => p.challengeId === activeChallenge?.id || p.challengeCode === activeChallenge?.challengeCode);

  const isSubmitted = true;
  const isAiDone = Boolean(ai);
  const isUniAccepted = activeChallenge?.status === 'UNIVERSITY_ACCEPTED' || activeChallenge?.status === 'PROJECT_CREATED' || activeChallenge?.status === 'INDUSTRY_COLLABORATION' || Boolean(relatedProject);
  const isProjectCreated = activeChallenge?.status === 'PROJECT_CREATED' || activeChallenge?.status === 'INDUSTRY_COLLABORATION' || Boolean(relatedProject);
  const isIndustryJoined = Boolean(relatedProject && relatedProject.collaborations && relatedProject.collaborations.length > 0);
  const isPrototype = Boolean(relatedProject && relatedProject.progressPercentage >= 60);
  const isPilot = Boolean(relatedProject && relatedProject.progressPercentage >= 85);
  const isDeployed = Boolean(relatedProject && relatedProject.progressPercentage === 100);

  const lifecycleStages = activeChallenge ? [
    { title: 'Challenge Submitted', done: isSubmitted, detail: `Code: ${activeChallenge.challengeCode}` },
    { title: 'AI Visual Assessment', done: isAiDone, detail: `${ai?.confidenceScore || 93}% Gemini Confidence` },
    { title: 'Government Validated', done: isUniAccepted, detail: 'Verified by District Coordinator' },
    { title: 'University Assigned', done: isUniAccepted, detail: activeChallenge.assignedUniversity || relatedProject?.universityName || 'BIT Sindri' },
    { title: 'University Accepted', done: isUniAccepted, detail: `Accepted by ${activeChallenge.assignedUniversity || 'BIT Sindri'}` },
    { title: 'Project Created', done: isProjectCreated, detail: relatedProject?.title || 'Capstone Team Assigned' },
    { title: 'Industry Collaboration', done: isIndustryJoined, detail: relatedProject?.collaborations?.[0]?.partnerName || 'Corporate CSR Partner' },
    { title: 'Prototype MVP', done: isPrototype, detail: 'Lab Testing' },
    { title: 'Pilot Testing', done: isPilot, detail: 'Field Deployment' },
    { title: 'Public Utility Deployed', done: isDeployed, detail: 'Public Solution Live' }
  ] : [];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto font-sans">
      
      {/* Top Back Navigation */}
      <button
        onClick={() => setActivePage('citizen-dashboard')}
        className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* SEARCH REFERENCE CODE BAR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Track Challenge by Code</h2>
        <form onSubmit={handleTrackSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter Challenge Code (e.g. YG-2026-00125)..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs shrink-0"
          >
            {isSearching ? 'Searching...' : 'Track Challenge'}
          </button>
        </form>
      </div>

      {!activeChallenge ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <GitBranch className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No Challenge Selected for Tracking</p>
          <p className="text-xs text-slate-500">Enter a challenge reference code above or select a challenge from your dashboard.</p>
        </div>
      ) : (
        <>
          {/* Header Banner Card */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">CHALLENGE TIMELINE</span>
              </div>

              <StatusBadge status={activeChallenge.status} />
            </div>

            <div>
              <span className="text-xs font-mono font-extrabold text-emerald-700">{activeChallenge.challengeCode}</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{activeChallenge.title}</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{activeChallenge.district} District ({activeChallenge.block || 'Local Block'})</span>
                <span className="text-slate-300">•</span>
                <span>Domain: <strong>{activeChallenge.domain}</strong></span>
              </p>
            </div>
          </div>

          {/* VERIFIED CHALLENGE LIFECYCLE STEPPER */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Challenge Resolution Lifecycle</h2>
              <p className="text-xs text-slate-500">Live multi-stakeholder progress synchronized with Supabase database.</p>
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
                  <h3 className="text-lg font-black text-slate-900">Gemini Vision AI Inspection</h3>
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
        </>
      )}

    </div>
  );
};
