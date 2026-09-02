import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onNavigateToSignup: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigateToSignup }) => {
  const { login } = useAuth();
  const { showToast } = useApp();
  
  const [email, setEmail] = useState('citizen@gati.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Signed in successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to sign in', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans animate-fade-in p-4 sm:p-6">
      
      {/* TWO COLUMN DESKTOP LAYOUT */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT COLUMN: BRAND & SIH MISSION */}
        <div className="bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 font-extrabold text-white flex items-center justify-center text-base shadow-sm">
                G
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">YOUR GATI</span>
            </div>

            <div className="inline-block px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-semibold rounded-full uppercase tracking-wider">
              Smart India Hackathon 2026
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
              Jharkhand State Innovation Platform
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              A digital ecosystem connecting Citizens, Government, Universities, and Industry partners to solve real-world societal challenges.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Tagline</span>
            <p className="text-xs font-semibold text-emerald-400">
              "Your Problem. Our Universities. One GATI Forward."
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="p-8 sm:p-10 bg-white flex flex-col justify-between space-y-6">
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In</h1>
            <p className="text-xs text-slate-500 font-normal">
              Enter your credentials to access your authenticated portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-10 pr-3.5 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all font-normal"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to registered email.', 'info')}
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-10 pr-3.5 py-2.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all font-normal"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{loading ? 'Signing in...' : 'SIGN IN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* QUICK PROTOTYPE LOGIN SHORTCUTS */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              SIH Presentation Evaluation Shortcuts
            </span>
            
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickSelect('citizen@gati.in')}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border text-left truncate transition-colors ${
                  email === 'citizen@gati.in' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Citizen Portal
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('admin@gati.in')}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border text-left truncate transition-colors ${
                  email === 'admin@gati.in' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Govt Admin Portal
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('university@gati.in')}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border text-left truncate transition-colors ${
                  email === 'university@gati.in' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                University Portal
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('industry@gati.in')}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border text-left truncate transition-colors ${
                  email === 'industry@gati.in' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Industry Portal
              </button>
            </div>
          </div>

          {/* Footer Signup Link */}
          <div className="text-center pt-2">
            <span className="text-xs text-slate-500 font-normal">Don't have an account? </span>
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Create Account
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
