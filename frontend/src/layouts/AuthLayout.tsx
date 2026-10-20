import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(15,23,42,0))] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10 mb-4 transition-transform hover:scale-105 duration-200">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            Team Access Control
          </h1>
          <p className="text-sm text-slate-400">
            Role-based organization & membership management
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-xl p-6 sm:p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Secured with JWT & RBAC &bull; Team Access Control
        </div>
      </div>
    </div>
  );
};
