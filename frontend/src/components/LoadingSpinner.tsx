import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md',
}) => {
  const sizeClass = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-400">
      <div
        className={`${sizeClass} border-indigo-500 border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="text-sm font-medium">{message}</p>}
    </div>
  );
};
