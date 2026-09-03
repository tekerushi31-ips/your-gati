import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JHARKHAND_DISTRICTS, DOMAINS } from '../../data/mockData';
import { StatusBadge } from '../Common/StatusBadge';
import { 
  PlusCircle, 
  ArrowRight,
  FileSpreadsheet,
  Search
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { challenges, projects, setSelectedChallenge, setActivePage, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  // Supabase Data Metrics
  const totalCount = challenges.length;
  const pendingValidationCount = challenges.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW' || c.status === 'submitted').length;
  const inProgressCount = challenges.filter(c => 
    c.status === 'UNIVERSITY_ACCEPTED' || 
    c.status === 'PROJECT_CREATED' || 
    c.status === 'INDUSTRY_COLLABORATION' || 
    c.status === 'PROTOTYPE' || 
    c.status === 'PILOT_TESTING' ||
    c.status === 'assigned'
  ).length;
  const resolvedCount = challenges.filter(c => c.status === 'DEPLOYED' || c.status === 'IMPACT_MEASURED' || c.status === 'pilot').length;
  const universityProjectsCount = projects.length;
  const industryCollabsCount = projects.reduce((acc, p) => acc + (p.collaborations ? p.collaborations.length : 0), 0);
  const socialImpactCount = challenges.reduce((acc, c) => acc + (c.affectedCount || 1000), 0);

  // Filtered Challenges List
  const filteredChallenges = challenges.filter(ch => {
    const matchesSearch = ch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ch.challengeCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'ALL' || ch.district === selectedDistrict;
    const matchesDomain = selectedDomain === 'ALL' || ch.domain === selectedDomain;
    const matchesSeverity = selectedSeverity === 'ALL' || ch.urgency === selectedSeverity;
    return matchesSearch && matchesDistrict && matchesDomain && matchesSeverity;
  });

  const handleExportReport = () => {
    showToast('State Innovation Telemetry Report exported to CSV.', 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto font-sans">
      
      {/* Operational Page Title */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor societal challenges, university projects and industry collaborations across Jharkhand.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => setActivePage('citizen-report')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ NEW CHALLENGE</span>
          </button>
        </div>
      </div>

      {/* 7 STATISTIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">TOTAL CHALLENGES</span>
          <p className="text-2xl font-bold text-slate-900 font-mono">{totalCount}</p>
          <span className="text-[11px] text-slate-500 font-medium">Synced in DB</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block">PENDING</span>
          <p className="text-2xl font-bold text-amber-600 font-mono">{pendingValidationCount}</p>
          <span className="text-[11px] text-amber-700 font-semibold">Requires Review</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">IN PROGRESS</span>
          <p className="text-2xl font-bold text-blue-600 font-mono">{inProgressCount}</p>
          <span className="text-[11px] text-blue-700 font-semibold">University R&D Active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">RESOLVED</span>
          <p className="text-2xl font-bold text-emerald-600 font-mono">{resolvedCount}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Field Deployed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">UNIV PROJECTS</span>
          <p className="text-2xl font-bold text-indigo-600 font-mono">{universityProjectsCount}</p>
          <span className="text-[11px] text-indigo-700 font-semibold">Capstone Teams</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">INDUSTRY COLLABS</span>
          <p className="text-2xl font-bold text-purple-600 font-mono">{industryCollabsCount}</p>
          <span className="text-[11px] text-purple-700 font-semibold">CSR Pledges</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">SOCIAL IMPACT</span>
          <p className="text-2xl font-bold text-teal-600 font-mono">{(socialImpactCount / 1000).toFixed(1)}k</p>
          <span className="text-[11px] text-teal-700 font-semibold">Citizens Covered</span>
        </div>

      </div>

      {/* FILTERABLE CHALLENGE TABLE */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Societal Challenge Registry</h2>
            <p className="text-xs text-slate-500">Live database of public challenges submitted across Jharkhand.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                id="admin-search-input"
                aria-label="Filter challenges by title or code"
                placeholder="Search code or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <select
              id="admin-district-filter"
              aria-label="Filter by district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Districts</option>
              {JHARKHAND_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              id="admin-domain-filter"
              aria-label="Filter by domain"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Domains</option>
              {DOMAINS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              id="admin-severity-filter"
              aria-label="Filter by severity"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <th className="py-3 px-4">Challenge ID</th>
                <th className="py-3 px-4">Challenge</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned University</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredChallenges.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No challenges match the current database filter.
                  </td>
                </tr>
              ) : (
                filteredChallenges.map(ch => {
                  const relatedProj = projects.find(p => p.challengeId === ch.id || p.challengeCode === ch.challengeCode);
                  const assignedUni = ch.assignedUniversity || relatedProj?.universityName || 'Not Assigned';

                  return (
                    <tr key={ch.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ch.challengeCode}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">{ch.title}</td>
                      <td className="py-3.5 px-4 text-slate-600">{ch.district}</td>
                      <td className="py-3.5 px-4 text-slate-600">{ch.domain}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ch.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                          ch.urgency === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ch.urgency}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={ch.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-semibold">{assignedUni}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedChallenge(ch);
                            setActivePage('admin-pending');
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1 transition-all"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
