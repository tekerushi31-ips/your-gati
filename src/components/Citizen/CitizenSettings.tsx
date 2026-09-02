import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import type { Language } from '../../context/AppContext';
import { Globe, LogOut } from 'lucide-react';

export const CitizenSettings: React.FC = () => {
  const { language, setLanguage, showToast } = useApp();
  const { logout } = useAuth();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    showToast(`Language switched to ${lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}`, 'info');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-3xl mx-auto">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900">Citizen Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure portal preferences and security settings.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Language Preferences */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Portal Language / भाषा</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`p-3 rounded-xl border font-bold text-center transition-all ${
                language === 'en' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              English
            </button>

            <button
              onClick={() => handleLanguageChange('hi')}
              className={`p-3 rounded-xl border font-bold text-center transition-all ${
                language === 'hi' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              हिंदी
            </button>

            <button
              onClick={() => handleLanguageChange('mr')}
              className={`p-3 rounded-xl border font-bold text-center transition-all ${
                language === 'mr' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>

        {/* Security & Logout */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between p-4 bg-rose-50/60 rounded-xl border border-rose-200">
            <div>
              <p className="text-xs font-extrabold text-slate-900">Sign Out of Citizen Session</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Calls Supabase auth.signOut() and returns to Login screen.</p>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
