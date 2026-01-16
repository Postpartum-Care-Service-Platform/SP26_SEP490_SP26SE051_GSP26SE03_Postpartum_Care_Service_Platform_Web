'use client';

import { PackageListHeader } from './components/PackageListHeader';
import styles from './package.module.css';

export default function AdminPackagePage() {
  return (
    <div className={styles.pageContainer}>
      <PackageListHeader />
      <div className={styles.content}>
        <p>Nội dung trang gói dịch vụ sẽ được thêm sau.</p>
      </div>
    </div>
  );
}

