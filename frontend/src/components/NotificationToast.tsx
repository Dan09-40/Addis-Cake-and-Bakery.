import React, { useEffect, useState } from 'react';

interface Toast {
  id: number;
  message: string;
  subMessage?: string;
  type: 'order' | 'delivery' | 'success' | 'info';
}

interface NotificationToastProps {
  notifications: Toast[];
  onDismiss: (id: number) => void;
}

const typeStyles: Record<Toast['type'], { bg: string; icon: string; border: string }> = {
  order:    { bg: 'bg-pink-600',   icon: '🎂', border: 'border-pink-400' },
  delivery: { bg: 'bg-purple-600', icon: '🚗', border: 'border-purple-400' },
  success:  { bg: 'bg-green-600',  icon: '✅', border: 'border-green-400' },
  info:     { bg: 'bg-blue-600',   icon: '🔔', border: 'border-blue-400' },
};

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {notifications.map((toast) => {
        const style = typeStyles[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl border ${style.border} ${style.bg} text-white max-w-sm animate-slide-in`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <span className="text-2xl">{style.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm leading-snug">{toast.message}</p>
              {toast.subMessage && (
                <p className="text-xs opacity-80 mt-1">{toast.subMessage}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-2 text-white opacity-70 hover:opacity-100 text-lg leading-none"
            >
              ×
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type'] = 'info', subMessage?: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, subMessage, type }]);
    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, addToast, dismissToast };
};

export default NotificationToast;
