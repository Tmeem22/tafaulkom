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
             {toast.type === 'success' && <img src="https://img.icons8.com/fluency/256/checkmark.png" width={20} height={20} alt="نجاح" />}
             {toast.type === 'error' && <img src="https://img.icons8.com/fluency/256/error.png" width={20} height={20} alt="خطأ" />}
             {toast.type === 'info' && <img src="https://img.icons8.com/fluency/256/info.png" width={20} height={20} alt="تنبيه" />}
          </div>
          <div className="toast-content">
            <p className="toast-message">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
