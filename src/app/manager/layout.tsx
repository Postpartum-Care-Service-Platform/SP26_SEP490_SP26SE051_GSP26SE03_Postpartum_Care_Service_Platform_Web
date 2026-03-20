import React from 'react';

import { ManagerLayout } from '@/components/layout/manager/ManagerLayout';

export default function ManagerLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ManagerLayout>{children}</ManagerLayout>;
}
