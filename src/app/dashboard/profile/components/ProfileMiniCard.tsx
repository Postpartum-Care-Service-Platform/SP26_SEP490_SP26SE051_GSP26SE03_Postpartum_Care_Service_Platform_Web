'use client';

import styles from './profile-mini-card.module.css';

type Props = {
  title: string;
  value: string;
  description?: string;
  progress?: number;
};

export function ProfileMiniCard({ title, value, description, progress }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>{title}</div>
      <div className={styles.value}>{value}</div>
      {description && <div className={styles.description}>{description}</div>}
      {typeof progress === 'number' && (
        <div className={styles.progress}>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} />
          </div>
          <span className={styles.progressLabel}>{progress}%</span>
        </div>
      )}
    </div>
  );
}

