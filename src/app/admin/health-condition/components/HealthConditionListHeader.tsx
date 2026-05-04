'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import styles from './health-condition-list-header.module.css';

export function HealthConditionListHeader() {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';
  const label = 'Quản lý tình trạng sức khỏe';

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
