import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-3.5 rounded-xl shadow-xl border text-xs font-medium backdrop-blur-md animate-slide-up transition-all ${
              isSuccess 
                ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-300' 
                : isError 
                ? 'bg-slate-900/95 border-rose-500/50 text-rose-300' 
                : isWarning 
                ? 'bg-slate-900/95 border-amber-500/50 text-amber-300' 
                : 'bg-slate-900/95 border-blue-500/50 text-blue-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
              {isError && <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
              <div>
                <p className="font-semibold text-slate-100">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
