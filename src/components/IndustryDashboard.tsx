import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from './Common/StatusBadge';
import { Modal } from './Common/Modal';
import type { SupportType } from '../types';
import { 
  Building2, 
  CheckCircle2, 
  Handshake, 
  MapPin
} from 'lucide-react';

export const IndustryDashboard: React.FC = () => {
  const { projects, collaborateOnProject } = useApp();
  const { profile } = useAuth();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedSupportTypes, setSelectedSupportTypes] = useState<SupportType[]>(['Hardware', 'Funding']);
  const [collaborationNotes, setCollaborationNotes] = useState('Pledging equipment and CSR research grant.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const industryName = profile?.organizationName || 'Tata Steel CSR & Industry Partners';

  const availableSupportTypes: SupportType[] = [
    'Mentorship', 
    'Funding', 
    'Hardware', 
    'Software', 
    'Testing', 
    'Pilot Deployment'
  ];

  const handleSupportTypeToggle = (st: SupportType) => {
    setSelectedSupportTypes(prev => 
      prev.includes(st) ? prev.filter(t => t !== st) : [...prev, st]
    );
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || selectedSupportTypes.length === 0) return;

    setIsSubmitting(true);
    try {
      await collaborateOnProject(selectedProjectId, industryName, selectedSupportTypes, collaborationNotes);
      setSelectedProjectId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-400">Industry CSR Hub</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-mono text-emerald-400">{industryName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Corporate Collaboration Portal</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Sponsor academic research capstones, provide technical hardware, and deploy field pilots across Jharkhand.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Open Opportunities</span>
            <span className="text-lg font-black text-purple-400">{projects.length}</span>
          </div>
        </div>
      </div>

      {/* ACCESSIBLE COLLABORATION PLEDGE MODAL */}
      <Modal
        isOpen={Boolean(selectedProjectId)}
        onClose={() => setSelectedProjectId(null)}
        title="Pledge Industry Collaboration"
        maxWidth="lg"
      >
        <form onSubmit={handlePledgeSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Support Offerings <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {availableSupportTypes.map(st => {
                const isChecked = selectedSupportTypes.includes(st);
                return (
                  <button
                    type="button"
                    key={st}
                    onClick={() => handleSupportTypeToggle(st)}
                    className={`p-2.5 rounded-xl border font-bold transition-all text-left flex items-center justify-between ${
                      isChecked 
                        ? 'bg-purple-50 border-purple-500 text-purple-900' 
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{st}</span>
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pledge-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-700">Pledge Details / Notes</label>
            <textarea
              id="pledge-notes"
              rows={3}
              value={collaborationNotes}
              onChange={(e) => setCollaborationNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3"
              placeholder="Specify equipment, grant amount, or mentorship commitments..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSelectedProjectId(null)}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md"
            >
              {isSubmitting ? 'Submitting to Supabase...' : 'Submit Collaboration Request'}
            </button>
          </div>
        </form>
      </Modal>

      {/* OPEN UNIVERSITY PROJECTS SEEKING SPONSORSHIP */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">University Innovation Opportunities</h2>
          <p className="text-xs text-slate-500">Academic projects seeking corporate hardware, funding, and pilot deployment assistance.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {projects.map(proj => {
            const hasCollab = proj.collaborations && proj.collaborations.length > 0;
            return (
              <div key={proj.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                      {proj.challengeCode}
                    </span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{proj.universityName}</span>
                    </span>
                  </div>

                  <StatusBadge status={hasCollab ? 'INDUSTRY_COLLABORATION' : proj.status} />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{proj.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500" />{proj.district}</span>
                    <span>•</span>
                    <span>Mentor: <strong>{proj.facultyMentor}</strong></span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {proj.description}
                  </p>
                </div>

                {/* Support Needed Pills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Required Industry Support:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.requiredIndustrySupport.map((sup, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-semibold rounded-md">
                        {sup}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Active Collaborations List if pledged */}
                {hasCollab && (
                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <Handshake className="w-4 h-4 text-emerald-600" />
                      <span>Pledged Industry Partner: {proj.collaborations[0].partnerName}</span>
                    </p>
                    <p className="text-[11px] text-emerald-800">{proj.collaborations[0].notes}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => setSelectedProjectId(proj.id)}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
                  >
                    <Handshake className="w-4 h-4" />
                    <span>Collaborate / Partner Now</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
