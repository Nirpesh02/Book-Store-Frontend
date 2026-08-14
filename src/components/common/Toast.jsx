import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  error: 'bg-rose-50 border-rose-200 text-rose-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
};

const iconColorMap = {
  success: 'text-emerald-500',
  error: 'text-rose-500',
  info: 'text-blue-500',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-lg backdrop-blur-sm animate-[slideIn_0.3s_ease-out] ${colorMap[toast.type] || colorMap.info}`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <Icon className={`w-5 h-5 shrink-0 ${iconColorMap[toast.type] || iconColorMap.info}`} />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
