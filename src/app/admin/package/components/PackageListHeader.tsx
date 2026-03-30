'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './package-list-header.module.css';

export function PackageListHeader() {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';

  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label: 'Gói dịch vụ' },
        ]}
        homeHref={homeHref}
      />
    </div>
  );
}

