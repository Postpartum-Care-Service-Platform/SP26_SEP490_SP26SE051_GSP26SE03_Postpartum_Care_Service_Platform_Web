'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './menu-record-list-header.module.css';

export type MenuRecordListHeaderProps = {
  view: 'table' | 'ui';
  onViewChange: (view: 'table' | 'ui') => void;
};

const UI_ICON = (
  <svg fill="none" viewBox="0 0 16 16" role="presentation" width="16" height="16">
    <path fill="currentcolor" fillRule="evenodd" d="M16 2.375C16 1.615 15.384 1 14.625 1h-7.75C6.115 1 5.5 1.616 5.5 2.375v11.25c0 .76.616 1.375 1.375 1.375h7.75c.76 0 1.375-.616 1.375-1.375zm-1.5.125v11H7v-11zM4 2.375C4 1.615 3.384 1 2.625 1h-1.25C.615 1 0 1.616 0 2.375v11.25C0 14.385.616 15 1.375 15h1.25C3.385 15 4 14.384 4 13.625zM2.5 2.5v11h-1v-11z" clipRule="evenodd"></path>
  </svg>
);

const TABLE_ICON = (
  <svg fill="none" viewBox="0 0 16 16" role="presentation" width="16" height="16">
    <path fill="currentcolor" d="M14.5 8.75h-8v3.75H14a.5.5 0 0 0 .5-.5zM1.5 12a.5.5 0 0 0 .5.5h3V8.75H1.5zm13-8a.5.5 0 0 0-.5-.5H6.5v3.75h8zm-13 3.25H5V3.5H2a.5.5 0 0 0-.5.5zM16 12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"></path>
  </svg>
);

export function MenuRecordListHeader({ view, onViewChange }: MenuRecordListHeaderProps) {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';

  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label: 'Bản ghi thực đơn' },
        ]}
        homeHref={homeHref}
      />
      <div className={styles.viewSwitchContainer}>
        <button
          className={`${styles.switchButton} ${view === 'ui' ? styles.active : ''}`}
          onClick={() => onViewChange('ui')}
          title="Xem dạng UI"
        >
          {UI_ICON}
        </button>
        <button
          className={`${styles.switchButton} ${view === 'table' ? styles.active : ''}`}
          onClick={() => onViewChange('table')}
          title="Xem dạng bảng"
        >
          {TABLE_ICON}
        </button>
      </div>
    </div>
  );
}
