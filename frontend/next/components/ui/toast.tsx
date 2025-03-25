'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true once component hydrates on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = (message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration !== Infinity && isMounted) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Only render toast container on the client after hydration */}
      {isMounted && <ToastContainer />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2'>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center justify-between w-80 p-4 rounded-md shadow-md',
            {
              'bg-green-50 text-green-700 border border-green-200':
                toast.type === 'success',
              'bg-red-50 text-red-700 border border-red-200':
                toast.type === 'error',
              'bg-blue-50 text-blue-700 border border-blue-200':
                toast.type === 'info',
            }
          )}
          role='alert'
        >
          <div className='flex items-center space-x-3'>
            {toast.type === 'success' && <CheckCircle className='h-5 w-5' />}
            {toast.type === 'error' && <AlertCircle className='h-5 w-5' />}
            {toast.type === 'info' && <Info className='h-5 w-5' />}
            <p className='text-sm font-medium'>{toast.message}</p>
          </div>
          <Button
            onClick={() => removeToast(toast.id)}
            variant='ghost'
            size='icon'
            className='ml-2 h-5 w-5 p-0'
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>Close</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
