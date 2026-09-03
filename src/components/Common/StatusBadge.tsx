import React from 'react';
import type { ChallengeStatus, ProjectStatus } from '../../types';

interface StatusBadgeProps {
  status: ChallengeStatus | ProjectStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normStatus = (status || '').toString().toUpperCase();

  let colorStyle = 'bg-slate-100 text-slate-800 border-slate-200';
  let label = normStatus.replace(/_/g, ' ');

  switch (normStatus) {
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
    case 'PENDING':
      colorStyle = 'bg-amber-100/90 text-amber-900 border-amber-300';
      label = normStatus === 'SUBMITTED' ? 'Submitted' : normStatus === 'UNDER_REVIEW' ? 'Under Review' : 'Pending';
      break;

    case 'VALIDATED':
    case 'UNIVERSITY_ASSIGNED':
    case 'UNIVERSITY_ACCEPTED':
    case 'ASSIGNED':
      colorStyle = 'bg-indigo-100/90 text-indigo-900 border-indigo-300';
      label = normStatus === 'VALIDATED' ? 'Govt Validated' : normStatus === 'UNIVERSITY_ASSIGNED' ? 'University Assigned' : 'University Accepted';
      break;

    case 'PROJECT_CREATED':
    case 'INDUSTRY_COLLABORATION':
    case 'PLANNING':
    case 'IN_PROGRESS':
      colorStyle = 'bg-purple-100/90 text-purple-900 border-purple-300';
      label = normStatus === 'PROJECT_CREATED' ? 'Project Active' : normStatus === 'INDUSTRY_COLLABORATION' ? 'Industry Sponsored' : normStatus.replace(/_/g, ' ');
      break;

    case 'PROTOTYPE':
    case 'PILOT_TESTING':
    case 'DEPLOYED':
    case 'IMPACT_MEASURED':
    case 'COMPLETED':
      colorStyle = 'bg-emerald-100/90 text-emerald-900 border-emerald-300';
      label = normStatus === 'PROTOTYPE' ? 'Prototype MVP' : normStatus === 'PILOT_TESTING' ? 'Pilot Testing' : normStatus === 'DEPLOYED' ? 'Field Deployed' : normStatus.replace(/_/g, ' ');
      break;

    case 'REJECTED':
    case 'OVERDUE':
    case 'CRITICAL':
      colorStyle = 'bg-rose-100/90 text-rose-900 border-rose-300';
      label = normStatus;
      break;

    default:
      colorStyle = 'bg-slate-100 text-slate-800 border-slate-200';
      break;
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase border shadow-2xs inline-flex items-center gap-1 ${colorStyle} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      <span>{label}</span>
    </span>
  );
};
