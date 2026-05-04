'use client';

import { usePathname } from 'next/navigation';

import { SupportWidget } from './SupportWidget';

export function ConditionalSupportWidget() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isManagerRoute = pathname?.startsWith('/manager');

  if (isAdminRoute || isManagerRoute) {
    return null;
  }

  return <SupportWidget />;
}

