'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './care-plan-detail-list-header.module.css';

export function CarePlanDetailListHeader() {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';

  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label: 'Hoạt động gói dịch vụ' },
        ]}
        homeHref={homeHref}
      />
    </div>
  );
}
