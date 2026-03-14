'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './feedback-type-list-header.module.css';

export function FeedbackTypeListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Loại phản hồi</h4>
      <Breadcrumbs
        items={[
          { label: 'Loại phản hồi' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
