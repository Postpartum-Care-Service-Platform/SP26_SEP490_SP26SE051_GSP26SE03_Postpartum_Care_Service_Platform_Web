'use client';

import * as React from 'react';

import { ToastProvider as InternalToastProvider } from './use-toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <InternalToastProvider>{children}</InternalToastProvider>;
}

