'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './activity-list-header.module.css';

export function ActivityListHeader() {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';

  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label: 'Hoạt động' },
        ]}
        homeHref={homeHref}
      />
    </div>
  );
}
