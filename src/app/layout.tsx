import { Henny_Penny } from 'next/font/google';

import { ConditionalSupportWidget } from '@/components/layout/ConditionalSupportWidget';
import { ToastProvider } from '@/components/ui/toast/ToastProvider';
import { AuthProvider } from '@/contexts/AuthContext';

import type { Metadata } from 'next';

import '@/styles/globals.css';

const hennyPenny = Henny_Penny({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-henny-penny',
});

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
    <html lang="vi" suppressHydrationWarning className={hennyPenny.variable}>
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

