import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { SupportType } from '../types';
import { CheckCircle2, Building2 } from 'lucide-react';

export const ProjectCreationForm: React.FC = () => {
  const { 
    pendingChallengeForProject, 
    selectedChallenge, 
    createProject 
  } = useApp();

  const { profile } = useAuth();

  const targetChallenge = pendingChallengeForProject || selectedChallenge;
  const universityName = profile?.organizationName || 'BIT Sindri Innovation Lab';

  const [projectName, setProjectName] = useState(
    targetChallenge ? `Capstone R&D: ${targetChallenge.title}` : ''
  );
  const [facultyMentor, setFacultyMentor] = useState(
    profile?.fullName ? `${profile.fullName} (Faculty Mentor)` : ''
  );
  const [studentTeamInput, setStudentTeamInput] = useState('');
  const [projectDescription, setProjectDescription] = useState(
    targetChallenge?.description || ''
  );
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedSupportTypes, setSelectedSupportTypes] = useState<SupportType[]>([
    'Hardware',
    'Mentorship',
    'Funding'
  ]);

  const supportOptions: SupportType[] = [
    'Mentorship',
    'Funding',
    'Hardware',
    'Software',
    'Testing',
    'Pilot Deployment'
  ];

  const toggleSupportType = (type: SupportType) => {
    if (selectedSupportTypes.includes(type)) {
      setSelectedSupportTypes(prev => prev.filter(t => t !== type));
    } else {
      setSelectedSupportTypes(prev => [...prev, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !facultyMentor.trim() || !projectDescription.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const studentTeam = studentTeamInput.split(',').map(s => s.trim()).filter(Boolean);
      const requiredSkills = requiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);

      await createProject({
        challengeId: targetChallenge?.id || 'ch-101',
        title: projectName.trim(),
        description: projectDescription.trim(),
        universityName,
        facultyMentor: facultyMentor.trim(),
        studentTeam: studentTeam.length > 0 ? studentTeam : ['Student Lead'],
        requiredSkills: requiredSkills.length > 0 ? requiredSkills : ['Engineering'],
        requiredIndustrySupport: selectedSupportTypes,
        expectedOutcome: expectedOutcome.trim() || 'Functional prototype and field test report'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in font-sans">
      
      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-600">University Project Setup</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{universityName}</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Create Research Capstone Project</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Form student teams, assign faculty mentors, and configure industry support requests.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg shrink-0 hidden sm:inline-block">
          Status: Planning
        </span>
      </div>

      {/* Target Challenge Context Info Box */}
      {targetChallenge && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Accepted Challenge Context</span>
          <p className="text-sm font-bold text-slate-100">{targetChallenge.challengeCode}: {targetChallenge.title}</p>
          <p className="text-xs text-slate-300">Domain: {targetChallenge.domain} • Location: {targetChallenge.district} District</p>
        </div>
      )}

      {/* Main Project Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        <div className="space-y-1.5">
          <label htmlFor="project-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Project Name / Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="project-title"
            type="text"
            required
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. Low-Cost Water Filtration Telemetry Array"
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="faculty-mentor" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Faculty Mentor <span className="text-rose-500">*</span>
            </label>
            <input
              id="faculty-mentor"
              type="text"
              required
              value={facultyMentor}
              onChange={(e) => setFacultyMentor(e.target.value)}
              placeholder="e.g. Dr. A. K. Sharma (Dept of Electrical)"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-4 py-2.5 font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="student-team" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Student Innovation Team
            </label>
            <input
              id="student-team"
              type="text"
              value={studentTeamInput}
              onChange={(e) => setStudentTeamInput(e.target.value)}
              placeholder="Comma-separated student names"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-4 py-2.5 font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="project-scope" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Project Engineering Scope <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="project-scope"
            required
            rows={3}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Describe technical implementation, prototype architecture, and field testing methodology..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="required-skills" className="block text-xs font-bold text-slate-700">Required Skills & Technology</label>
            <input
              id="required-skills"
              type="text"
              value={requiredSkillsInput}
              onChange={(e) => setRequiredSkillsInput(e.target.value)}
              placeholder="e.g. Embedded Systems, CAD, React, IoT"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2.5"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="expected-outcome" className="block text-xs font-bold text-slate-700">Expected Outcome / KPI</label>
            <input
              id="expected-outcome"
              type="text"
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              placeholder="e.g. Deployable prototype and 30% cost reduction"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2.5"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Required Industry Support Options:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {supportOptions.map((option) => {
              const isChecked = selectedSupportTypes.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => toggleSupportType(option)}
                  className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2 transition-all ${
                    isChecked
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center text-white text-[10px] ${
                    isChecked ? 'bg-blue-600' : 'border border-slate-300'
                  }`}>
                    {isChecked && '✓'}
                  </div>
                  <span>{option}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-950/30 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isSubmitting ? 'Creating Project in Supabase...' : 'Create Project in Supabase DB'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
