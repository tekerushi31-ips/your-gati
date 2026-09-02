import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  MapPin, 
  Building2, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const AdminValidationView: React.FC = () => {
  const { selectedChallenge, challenges, validateChallenge, assignUniversityToChallenge, setActivePage, showToast } = useApp();

  const challenge = selectedChallenge || challenges.find(c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW') || challenges[0];

  if (!challenge) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-500 text-xs">No pending challenges found for validation.</p>
        <button
          onClick={() => setActivePage('admin-dashboard')}
          className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
        >
          Return to Admin Dashboard
        </button>
      </div>
    );
  }

  const ai = challenge.aiAnalysis;

  const handleValidate = () => {
    validateChallenge(challenge.id);
  };

  const handleAssignBIT = () => {
    assignUniversityToChallenge(challenge.id, 'BIT Sindri');
  };

  const handleReject = () => {
    showToast(`Challenge ${challenge.challengeCode} rejected by Government Admin.`, 'warning');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Back Navigation */}
      <button
        onClick={() => setActivePage('admin-dashboard')}
        className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">GOVERNMENT VALIDATION WORKSPACE</span>
          </div>

          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-mono font-extrabold rounded-full border border-amber-300 uppercase">
            STATUS: {challenge.status}
          </span>
        </div>

        <div>
          <span className="text-xs font-mono font-extrabold text-emerald-700">{challenge.challengeCode}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{challenge.title}</h1>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>{challenge.district} District ({challenge.block || 'Local Block'}, {challenge.villageCity || 'Jharkhand'})</span>
            <span className="text-slate-300">•</span>
            <span>Domain: <strong>{challenge.domain}</strong></span>
          </p>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: CITIZEN REPORT vs GEMINI AI ASSESSMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: CITIZEN REPORTED DATA */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Citizen Submission</h3>
            <span className="text-[10px] font-mono text-slate-400">Logged: {new Date(challenge.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Problem Description</span>
              <p className="text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 mt-1">
                {challenge.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Affected Population</span>
                <span className="font-extrabold text-slate-900">{challenge.affectedCount.toLocaleString()} Citizens</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Reported Urgency</span>
                <span className="font-extrabold text-amber-600">{challenge.urgency}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Expected Outcome / Solution</span>
              <p className="text-slate-700 font-medium mt-0.5">{challenge.expectedSolution || 'Public engineering repair required.'}</p>
            </div>

            {/* Evidence Image */}
            {challenge.evidence && challenge.evidence.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Uploaded Photo Evidence</span>
                <img 
                  src={challenge.evidence[0].url} 
                  alt="Citizen Evidence" 
                  className="w-full h-48 object-cover rounded-xl border border-slate-300 shadow-xs" 
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REAL GEMINI VISION AI ASSESSMENT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Gemini AI Visual Intelligence</h3>
            </div>
            {ai && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold font-mono rounded">
                {ai.confidenceScore}% AI Confidence
              </span>
            )}
          </div>

          {ai ? (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Problem Detected</span>
                  <span className="font-bold text-emerald-600">✓ Yes</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">AI Category</span>
                  <span className="font-bold text-slate-900 truncate block">{ai.primaryCategory}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Detected Issue</span>
                <p className="font-extrabold text-slate-900">{ai.detectedIssue}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Visual Evidence Features</span>
                <ul className="space-y-1">
                  {ai.visibleEvidence.map((ev, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Required Academic Expertise</span>
                <div className="flex flex-wrap gap-1">
                  {ai.requiredExpertise.map((exp, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded-md border border-blue-200">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Recommended Academic Match</span>
                <div className="flex flex-wrap gap-1">
                  {ai.recommendedInstitutions.map((inst, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-bold rounded-md border border-indigo-200">
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-8 text-center">Gemini AI visual assessment pending.</p>
          )}
        </div>

      </div>

      {/* GOVERNMENT ADMIN VALIDATION DECISION CONTROLS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Government Validation & Routing Decision</h3>
          <p className="text-xs text-slate-500">
            Official government action to validate the challenge and route it to suitable academic institutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleValidate}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>VALIDATE CHALLENGE</span>
          </button>

          <button
            onClick={handleAssignBIT}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <Building2 className="w-4 h-4" />
            <span>ASSIGN TO BIT SINDRI</span>
          </button>

          <button
            onClick={handleReject}
            className="px-5 py-3 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-xl border border-rose-300 transition-colors flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>REJECT REPORT</span>
          </button>
        </div>
      </div>

    </div>
  );
};
