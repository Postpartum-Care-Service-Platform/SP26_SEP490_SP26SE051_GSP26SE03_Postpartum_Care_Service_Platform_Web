'use client';

import { formatMessageDate } from './utils/formatMessageTime';

import styles from './date-separator.module.css';

type Props = {
  timestamp: string;
};

export function DateSeparator({ timestamp }: Props) {
  const dateText = formatMessageDate(timestamp);

  return (
    <div className={styles.separator}>
      <div className={styles.line} />
      <span className={styles.dateText}>{dateText}</span>
      <div className={styles.line} />
    </div>
  );
}

