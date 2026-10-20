import React from 'react';
import type { MembershipStatus, RoleCode } from '../types';

interface RoleBadgeProps {
  role: RoleCode;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const normalized = role.toUpperCase();

  const styles = {
    OWNER: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    ADMIN: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    MEMBER: 'bg-slate-700/30 text-slate-300 border-slate-600/40',
  }[normalized] || 'bg-slate-700/30 text-slate-300 border-slate-600/40';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${styles}`}
    >
      {normalized}
    </span>
  );
};

interface StatusBadgeProps {
  status: MembershipStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isSuspended = status === 'SUSPENDED';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isSuspended
          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isSuspended ? 'bg-rose-500' : 'bg-emerald-500'
        }`}
      />
      {status}
    </span>
  );
};
