import React from 'react';
import { HelpCircle, Mail, Phone, FileText, Globe } from 'lucide-react';

export const HelpSupportView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-emerald-400">
          <HelpCircle className="w-5 h-5" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">STATEWIDE SUPPORT PORTAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">YOUR GATI Support & FAQ</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Comprehensive guidance for Citizens, Government Admins, University Innovation Teams, and Industry CSR Partners.
        </p>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Email Helpdesk</h3>
          <p className="text-xs text-slate-500">Reach the Jharkhand Innovation Secretariat for portal assistance.</p>
          <a href="mailto:support@gati.jharkhand.gov.in" className="text-xs font-bold text-emerald-600 block hover:underline">
            support@gati.jharkhand.gov.in
          </a>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Toll-Free Helpline</h3>
          <p className="text-xs text-slate-500">Available 9 AM - 6 PM IST on government working days.</p>
          <span className="text-xs font-bold text-blue-600 block">1800-345-6789</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">State Secretariat</h3>
          <p className="text-xs text-slate-500">Department of Higher & Technical Education, Ranchi, Jharkhand.</p>
          <span className="text-xs font-bold text-purple-600 block">Smart India Hackathon 2026</span>
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-4 text-xs">
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">How does a Citizen report a societal challenge?</h3>
            <p className="text-slate-600 leading-relaxed">
              Navigate to "Report Challenge" from the sidebar menu, enter details about the location and problem, attach a photo, and run Gemini Vision AI analysis before submitting to Supabase.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">How are challenges assigned to Universities?</h3>
            <p className="text-slate-600 leading-relaxed">
              Government Admins review submitted reports, validate the problem, and assign it to an academic institution (e.g. BIT Sindri, NIT Jamshedpur) for capstone research.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">How do Industry Partners collaborate?</h3>
            <p className="text-slate-600 leading-relaxed">
              Industry partners log into the Corporate Collaboration Portal, review active university projects, and submit hardware, mentorship, or CSR funding pledges.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">How can I track a submitted challenge?</h3>
            <p className="text-slate-600 leading-relaxed">
              Use the "Track Challenge" page from the sidebar menu and enter your reference code (e.g. YG-2026-00101) to view live stage updates.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
