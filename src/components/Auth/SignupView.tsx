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
  Landmark,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const SignupView: React.FC<{ onNavigateToLogin: () => void }> = ({ onNavigateToLogin }) => {
  const { signup } = useAuth();
  const { showToast, setActivePage, setRole } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRoleState] = useState<UserRole>('citizen');
  const [organizationName, setOrganizationName] = useState('');
  const [district, setDistrict] = useState<JharkhandDistrict>('Ranchi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signup({
        fullName,
        email,
        pass: password,
        role,
        organizationName,
        district
      });

      if (res?.requiresConfirmation) {
        const confirmMsg = 'Account registered in Supabase! Please check your email inbox to confirm your account before logging in.';
        setSuccessMessage(confirmMsg);
        showToast(confirmMsg, 'info');
      } else {
        setRole(role);
        showToast('Account created & authenticated in Supabase!', 'success');
        setActivePage(
          role === 'admin' ? 'admin-dashboard' :
          role === 'university' ? 'university-dashboard' :
          role === 'industry' ? 'industry-dashboard' : 'citizen-dashboard'
        );
      }
    } catch (err: any) {
      const errText = err?.message || 'Registration failed. Please try again.';
      console.error('Signup error:', errText);
      setErrorMessage(errText);
      showToast(errText, 'error');
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
    <div className="max-w-xl mx-auto py-8 px-4 animate-fade-in space-y-6 font-sans">
      
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create YOUR GATI Account</h1>
        <p className="text-xs text-slate-500 font-normal">Register your profile in the Supabase Database.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        
        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-800 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs font-medium leading-tight">
              <span className="font-bold block mb-0.5">Registration Failure</span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Success / Email Confirmation Banner */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-emerald-900 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs font-medium leading-tight">
              <span className="font-bold block mb-0.5">Registration Successful</span>
              {successMessage}
            </div>
          </div>
        )}

        {/* Role Selector Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
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
                  onClick={() => setRoleState(r)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-2xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
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
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ramesh Singh"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="ramesh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Password & Organization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Organization / College Name</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. BIT Sindri / Tata Steel"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* District */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700">District (Jharkhand)</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value as JharkhandDistrict)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-lg px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {JHARKHAND_DISTRICTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
        >
          <span>{isSubmitting ? 'Creating Profile in Supabase...' : 'Register Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-xs text-emerald-600 hover:underline font-semibold"
          >
            Already registered? Back to Login
          </button>
        </div>

      </form>

    </div>
  );
};
