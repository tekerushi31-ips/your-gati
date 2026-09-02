import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, PieChart, FileSpreadsheet } from 'lucide-react';

export const AdminAnalyticsView: React.FC = () => {
  const { challenges, showToast } = useApp();

  // Aggregate Domain Analytics
  const domainCounts = challenges.reduce((acc, c) => {
    acc[c.domain] = (acc[c.domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Aggregate Urgency Analytics
  const urgencyCounts = challenges.reduce((acc, c) => {
    acc[c.urgency] = (acc[c.urgency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleExportCSV = () => {
    showToast('Analytics summary exported to CSV', 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700">Database Analytics</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">State Ecosystem Performance</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Analytics & Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated trends across domains, urgency levels, universities, and industry CSR partnerships.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* TWO COLUMN ANALYTICS BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DOMAIN DISTRIBUTION CHART */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Challenges by Domain</h3>
            </div>
            <span className="text-xs font-bold font-mono text-slate-500">{challenges.length} Total</span>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(domainCounts).map(([dom, count]) => {
              const pct = Math.round((count / Math.max(challenges.length, 1)) * 100);
              return (
                <div key={dom} className="space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-800">{dom}</span>
                    <span className="font-mono text-slate-500">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SEVERITY & URGENCY BREAKDOWN */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Severity Distribution</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(urgencyCounts).map(([urg, count]) => {
              const pct = Math.round((count / Math.max(challenges.length, 1)) * 100);
              return (
                <div key={urg} className="space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-800">{urg} Priority</span>
                    <span className="font-mono text-slate-500">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        urg === 'CRITICAL' ? 'bg-rose-500' :
                        urg === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
