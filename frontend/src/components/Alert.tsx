import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'info' | 'warning';
  title?: string;
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'error',
  title,
  message,
  onClose,
}) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-950/40 border-red-500/30 text-red-300',
    success: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
    warning: 'bg-amber-950/40 border-amber-500/30 text-amber-300',
    info: 'bg-sky-950/40 border-sky-500/30 text-sky-300',
  }[type];

  const Icon = {
    error: AlertCircle,
    success: CheckCircle2,
    warning: AlertCircle,
    info: Info,
  }[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border text-sm backdrop-blur-sm transition-all duration-200 ${styles}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <p className="leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
