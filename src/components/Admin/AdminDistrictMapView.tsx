import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JHARKHAND_DISTRICTS } from '../../data/mockData';
import { MapPin, ArrowRight } from 'lucide-react';

export const AdminDistrictMapView: React.FC = () => {
  const { challenges, projects, setSelectedChallenge, setActivePage } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Palamu');

  const districtData = JHARKHAND_DISTRICTS.map(d => {
    const list = challenges.filter(c => c.district.toLowerCase() === d.toLowerCase());
    const highSevCount = list.filter(c => c.urgency === 'CRITICAL' || c.urgency === 'HIGH').length;
    const resolvedCount = list.filter(c => c.status === 'DEPLOYED' || c.status === 'pilot').length;
    const activeProjCount = projects.filter(p => p.district?.toLowerCase() === d.toLowerCase()).length;

    return {
      district: d,
      total: list.length,
      highSev: highSevCount,
      resolved: resolvedCount,
      activeProjects: activeProjCount
    };
  });

  const currentDistrictDetails = districtData.find(d => d.district.toLowerCase() === selectedDistrict.toLowerCase()) || districtData[0];
  const currentDistrictChallenges = challenges.filter(c => c.district.toLowerCase() === selectedDistrict.toLowerCase());

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700">Field Telemetry</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">State-Wide District Mapping</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">District Telemetry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic challenge concentration and innovation deployment across Jharkhand's 24 districts.
          </p>
        </div>
      </div>

      {/* DISTRICT TELEMETRY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {districtData.map(item => {
          const isSelected = item.district.toLowerCase() === selectedDistrict.toLowerCase();

          return (
            <button
              key={item.district}
              onClick={() => setSelectedDistrict(item.district)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected 
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black truncate ${isSelected ? 'text-emerald-900' : 'text-slate-900'}`}>{item.district}</span>
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-black font-mono text-slate-900">{item.total}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{item.highSev} High</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SELECTED DISTRICT BREAKDOWN */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">{currentDistrictDetails.district} District Telemetry</h2>
            <p className="text-xs text-slate-500">Active citizen reports and university projects in {currentDistrictDetails.district}.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-extrabold rounded-full border border-emerald-300">
              {currentDistrictDetails.total} Total Reports
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {currentDistrictChallenges.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl border border-slate-200">
              No registered challenges logged in {currentDistrictDetails.district} district yet.
            </p>
          ) : (
            currentDistrictChallenges.map(ch => (
              <div key={ch.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-slate-900">{ch.challengeCode}</span>
                    <span className="text-xs font-semibold text-slate-600">{ch.domain}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{ch.title}</h4>
                </div>

                <button
                  onClick={() => {
                    setSelectedChallenge(ch);
                    setActivePage('admin-pending');
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
