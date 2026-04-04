"use client";

import { useState, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  isClosing?: boolean;
}

let toastCount = 0;
let observers: ((toasts: Toast[]) => void)[] = [];
let currentToasts: Toast[] = [];

const notify = (toasts: Toast[]) => {
  observers.forEach((observer) => observer(toasts));
};

export const showToast = (message: string, type: ToastType = 'info') => {
  const id = ++toastCount;
  const newToast: Toast = { id, message, type };
  
  currentToasts = [...currentToasts, newToast];
  notify(currentToasts);

  // Auto remove after 5 seconds
  setTimeout(() => {
    hideToast(id);
  }, 5000);
};

const hideToast = (id: number) => {
  currentToasts = currentToasts.map(t => t.id === id ? { ...t, isClosing: true } : t);
  notify(currentToasts);

  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    notify(currentToasts);
  }, 400); // match CSS animation duration
};

export function useNotification() {
  const [toasts, setToasts] = useState<Toast[]>(currentToasts);

  useEffect(() => {
    const observer = (newToasts: Toast[]) => setToasts(newToasts);
    observers.push(observer);
    return () => {
      observers = observers.filter((obs) => obs !== observer);
    };
  }, []);

  return { toasts, showToast };
}
