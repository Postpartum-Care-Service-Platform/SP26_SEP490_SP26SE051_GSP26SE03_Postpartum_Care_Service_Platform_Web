'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './patient-list-header.module.css';

export function PatientListHeader() {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';
  const label = isManager ? 'Khách hàng' : 'Danh sách tài khoản';

  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label },
        ]}
        homeHref={homeHref}
      />
    </div>
  );
}

