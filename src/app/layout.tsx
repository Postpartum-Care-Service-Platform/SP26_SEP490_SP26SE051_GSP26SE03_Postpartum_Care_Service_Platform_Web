import NextTopLoader from 'nextjs-toploader';
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
  title: 'thejoyfulnest',
  description: 'thejoyfulnest - Dịch vụ chăm sóc hậu sản',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={hennyPenny.variable}>
      <body className="app-shell" suppressHydrationWarning>
        <NextTopLoader
          color="#FF9B42"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FF9B42,0 0 5px #FF9B42"
        />
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

