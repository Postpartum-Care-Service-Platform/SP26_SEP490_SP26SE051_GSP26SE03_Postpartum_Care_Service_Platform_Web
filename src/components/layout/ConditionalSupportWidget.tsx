'use client';

import { usePathname } from 'next/navigation';

import { SupportWidget } from './SupportWidget';

export function ConditionalSupportWidget() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return <SupportWidget />;
}

