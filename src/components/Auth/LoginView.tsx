import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  Building2, 
  Layers, 
  Landmark,
  Sparkles
} from 'lucide-react';

export const LoginView: React.FC<{ onNavigateToSignup: () => void }> = ({ onNavigateToSignup }) => {
  const { login, loginAsDemoAccount } = useAuth();
  const { showToast, setActivePage } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      showToast('Logged in successfully', 'success');
      setActivePage('citizen-dashboard');
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    await loginAsDemoAccount(role);
    showToast(`Logged in as ${role.toUpperCase()} (SIH Demo Account)`, 'info');
    if (role === 'university') setActivePage('university-dashboard');
    else if (role === 'industry') setActivePage('industry-dashboard');
    else if (role === 'admin') setActivePage('admin-dashboard');
    else setActivePage('citizen-dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-fade-in space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 text-white font-black text-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-950">
          G
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">YOUR GATI</h1>
        <p className="text-xs font-bold text-emerald-600 tracking-tight">"Your Problem. Our Universities. One GATI Forward."</p>
        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-full border border-slate-200 uppercase">
          Citizen Portal Login
        </span>
      </div>

      {/* Login Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
        
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="user@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to your email.', 'info'); }} className="text-[11px] font-semibold text-emerald-600 hover:underline">
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2 transition-all"
        >
          <span>{isSubmitting ? 'Authenticating...' : 'LOGIN'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateToSignup}
            className="text-xs text-emerald-700 hover:underline font-bold"
          >
            Don't have an account? Create Account
          </button>
        </div>

      </form>

      {/* SIH PRESENTATION DEMO SHORTCUTS */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">SIH Judge Presentation Shortcuts</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Click below to log in directly into test accounts linked to the SAME underlying database:
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('citizen')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl border border-slate-700 text-left font-bold flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>Citizen Demo</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('university')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-xl border border-slate-700 text-left font-bold flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>University Demo</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('industry')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl border border-slate-700 text-left font-bold flex items-center gap-2"
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Industry Demo</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('admin')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl border border-slate-700 text-left font-bold flex items-center gap-2"
          >
            <Landmark className="w-4 h-4 shrink-0" />
            <span>Govt Admin Demo</span>
          </button>
        </div>
      </div>

    </div>
  );
};
