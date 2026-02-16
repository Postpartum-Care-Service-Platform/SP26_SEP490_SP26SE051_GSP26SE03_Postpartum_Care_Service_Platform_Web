import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell__inner">
      <Header />
      <main className="app-shell__main">{children}</main>
      <Footer />
    </div>
  );
}

