'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import styles from './notification-table-controls.module.css';

type Props = {
  onCreateClick: () => void;
  label?: string;
};

export function NotificationTableControls({ onCreateClick, label = 'Thêm thông báo' }: Props) {
  return (
    <div className={styles.controls}>
      <h3 className={styles.title}>Danh sách thông báo</h3>
      <Button variant="primary" onClick={onCreateClick} className={styles.createButton}>
        <PlusIcon />
        {label}
      </Button>
    </div>
  );
}

