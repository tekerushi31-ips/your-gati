import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import type { UserRole, JharkhandDistrict } from '../../types';
import { JHARKHAND_DISTRICTS } from '../../data/mockData';
import { 
  User, 
  Mail, 
  Lock, 
  Building, 
  ArrowRight, 
  UserCheck, 
  Building2, 
  Layers, 
  Landmark 
} from 'lucide-react';

export const SignupView: React.FC<{ onNavigateToLogin: () => void }> = ({ onNavigateToLogin }) => {
  const { signup } = useAuth();
  const { showToast, setActivePage } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [organizationName, setOrganizationName] = useState('');
  const [district, setDistrict] = useState<JharkhandDistrict>('Ranchi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    setIsSubmitting(true);
    try {
      await signup({
        fullName,
        email,
        pass: password,
        role,
        organizationName,
        district
      });
      showToast('Account registered successfully!', 'success');
      setActivePage('landing');
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleConfigs: Record<UserRole, { label: string; icon: any; desc: string }> = {
    citizen: {
      label: 'Citizen',
      icon: UserCheck,
      desc: 'Report community societal issues'
    },
    university: {
      label: 'University',
      icon: Building2,
      desc: 'Evaluate & mentor student capstones'
    },
    industry: {
      label: 'Industry',
      icon: Layers,
      desc: 'Sponsor & fund engineering projects'
    },
    admin: {
      label: 'Government Admin',
      icon: Landmark,
      desc: 'Monitor state-wide innovation pipeline'
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 animate-fade-in space-y-6">
      
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create YOUR GATI Account</h1>
        <p className="text-xs text-slate-500">Register your role in the Jharkhand Societal Innovation Ecosystem.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
        
        {/* Role Selector Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Select Your Role <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(Object.keys(roleConfigs) as UserRole[]).map((r) => {
              const cfg = roleConfigs[r];
              const Icon = cfg.icon;
              const isSelected = role === r;
              return (
                <div
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-sm' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{cfg.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal leading-tight">{cfg.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ramesh Singh"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="ramesh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5"
              />
            </div>
          </div>
        </div>

        {/* Password & Organization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Organization / College Name</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. BIT Sindri / Tata Steel"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5"
              />
            </div>
          </div>
        </div>

        {/* District */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">District (Jharkhand)</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value as JharkhandDistrict)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl px-4 py-2.5"
          >
            {JHARKHAND_DISTRICTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-950/30 flex items-center justify-center gap-2 transition-all"
        >
          <span>{isSubmitting ? 'Creating Profile...' : 'Register Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            Already registered? Back to Login
          </button>
        </div>

      </form>

    </div>
  );
};
