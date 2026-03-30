'use client';

import { redirect } from 'next/navigation';

export default function ManagerAccountOverviewRedirectPage() {
  redirect('/manager/customers');
  return null;
}
