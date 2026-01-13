import type { Metadata } from 'next';

import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/toast/ToastProvider';
import { ConditionalSupportWidget } from '@/components/layout/ConditionalSupportWidget';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Postpartum Service',
  description: 'Postpartum Service - Dịch vụ chăm sóc hậu sản',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="app-shell">
        <AuthProvider>
          <ToastProvider>
            {children}
            <ConditionalSupportWidget />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

