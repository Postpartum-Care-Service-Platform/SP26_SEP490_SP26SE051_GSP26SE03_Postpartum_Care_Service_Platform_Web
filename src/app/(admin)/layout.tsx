import React from 'react';

import { AdminLayout } from '@/components/layout/admin/AdminLayout';

export default function AdminLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayout>{children}</AdminLayout>;
}

