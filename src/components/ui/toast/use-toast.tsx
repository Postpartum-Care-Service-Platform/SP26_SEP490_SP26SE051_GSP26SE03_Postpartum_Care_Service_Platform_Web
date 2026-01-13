'use client';

import * as React from 'react';

export type ToastVariant = 'default' | 'success' | 'error';

export type ToastPayload = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastInternal = Required<Pick<ToastPayload, 'title'>> &
  Omit<ToastPayload, 'title'> & {
    id: string;
  };

type ToastContextValue = {
  toast: (payload: ToastPayload) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastInternal[]>([]);

  const toast = React.useCallback((payload: ToastPayload) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const durationMs = payload.durationMs ?? 2200;

    const next: ToastInternal = {
      id,
      title: payload.title,
      description: payload.description,
      variant: payload.variant ?? 'default',
      durationMs,
    };

    setItems((prev) => [...prev, next]);

    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastViewport items={items} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ items }: { items: ToastInternal[] }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        display: 'grid',
        gap: 10,
        zIndex: 9999,
      }}
      aria-live="polite"
      aria-relevant="additions"
    >
      {items.map((t) => {
        const bg = t.variant === 'success' ? '#16a34a' : t.variant === 'error' ? '#dc2626' : '#111827';
        return (
          <div
            key={t.id}
            role="status"
            style={{
              minWidth: 260,
              maxWidth: 360,
              background: bg,
              color: 'white',
              padding: '12px 14px',
              borderRadius: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
            {t.description ? <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>{t.description}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

