import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import type { JharkhandDistrict } from '../../types';
import { JHARKHAND_DISTRICTS } from '../../data/mockData';
import { User, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export const CitizenProfile: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useApp();

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [district, setDistrict] = useState<JharkhandDistrict>(profile?.district as JharkhandDistrict || 'Palamu');
  const [location, setLocation] = useState('Satbarwa Village, Palamu');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Profile settings saved to Supabase', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-3xl mx-auto">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900">Citizen Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your authenticated civic account details.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address (Auth)</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              disabled
              value={profile?.email || 'citizen@gati.in'}
              className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-xs rounded-xl pl-9 pr-3 py-2.5 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Home District (Jharkhand)</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value as JharkhandDistrict)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {JHARKHAND_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Village / City Landmark</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Profile Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
