import { ConditionalSupportWidget } from '@/components/layout/ConditionalSupportWidget';
import { ToastProvider } from '@/components/ui/toast/ToastProvider';
import { AuthProvider } from '@/contexts/AuthContext';

import '@/styles/globals.css';
import type { Metadata } from 'next';

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
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Henny+Penny&display=swap" rel="stylesheet" />
      </head>
      <body className="app-shell" suppressHydrationWarning>
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

