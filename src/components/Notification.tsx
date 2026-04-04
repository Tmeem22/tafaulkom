"use client"

import { useNotification } from "@/hooks/useNotification";

export default function Notification() {
  const { toasts } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" dir="rtl">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`toast toast-${toast.type} ${toast.isClosing ? 'toast-closing' : ''}`}
        >
          <div className="toast-icon">
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'info' && 'ℹ️'}
          </div>
          <div className="toast-content">
            <p className="toast-message">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
