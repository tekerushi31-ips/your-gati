import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './Common/StatusBadge';
import { 
  Sparkles, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  Image as ImageIcon
} from 'lucide-react';

export const AIAnalysisView: React.FC = () => {
  const { selectedChallenge, setActivePage, acceptChallenge, setRole } = useApp();

  const challenge = selectedChallenge;

  if (!challenge) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-500 text-sm">No challenge selected for AI analysis.</p>
        <button
          onClick={() => setActivePage('submit-challenge')}
          className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
        >
          Submit a Challenge First
        </button>
      </div>
    );
  }

  const ai = challenge.aiAnalysis;
  const imageEvidence = challenge.evidence.find(e => e.type === 'image') || challenge.evidence[0];

  const handleUniversityAccept = async () => {
    setRole('university');
    await acceptChallenge(challenge.id, ai?.recommendedInstitutions[0] || 'BIT Sindri');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm text-emerald-400">YOUR GATI AI — Multimodal Vision Analysis</span>
            </div>

            <StatusBadge status={challenge.status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Gemini 2.5 Flash Visual Assessment
          </h1>

          <p className="text-xs sm:text-sm text-slate-300">
            Multimodal visual inspection & user reported context analyzed for academic matching in Jharkhand.
          </p>
        </div>
      </div>

      {/* TWO-COLUMN AI RESULT UI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Uploaded Image Preview & Visual Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Uploaded Evidence File</span>
              <span className="text-[10px] font-mono text-slate-400">{challenge.challengeCode}</span>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 aspect-video sm:aspect-square flex items-center justify-center">
              {imageEvidence ? (
                imageEvidence.type === 'image' ? (
                  <img
                    src={imageEvidence.url}
                    alt={challenge.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-4 text-center text-slate-300 text-xs">
                    <p className="font-bold">{imageEvidence.name}</p>
                    <span className="text-[10px] text-slate-400 uppercase">({imageEvidence.type})</span>
                  </div>
                )
              ) : (
                <div className="text-center p-6 text-slate-400 text-xs">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span>No image attached</span>
                </div>
              )}
              
              <div className="absolute top-2 left-2 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[10px] font-bold font-mono rounded border border-slate-700">
                Gemini Vision Inspected
              </div>
            </div>

            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Visual Evidence vs User Claims</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Gemini AI visually verifies observable features in the uploaded photo while maintaining clear distinction from unverified user-reported text claims.
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Structured AI Cards */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Problem Detected</span>
              <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">
                {ai?.problemDetected !== false ? '✓ Yes' : '✕ No'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Domain</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">
                {ai?.primaryCategory || challenge.domain}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">AI Severity</span>
              <span className={`text-xs font-black uppercase mt-0.5 block ${
                ai?.priority === 'CRITICAL' ? 'text-rose-600' :
                ai?.priority === 'HIGH' ? 'text-amber-600' : 'text-blue-600'
              }`}>
                {ai?.priority || challenge.urgency}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">AI Confidence</span>
              <span className="text-base font-black text-blue-600 font-mono mt-0.5 block">
                {ai?.confidenceScore || 93}%
              </span>
            </div>

          </div>

          {/* Issue & Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Identified Issue</span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{ai?.detectedIssue || challenge.title}</h2>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {ai?.summary || 'Multimodal analysis performed on reported challenge context.'}
            </p>
          </div>

          {/* VISUAL EVIDENCE SECTION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-800 tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Observed Visual Evidence (Gemini Detection)</span>
            </div>

            <ul className="space-y-2 text-xs">
              {(ai?.visibleEvidence || [
                'Visual distress features detected',
                'Infrastructure cavity observed'
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RECOMMENDED EXPERTISE & STAKEHOLDERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Required Academic Expertise</span>
              <div className="flex flex-wrap gap-1.5">
                {(ai?.requiredExpertise || ['Civil Engineering', 'Transportation Engineering']).map((exp, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[11px] font-semibold">
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Recommended Stakeholders</span>
              <div className="space-y-1">
                {(ai?.potentialIndustryPartners || ['Municipal Authority', 'University Research Cell']).map((stk, idx) => (
                  <p key={idx} className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                    <span>{stk}</span>
                  </p>
                ))}
              </div>
            </div>

          </div>

          {/* RECOMMENDED ACTION */}
          <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Recommended Action</span>
            <p className="font-extrabold text-slate-900 text-sm">{ai?.recommendedAction || 'Conduct physical engineering inspection and initiate repair project.'}</p>
          </div>

          {/* UNIVERSITY ACCEPTANCE CTA */}
          <div className="pt-2">
            <button
              onClick={handleUniversityAccept}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              <span>Accept Challenge as University ({ai?.recommendedInstitutions[0] || 'BIT Sindri'})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
